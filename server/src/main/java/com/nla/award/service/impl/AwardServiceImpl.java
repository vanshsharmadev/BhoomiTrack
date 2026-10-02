package com.nla.award.service.impl;

import com.nla.audit.entity.AuditAction;
import com.nla.audit.service.AuditService;
import com.nla.award.dto.AwardRequest;
import com.nla.award.dto.AwardResponse;
import com.nla.award.entity.Award;
import com.nla.award.entity.AwardStatus;
import com.nla.award.repository.AwardRepository;
import com.nla.award.service.AwardService;
import com.nla.common.exception.BusinessRuleException;
import com.nla.common.exception.ResourceNotFoundException;
import com.nla.land.entity.AcquisitionStatus;
import com.nla.land.entity.LandParcel;
import com.nla.land.repository.LandParcelRepository;
import com.nla.project.entity.Project;
import com.nla.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AwardServiceImpl implements AwardService {

    private final AwardRepository awardRepository;
    private final ProjectRepository projectRepository;
    private final LandParcelRepository landParcelRepository;
    private final AuditService auditService;

    @Override
    @Transactional
    public AwardResponse createAward(AwardRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", request.getProjectId()));

        LandParcel parcel = landParcelRepository.findById(request.getParcelId())
                .orElseThrow(() -> new ResourceNotFoundException("LandParcel", "id", request.getParcelId()));

        if (!parcel.getProject().getId().equals(project.getId())) {
            throw new BusinessRuleException("Land parcel " + parcel.getParcelNumber() + " does not belong to project " + project.getProjectCode());
        }

        if (awardRepository.existsByAwardNumber(request.getAwardNumber())) {
            throw new BusinessRuleException("Award with number '" + request.getAwardNumber() + "' already exists");
        }

        AwardStatus status = request.getStatus() != null ? request.getStatus() : AwardStatus.DECLARED;

        Award award = Award.builder()
                .project(project)
                .parcel(parcel)
                .awardNumber(request.getAwardNumber())
                .awardDate(request.getAwardDate())
                .assessedAmount(request.getAssessedAmount())
                .marketValue(request.getMarketValue())
                .solatium(request.getSolatium())
                .additionalAmount(request.getAdditionalAmount())
                .competentAuthority(request.getCompetentAuthority())
                .documentId(request.getDocumentId())
                .status(status)
                .remarks(request.getRemarks())
                .build();

        Award saved = awardRepository.save(award);

        if (status == AwardStatus.DECLARED || status == AwardStatus.FINALIZED) {
            parcel.setAcquisitionStatus(AcquisitionStatus.AWARD_DECLARED);
            landParcelRepository.save(parcel);
        }

        auditService.logAction(
                "Award",
                saved.getId(),
                AuditAction.AWARD_DECLARED,
                null,
                saved.getStatus().name(),
                request.getCompetentAuthority(),
                "Award declared for parcel " + parcel.getParcelNumber() + ": INR " + saved.getAssessedAmount()
        );

        return AwardResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AwardResponse getAwardById(Long id) {
        Award award = awardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Award", "id", id));
        return AwardResponse.fromEntity(award);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AwardResponse> getAwards(Long projectId, Long parcelId, AwardStatus status, Pageable pageable) {
        return awardRepository.findByFilters(projectId, parcelId, status, pageable)
                .map(AwardResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AwardResponse> getAwardsByProject(Long projectId) {
        return awardRepository.findByProjectId(projectId).stream()
                .map(AwardResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public AwardResponse updateAward(Long id, AwardRequest request) {
        Award award = awardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Award", "id", id));

        award.setAwardDate(request.getAwardDate());
        award.setAssessedAmount(request.getAssessedAmount());
        award.setMarketValue(request.getMarketValue());
        award.setSolatium(request.getSolatium());
        award.setAdditionalAmount(request.getAdditionalAmount());
        award.setCompetentAuthority(request.getCompetentAuthority());
        award.setDocumentId(request.getDocumentId());
        if (request.getStatus() != null) {
            award.setStatus(request.getStatus());
        }
        award.setRemarks(request.getRemarks());

        Award saved = awardRepository.save(award);

        auditService.logAction(
                "Award",
                saved.getId(),
                AuditAction.UPDATED,
                null,
                saved.getStatus().name(),
                null,
                "Award details updated"
        );

        return AwardResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteAward(Long id) {
        Award award = awardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Award", "id", id));

        awardRepository.delete(award);

        auditService.logAction(
                "Award",
                id,
                AuditAction.DELETED,
                award.getAwardNumber(),
                null,
                null,
                "Award deleted"
        );
    }
}
