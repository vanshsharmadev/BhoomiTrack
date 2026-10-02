package com.nla.proposal.service.impl;

import com.nla.audit.entity.AuditAction;
import com.nla.audit.service.AuditService;
import com.nla.common.exception.BusinessRuleException;
import com.nla.common.exception.ResourceNotFoundException;
import com.nla.project.entity.Project;
import com.nla.project.entity.ProjectStatus;
import com.nla.project.repository.ProjectRepository;
import com.nla.proposal.dto.ProposalApprovalRequest;
import com.nla.proposal.dto.ProposalRequest;
import com.nla.proposal.dto.ProposalResponse;
import com.nla.proposal.entity.Proposal;
import com.nla.proposal.entity.ProposalApprovalHistory;
import com.nla.proposal.entity.ProposalStatus;
import com.nla.proposal.repository.ProposalApprovalHistoryRepository;
import com.nla.proposal.repository.ProposalRepository;
import com.nla.proposal.service.ProposalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProposalServiceImpl implements ProposalService {

    private final ProposalRepository proposalRepository;
    private final ProposalApprovalHistoryRepository approvalHistoryRepository;
    private final ProjectRepository projectRepository;
    private final AuditService auditService;

    @Override
    @Transactional
    public ProposalResponse createProposal(ProposalRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", request.getProjectId()));

        String propNum = request.getProposalNumber();
        if (propNum == null || propNum.isBlank()) {
            propNum = "PROP-" + System.currentTimeMillis() % 1000000;
        }

        if (proposalRepository.existsByProposalNumber(propNum)) {
            throw new BusinessRuleException("Proposal number '" + propNum + "' already exists");
        }

        Proposal proposal = Proposal.builder()
                .proposalNumber(propNum)
                .project(project)
                .landRequired(request.getLandRequired())
                .landUnit(request.getLandUnit() != null ? request.getLandUnit() : "ACRES")
                .villages(request.getVillages())
                .district(request.getDistrict())
                .state(request.getState())
                .purpose(request.getPurpose())
                .proposedTimelineMonths(request.getProposedTimelineMonths())
                .affectedFamiliesCount(request.getAffectedFamiliesCount())
                .estimatedCompensation(request.getEstimatedCompensation())
                .status(ProposalStatus.DRAFT)
                .remarks(request.getRemarks())
                .build();

        Proposal saved = proposalRepository.save(proposal);

        auditService.logAction(
                "Proposal",
                saved.getId(),
                AuditAction.CREATED,
                null,
                ProposalStatus.DRAFT.name(),
                null,
                "Proposal draft created for project: " + project.getProjectName()
        );

        return ProposalResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ProposalResponse getProposalById(Long id) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal", "id", id));
        return ProposalResponse.fromEntity(proposal);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProposalResponse> getProposals(Long projectId, ProposalStatus status, String district, String state, Pageable pageable) {
        return proposalRepository.findByFilters(projectId, status, district, state, pageable)
                .map(ProposalResponse::fromEntity);
    }

    @Override
    @Transactional
    public ProposalResponse updateProposal(Long id, ProposalRequest request) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal", "id", id));

        if (proposal.getStatus() != ProposalStatus.DRAFT && proposal.getStatus() != ProposalStatus.RETURNED_FOR_CORRECTION) {
            throw new BusinessRuleException("Only proposals in DRAFT or RETURNED_FOR_CORRECTION status can be edited");
        }

        proposal.setLandRequired(request.getLandRequired());
        if (request.getLandUnit() != null) proposal.setLandUnit(request.getLandUnit());
        proposal.setVillages(request.getVillages());
        proposal.setDistrict(request.getDistrict());
        proposal.setState(request.getState());
        proposal.setPurpose(request.getPurpose());
        proposal.setProposedTimelineMonths(request.getProposedTimelineMonths());
        proposal.setAffectedFamiliesCount(request.getAffectedFamiliesCount());
        proposal.setEstimatedCompensation(request.getEstimatedCompensation());
        proposal.setRemarks(request.getRemarks());

        Proposal saved = proposalRepository.save(proposal);
        auditService.logAction("Proposal", saved.getId(), AuditAction.UPDATED, null, saved.getStatus().name(), null, "Proposal updated");
        return ProposalResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public ProposalResponse submitProposal(Long id, String submittedBy) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal", "id", id));

        if (proposal.getStatus() != ProposalStatus.DRAFT && proposal.getStatus() != ProposalStatus.RETURNED_FOR_CORRECTION) {
            throw new BusinessRuleException("Proposal can only be submitted from DRAFT or RETURNED_FOR_CORRECTION state");
        }

        ProposalStatus prevStatus = proposal.getStatus();
        proposal.setStatus(ProposalStatus.SUBMITTED);
        proposal.setSubmittedAt(LocalDateTime.now());
        proposal.setSubmittedBy(submittedBy != null ? submittedBy : getCurrentUser());

        Proposal saved = proposalRepository.save(proposal);

        recordApprovalHistory(saved, prevStatus, ProposalStatus.SUBMITTED, "SUBMIT", "Proposal submitted for review");

        auditService.logAction(
                "Proposal",
                saved.getId(),
                AuditAction.SUBMITTED,
                prevStatus.name(),
                ProposalStatus.SUBMITTED.name(),
                proposal.getSubmittedBy(),
                "Proposal submitted"
        );

        // Update project status to UNDER_REVIEW if it was in DRAFT/PROPOSED
        Project project = saved.getProject();
        if (project.getStatus() == ProjectStatus.DRAFT || project.getStatus() == ProjectStatus.PROPOSED) {
            project.setStatus(ProjectStatus.UNDER_REVIEW);
            projectRepository.save(project);
        }

        return ProposalResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public ProposalResponse approveProposal(Long id, ProposalApprovalRequest request) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal", "id", id));

        if (proposal.getStatus() != ProposalStatus.SUBMITTED && proposal.getStatus() != ProposalStatus.UNDER_VERIFICATION && proposal.getStatus() != ProposalStatus.FORWARDED) {
            throw new BusinessRuleException("Proposal cannot be approved from current status: " + proposal.getStatus());
        }

        ProposalStatus prevStatus = proposal.getStatus();
        proposal.setStatus(ProposalStatus.APPROVED);
        proposal.setReviewedAt(LocalDateTime.now());

        Proposal saved = proposalRepository.save(proposal);

        recordApprovalHistory(saved, prevStatus, ProposalStatus.APPROVED, "APPROVE", request.getComments());

        auditService.logAction(
                "Proposal",
                saved.getId(),
                AuditAction.APPROVED,
                prevStatus.name(),
                ProposalStatus.APPROVED.name(),
                getCurrentUser(),
                "Approved: " + request.getComments()
        );

        // Advance project status to IN_ACQUISITION / APPROVED
        Project project = saved.getProject();
        project.setStatus(ProjectStatus.IN_ACQUISITION);
        projectRepository.save(project);

        return ProposalResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public ProposalResponse rejectProposal(Long id, ProposalApprovalRequest request) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal", "id", id));

        ProposalStatus prevStatus = proposal.getStatus();
        proposal.setStatus(ProposalStatus.REJECTED);
        proposal.setReviewedAt(LocalDateTime.now());

        Proposal saved = proposalRepository.save(proposal);

        recordApprovalHistory(saved, prevStatus, ProposalStatus.REJECTED, "REJECT", request.getComments());

        auditService.logAction(
                "Proposal",
                saved.getId(),
                AuditAction.REJECTED,
                prevStatus.name(),
                ProposalStatus.REJECTED.name(),
                getCurrentUser(),
                "Rejected: " + request.getComments()
        );

        return ProposalResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public ProposalResponse returnProposal(Long id, ProposalApprovalRequest request) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal", "id", id));

        ProposalStatus prevStatus = proposal.getStatus();
        proposal.setStatus(ProposalStatus.RETURNED_FOR_CORRECTION);
        proposal.setReviewedAt(LocalDateTime.now());

        Proposal saved = proposalRepository.save(proposal);

        recordApprovalHistory(saved, prevStatus, ProposalStatus.RETURNED_FOR_CORRECTION, "RETURN", request.getComments());

        auditService.logAction(
                "Proposal",
                saved.getId(),
                AuditAction.RETURNED,
                prevStatus.name(),
                ProposalStatus.RETURNED_FOR_CORRECTION.name(),
                getCurrentUser(),
                "Returned for correction: " + request.getComments()
        );

        return ProposalResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProposalApprovalHistory> getApprovalHistory(Long id) {
        if (!proposalRepository.existsById(id)) {
            throw new ResourceNotFoundException("Proposal", "id", id);
        }
        return approvalHistoryRepository.findByProposalIdOrderByTimestampDesc(id);
    }

    private void recordApprovalHistory(Proposal proposal, ProposalStatus from, ProposalStatus to, String action, String comments) {
        ProposalApprovalHistory history = ProposalApprovalHistory.builder()
                .proposal(proposal)
                .fromStatus(from)
                .toStatus(to)
                .action(action)
                .reviewedBy(getCurrentUser())
                .reviewerRole(getCurrentRole())
                .comments(comments)
                .timestamp(LocalDateTime.now())
                .build();
        approvalHistoryRepository.save(history);
    }

    private String getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.isAuthenticated()) ? auth.getName() : "OFFICER";
    }

    private String getCurrentRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getAuthorities().isEmpty()) {
            return auth.getAuthorities().iterator().next().getAuthority();
        }
        return "AUTHORITY";
    }
}
