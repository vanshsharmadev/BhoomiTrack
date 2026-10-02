package com.nla.rehabilitation.service.impl;

import com.nla.audit.entity.AuditAction;
import com.nla.audit.service.AuditService;
import com.nla.common.exception.ResourceNotFoundException;
import com.nla.project.entity.Project;
import com.nla.project.repository.ProjectRepository;
import com.nla.rehabilitation.dto.AffectedFamilyRequest;
import com.nla.rehabilitation.dto.AffectedFamilyResponse;
import com.nla.rehabilitation.dto.FamilyStatusUpdateRequest;
import com.nla.rehabilitation.entity.AffectedFamily;
import com.nla.rehabilitation.entity.FamilyCategory;
import com.nla.rehabilitation.entity.RehabilitationStatus;
import com.nla.rehabilitation.repository.AffectedFamilyRepository;
import com.nla.rehabilitation.service.RehabilitationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RehabilitationServiceImpl implements RehabilitationService {

    private final AffectedFamilyRepository familyRepository;
    private final ProjectRepository projectRepository;
    private final AuditService auditService;

    @Override
    @Transactional
    public AffectedFamilyResponse createAffectedFamily(AffectedFamilyRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", request.getProjectId()));

        AffectedFamily family = AffectedFamily.builder()
                .project(project)
                .familyHeadName(request.getFamilyHeadName())
                .familyMemberCount(request.getFamilyMemberCount() != null ? request.getFamilyMemberCount() : 1)
                .category(request.getCategory() != null ? request.getCategory() : FamilyCategory.AFFECTED)
                .socialCategory(request.getSocialCategory())
                .village(request.getVillage())
                .district(request.getDistrict())
                .state(request.getState())
                .entitlementDetails(request.getEntitlementDetails())
                .assistanceAmount(request.getAssistanceAmount())
                .assistanceProvided(request.getAssistanceProvided() != null ? request.getAssistanceProvided() : BigDecimal.ZERO)
                .alternativeSiteAllotted(request.getAlternativeSiteAllotted() != null ? request.getAlternativeSiteAllotted() : false)
                .alternativeSiteDetails(request.getAlternativeSiteDetails())
                .rehabilitationStatus(request.getRehabilitationStatus() != null ? request.getRehabilitationStatus() : RehabilitationStatus.IDENTIFIED)
                .completionDate(request.getCompletionDate())
                .remarks(request.getRemarks())
                .build();

        AffectedFamily saved = familyRepository.save(family);

        auditService.logAction(
                "AffectedFamily",
                saved.getId(),
                AuditAction.CREATED,
                null,
                saved.getRehabilitationStatus().name(),
                null,
                "R&R family record registered: " + saved.getFamilyHeadName() + " (" + saved.getCategory() + ")"
        );

        return AffectedFamilyResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AffectedFamilyResponse getFamilyById(Long id) {
        AffectedFamily family = familyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AffectedFamily", "id", id));
        return AffectedFamilyResponse.fromEntity(family);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AffectedFamilyResponse> getFamilies(Long projectId, FamilyCategory category, RehabilitationStatus status, String district, Pageable pageable) {
        return familyRepository.findByFilters(projectId, category, status, district, pageable)
                .map(AffectedFamilyResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AffectedFamilyResponse> getFamiliesByProject(Long projectId) {
        return familyRepository.findByProjectId(projectId).stream()
                .map(AffectedFamilyResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public AffectedFamilyResponse updateFamily(Long id, AffectedFamilyRequest request) {
        AffectedFamily family = familyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AffectedFamily", "id", id));

        family.setFamilyHeadName(request.getFamilyHeadName());
        family.setFamilyMemberCount(request.getFamilyMemberCount());
        family.setCategory(request.getCategory());
        family.setSocialCategory(request.getSocialCategory());
        family.setVillage(request.getVillage());
        family.setDistrict(request.getDistrict());
        family.setState(request.getState());
        family.setEntitlementDetails(request.getEntitlementDetails());
        family.setAssistanceAmount(request.getAssistanceAmount());
        if (request.getAssistanceProvided() != null) family.setAssistanceProvided(request.getAssistanceProvided());
        if (request.getAlternativeSiteAllotted() != null) family.setAlternativeSiteAllotted(request.getAlternativeSiteAllotted());
        family.setAlternativeSiteDetails(request.getAlternativeSiteDetails());
        if (request.getRehabilitationStatus() != null) family.setRehabilitationStatus(request.getRehabilitationStatus());
        family.setCompletionDate(request.getCompletionDate());
        family.setRemarks(request.getRemarks());

        AffectedFamily saved = familyRepository.save(family);

        auditService.logAction(
                "AffectedFamily",
                saved.getId(),
                AuditAction.UPDATED,
                null,
                saved.getRehabilitationStatus().name(),
                null,
                "R&R family record updated"
        );

        return AffectedFamilyResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public AffectedFamilyResponse updateStatus(Long id, FamilyStatusUpdateRequest request) {
        AffectedFamily family = familyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AffectedFamily", "id", id));

        RehabilitationStatus oldStatus = family.getRehabilitationStatus();
        family.setRehabilitationStatus(request.getStatus());

        if (request.getAdditionalAssistanceProvided() != null) {
            family.setAssistanceProvided(family.getAssistanceProvided().add(request.getAdditionalAssistanceProvided()));
        }

        if (request.getAlternativeSiteAllotted() != null) {
            family.setAlternativeSiteAllotted(request.getAlternativeSiteAllotted());
        }

        if (request.getAlternativeSiteDetails() != null) {
            family.setAlternativeSiteDetails(request.getAlternativeSiteDetails());
        }

        if (request.getStatus() == RehabilitationStatus.COMPLETED) {
            family.setCompletionDate(request.getCompletionDate() != null ? request.getCompletionDate() : LocalDate.now());
        }

        if (request.getRemarks() != null) {
            family.setRemarks(request.getRemarks());
        }

        AffectedFamily saved = familyRepository.save(family);

        auditService.logAction(
                "AffectedFamily",
                saved.getId(),
                AuditAction.STATUS_CHANGED,
                oldStatus.name(),
                saved.getRehabilitationStatus().name(),
                null,
                request.getRemarks() != null ? request.getRemarks() : "R&R status updated"
        );

        return AffectedFamilyResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteFamily(Long id) {
        AffectedFamily family = familyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AffectedFamily", "id", id));

        familyRepository.delete(family);

        auditService.logAction("AffectedFamily", id, AuditAction.DELETED, null, null, null, "R&R family record deleted");
    }
}
