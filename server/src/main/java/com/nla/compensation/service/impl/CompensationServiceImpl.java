package com.nla.compensation.service.impl;

import com.nla.audit.entity.AuditAction;
import com.nla.audit.service.AuditService;
import com.nla.common.exception.BusinessRuleException;
import com.nla.common.exception.ResourceNotFoundException;
import com.nla.compensation.dto.CompensationRequest;
import com.nla.compensation.dto.CompensationResponse;
import com.nla.compensation.dto.PaymentConfirmationRequest;
import com.nla.compensation.entity.Compensation;
import com.nla.compensation.entity.PaymentStatus;
import com.nla.compensation.repository.CompensationRepository;
import com.nla.compensation.service.CompensationService;
import com.nla.land.entity.AcquisitionStatus;
import com.nla.land.entity.LandParcel;
import com.nla.land.repository.LandParcelRepository;
import com.nla.project.entity.Project;
import com.nla.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CompensationServiceImpl implements CompensationService {

    private final CompensationRepository compensationRepository;
    private final ProjectRepository projectRepository;
    private final LandParcelRepository landParcelRepository;
    private final AuditService auditService;

    @Override
    @Transactional
    public CompensationResponse createCompensation(CompensationRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", request.getProjectId()));

        LandParcel parcel = landParcelRepository.findById(request.getParcelId())
                .orElseThrow(() -> new ResourceNotFoundException("LandParcel", "id", request.getParcelId()));

        if (!parcel.getProject().getId().equals(project.getId())) {
            throw new BusinessRuleException("Parcel " + parcel.getParcelNumber() + " does not belong to project " + project.getProjectCode());
        }

        BigDecimal approved = request.getApprovedAmount() != null ? request.getApprovedAmount() : request.getAssessedAmount();
        PaymentStatus status = request.getPaymentStatus() != null ? request.getPaymentStatus() : PaymentStatus.ASSESSED;

        Compensation comp = Compensation.builder()
                .project(project)
                .parcel(parcel)
                .beneficiaryName(request.getBeneficiaryName())
                .beneficiaryType(request.getBeneficiaryType() != null ? request.getBeneficiaryType() : "TITLE_HOLDER")
                .bankAccountNumberMasked(request.getBankAccountNumberMasked())
                .ifscCode(request.getIfscCode())
                .assessedAmount(request.getAssessedAmount())
                .approvedAmount(approved)
                .paidAmount(BigDecimal.ZERO)
                .paymentStatus(status)
                .remarks(request.getRemarks())
                .build();

        Compensation saved = compensationRepository.save(comp);

        parcel.setAcquisitionStatus(AcquisitionStatus.COMPENSATION_PENDING);
        landParcelRepository.save(parcel);

        auditService.logAction(
                "Compensation",
                saved.getId(),
                AuditAction.CREATED,
                null,
                saved.getPaymentStatus().name(),
                null,
                "Compensation assessed for beneficiary: " + saved.getBeneficiaryName() + " (INR " + saved.getAssessedAmount() + ")"
        );

        return CompensationResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CompensationResponse getCompensationById(Long id) {
        Compensation comp = compensationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compensation", "id", id));
        return CompensationResponse.fromEntity(comp);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompensationResponse> getCompensations(Long projectId, Long parcelId, PaymentStatus status, Pageable pageable) {
        return compensationRepository.findByFilters(projectId, parcelId, status, pageable)
                .map(CompensationResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompensationResponse> getCompensationsByProject(Long projectId) {
        return compensationRepository.findByProjectId(projectId).stream()
                .map(CompensationResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public CompensationResponse updateCompensation(Long id, CompensationRequest request) {
        Compensation comp = compensationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compensation", "id", id));

        comp.setBeneficiaryName(request.getBeneficiaryName());
        if (request.getBeneficiaryType() != null) comp.setBeneficiaryType(request.getBeneficiaryType());
        comp.setBankAccountNumberMasked(request.getBankAccountNumberMasked());
        comp.setIfscCode(request.getIfscCode());
        comp.setAssessedAmount(request.getAssessedAmount());
        if (request.getApprovedAmount() != null) comp.setApprovedAmount(request.getApprovedAmount());
        if (request.getPaymentStatus() != null) comp.setPaymentStatus(request.getPaymentStatus());
        comp.setRemarks(request.getRemarks());

        Compensation saved = compensationRepository.save(comp);

        auditService.logAction(
                "Compensation",
                saved.getId(),
                AuditAction.UPDATED,
                null,
                saved.getPaymentStatus().name(),
                null,
                "Compensation record updated"
        );

        return CompensationResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public CompensationResponse approveCompensation(Long id) {
        Compensation comp = compensationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compensation", "id", id));

        PaymentStatus oldStatus = comp.getPaymentStatus();
        comp.setPaymentStatus(PaymentStatus.APPROVED);
        if (comp.getApprovedAmount() == null) {
            comp.setApprovedAmount(comp.getAssessedAmount());
        }

        Compensation saved = compensationRepository.save(comp);

        auditService.logAction(
                "Compensation",
                saved.getId(),
                AuditAction.APPROVED,
                oldStatus.name(),
                PaymentStatus.APPROVED.name(),
                getCurrentUser(),
                "Compensation approved for disbursement: INR " + saved.getApprovedAmount()
        );

        return CompensationResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public CompensationResponse markPaid(Long id, PaymentConfirmationRequest request) {
        Compensation comp = compensationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compensation", "id", id));

        PaymentStatus oldStatus = comp.getPaymentStatus();
        BigDecimal newPaidTotal = comp.getPaidAmount().add(request.getPaidAmount());
        comp.setPaidAmount(newPaidTotal);
        comp.setPaymentDate(request.getPaymentDate());
        comp.setTransactionReference(request.getTransactionReference());
        comp.setPaymentMode(request.getPaymentMode());

        BigDecimal targetAmount = comp.getApprovedAmount() != null ? comp.getApprovedAmount() : comp.getAssessedAmount();
        if (newPaidTotal.compareTo(targetAmount) >= 0) {
            comp.setPaymentStatus(PaymentStatus.PAID);
        } else {
            comp.setPaymentStatus(PaymentStatus.PARTIALLY_PAID);
        }

        if (request.getRemarks() != null) {
            comp.setRemarks(request.getRemarks());
        }

        Compensation saved = compensationRepository.save(comp);

        // Update land parcel status to COMPENSATION_PAID if fully paid
        if (saved.getPaymentStatus() == PaymentStatus.PAID) {
            LandParcel parcel = saved.getParcel();
            parcel.setAcquisitionStatus(AcquisitionStatus.COMPENSATION_PAID);
            landParcelRepository.save(parcel);
        }

        auditService.logAction(
                "Compensation",
                saved.getId(),
                AuditAction.PAYMENT_COMPLETED,
                oldStatus.name(),
                saved.getPaymentStatus().name(),
                getCurrentUser(),
                "Payment disbursed: INR " + request.getPaidAmount() + " (Ref: " + request.getTransactionReference() + ")"
        );

        return CompensationResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteCompensation(Long id) {
        Compensation comp = compensationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Compensation", "id", id));

        compensationRepository.delete(comp);

        auditService.logAction(
                "Compensation",
                id,
                AuditAction.DELETED,
                null,
                null,
                null,
                "Compensation record deleted"
        );
    }

    private String getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.isAuthenticated()) ? auth.getName() : "TREASURY_OFFICER";
    }
}
