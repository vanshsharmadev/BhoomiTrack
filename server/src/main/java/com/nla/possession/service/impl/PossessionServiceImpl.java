package com.nla.possession.service.impl;

import com.nla.audit.entity.AuditAction;
import com.nla.audit.service.AuditService;
import com.nla.common.exception.BusinessRuleException;
import com.nla.common.exception.ResourceNotFoundException;
import com.nla.land.entity.AcquisitionStatus;
import com.nla.land.entity.LandParcel;
import com.nla.land.repository.LandParcelRepository;
import com.nla.possession.dto.PossessionRequest;
import com.nla.possession.dto.PossessionResponse;
import com.nla.possession.dto.PossessionStatusUpdateRequest;
import com.nla.possession.entity.Possession;
import com.nla.possession.entity.PossessionStatus;
import com.nla.possession.repository.PossessionRepository;
import com.nla.possession.service.PossessionService;
import com.nla.project.entity.Project;
import com.nla.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PossessionServiceImpl implements PossessionService {

    private final PossessionRepository possessionRepository;
    private final ProjectRepository projectRepository;
    private final LandParcelRepository landParcelRepository;
    private final AuditService auditService;

    @Override
    @Transactional
    public PossessionResponse createPossession(PossessionRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", request.getProjectId()));

        LandParcel parcel = landParcelRepository.findById(request.getParcelId())
                .orElseThrow(() -> new ResourceNotFoundException("LandParcel", "id", request.getParcelId()));

        if (!parcel.getProject().getId().equals(project.getId())) {
            throw new BusinessRuleException("Land parcel does not belong to project " + project.getProjectCode());
        }

        // Section 22: Possession should not be marked complete before the required acquisition stage
        PossessionStatus initialStatus = request.getPossessionStatus() != null ? request.getPossessionStatus() : PossessionStatus.PENDING;
        if (initialStatus == PossessionStatus.TAKEN) {
            validateCanTakePossession(parcel);
        }

        Possession possession = Possession.builder()
                .project(project)
                .parcel(parcel)
                .possessionDate(request.getPossessionDate() != null ? request.getPossessionDate() : LocalDate.now())
                .possessionStatus(initialStatus)
                .possessionOfficer(request.getPossessionOfficer())
                .inspectionReference(request.getInspectionReference())
                .panchnamaDocumentId(request.getPanchnamaDocumentId())
                .remarks(request.getRemarks())
                .build();

        Possession saved = possessionRepository.save(possession);

        if (initialStatus == PossessionStatus.TAKEN) {
            parcel.setAcquisitionStatus(AcquisitionStatus.POSSESSION_TAKEN);
            landParcelRepository.save(parcel);
        } else {
            parcel.setAcquisitionStatus(AcquisitionStatus.POSSESSION_PENDING);
            landParcelRepository.save(parcel);
        }

        auditService.logAction(
                "Possession",
                saved.getId(),
                AuditAction.CREATED,
                null,
                saved.getPossessionStatus().name(),
                request.getPossessionOfficer(),
                "Possession record scheduled/created for parcel " + parcel.getParcelNumber()
        );

        return PossessionResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PossessionResponse getPossessionById(Long id) {
        Possession possession = possessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Possession", "id", id));
        return PossessionResponse.fromEntity(possession);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PossessionResponse> getPossessions(Long projectId, Long parcelId, PossessionStatus status, Pageable pageable) {
        return possessionRepository.findByFilters(projectId, parcelId, status, pageable)
                .map(PossessionResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PossessionResponse> getPossessionsByProject(Long projectId) {
        return possessionRepository.findByProjectId(projectId).stream()
                .map(PossessionResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public PossessionResponse updateStatus(Long id, PossessionStatusUpdateRequest request) {
        Possession possession = possessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Possession", "id", id));

        PossessionStatus oldStatus = possession.getPossessionStatus();
        if (request.getStatus() == PossessionStatus.TAKEN) {
            validateCanTakePossession(possession.getParcel());
            possession.setPossessionDate(request.getPossessionDate() != null ? request.getPossessionDate() : LocalDate.now());
        }

        possession.setPossessionStatus(request.getStatus());
        if (request.getRemarks() != null) {
            possession.setRemarks(request.getRemarks());
        }

        Possession saved = possessionRepository.save(possession);

        if (request.getStatus() == PossessionStatus.TAKEN) {
            LandParcel parcel = saved.getParcel();
            parcel.setAcquisitionStatus(AcquisitionStatus.POSSESSION_TAKEN);
            landParcelRepository.save(parcel);
        }

        auditService.logAction(
                "Possession",
                saved.getId(),
                AuditAction.POSSESSION_TAKEN,
                oldStatus.name(),
                request.getStatus().name(),
                possession.getPossessionOfficer(),
                request.getRemarks() != null ? request.getRemarks() : "Possession status updated"
        );

        return PossessionResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deletePossession(Long id) {
        Possession possession = possessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Possession", "id", id));

        possessionRepository.delete(possession);

        auditService.logAction("Possession", id, AuditAction.DELETED, null, null, null, "Possession record deleted");
    }

    private void validateCanTakePossession(LandParcel parcel) {
        AcquisitionStatus status = parcel.getAcquisitionStatus();
        if (status == AcquisitionStatus.PROPOSED || status == AcquisitionStatus.IDENTIFIED || status == AcquisitionStatus.VERIFIED) {
            throw new BusinessRuleException("Cannot take physical possession of parcel " + parcel.getParcelNumber() +
                    " prior to statutory award declaration and compensation proceedings (current stage: " + status + ")");
        }
    }
}
