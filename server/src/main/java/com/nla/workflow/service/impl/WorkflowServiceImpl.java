package com.nla.workflow.service.impl;

import com.nla.audit.entity.AuditAction;
import com.nla.audit.service.AuditService;
import com.nla.common.exception.ResourceNotFoundException;
import com.nla.project.entity.Project;
import com.nla.project.repository.ProjectRepository;
import com.nla.workflow.dto.MilestoneRequest;
import com.nla.workflow.dto.MilestoneResponse;
import com.nla.workflow.entity.MilestoneStatus;
import com.nla.workflow.entity.MilestoneType;
import com.nla.workflow.entity.ProjectMilestone;
import com.nla.workflow.repository.ProjectMilestoneRepository;
import com.nla.workflow.service.WorkflowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkflowServiceImpl implements WorkflowService {

    private final ProjectMilestoneRepository milestoneRepository;
    private final ProjectRepository projectRepository;
    private final AuditService auditService;

    @Override
    @Transactional(readOnly = true)
    public List<MilestoneResponse> getMilestonesByProject(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project", "id", projectId);
        }
        return milestoneRepository.findByProjectIdOrderBySequenceOrderAsc(projectId).stream()
                .map(this::computeAndMapMilestone)
                .toList();
    }

    @Override
    @Transactional
    public MilestoneResponse addMilestone(Long projectId, MilestoneRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        ProjectMilestone milestone = ProjectMilestone.builder()
                .project(project)
                .milestone(request.getMilestone())
                .customName(request.getCustomName() != null ? request.getCustomName() : request.getMilestone().name())
                .sequenceOrder(request.getSequenceOrder() != null ? request.getSequenceOrder() : 1)
                .plannedDate(request.getPlannedDate())
                .actualDate(request.getActualDate())
                .status(request.getStatus() != null ? request.getStatus() : MilestoneStatus.NOT_STARTED)
                .remarks(request.getRemarks())
                .build();

        computeDelay(milestone);
        ProjectMilestone saved = milestoneRepository.save(milestone);

        auditService.logAction(
                "ProjectMilestone",
                saved.getId(),
                AuditAction.CREATED,
                null,
                saved.getStatus().name(),
                null,
                "Milestone configured: " + saved.getCustomName() + " for project " + project.getProjectCode()
        );

        return MilestoneResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public MilestoneResponse updateMilestone(Long milestoneId, MilestoneRequest request) {
        ProjectMilestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new ResourceNotFoundException("ProjectMilestone", "id", milestoneId));

        milestone.setMilestone(request.getMilestone());
        if (request.getCustomName() != null) milestone.setCustomName(request.getCustomName());
        if (request.getSequenceOrder() != null) milestone.setSequenceOrder(request.getSequenceOrder());
        milestone.setPlannedDate(request.getPlannedDate());
        milestone.setActualDate(request.getActualDate());
        if (request.getStatus() != null) milestone.setStatus(request.getStatus());
        milestone.setRemarks(request.getRemarks());

        computeDelay(milestone);
        ProjectMilestone saved = milestoneRepository.save(milestone);

        auditService.logAction(
                "ProjectMilestone",
                saved.getId(),
                AuditAction.UPDATED,
                null,
                saved.getStatus().name(),
                null,
                "Milestone updated: " + saved.getCustomName()
        );

        return MilestoneResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public List<MilestoneResponse> initializeProjectLifecycle(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        LocalDate baseDate = project.getProjectStartDate() != null ? project.getProjectStartDate() : LocalDate.now();

        MilestoneType[] stages = {
                MilestoneType.PROPOSAL_SUBMISSION,
                MilestoneType.PROPOSAL_APPROVAL,
                MilestoneType.PRELIMINARY_NOTIFICATION,
                MilestoneType.FINAL_NOTIFICATION,
                MilestoneType.AWARD_DECLARATION,
                MilestoneType.COMPENSATION_DISBURSEMENT,
                MilestoneType.POSSESSION_TAKEN,
                MilestoneType.REHABILITATION_RESETTLEMENT,
                MilestoneType.PROJECT_ACQUISITION_COMPLETION
        };

        int[] offsetsMonths = {0, 2, 4, 8, 12, 15, 18, 20, 24};
        List<ProjectMilestone> createdList = new ArrayList<>();

        for (int i = 0; i < stages.length; i++) {
            MilestoneType type = stages[i];
            if (milestoneRepository.findByProjectIdAndMilestone(projectId, type).isEmpty()) {
                ProjectMilestone m = ProjectMilestone.builder()
                        .project(project)
                        .milestone(type)
                        .customName(type.name().replace('_', ' '))
                        .sequenceOrder(i + 1)
                        .plannedDate(baseDate.plusMonths(offsetsMonths[i]))
                        .status(i == 0 ? MilestoneStatus.IN_PROGRESS : MilestoneStatus.NOT_STARTED)
                        .delayDays(0L)
                        .build();
                computeDelay(m);
                createdList.add(milestoneRepository.save(m));
            }
        }

        auditService.logAction(
                "Project",
                project.getId(),
                AuditAction.UPDATED,
                null,
                project.getStatus().name(),
                null,
                "Standard acquisition lifecycle milestones initialized"
        );

        return milestoneRepository.findByProjectIdOrderBySequenceOrderAsc(projectId).stream()
                .map(this::computeAndMapMilestone)
                .toList();
    }

    @Override
    @Transactional
    public void deleteMilestone(Long milestoneId) {
        ProjectMilestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new ResourceNotFoundException("ProjectMilestone", "id", milestoneId));
        milestoneRepository.delete(milestone);
    }

    private void computeDelay(ProjectMilestone m) {
        LocalDate planned = m.getPlannedDate();
        LocalDate actual = m.getActualDate();
        LocalDate today = LocalDate.now();

        if (actual != null) {
            long days = ChronoUnit.DAYS.between(planned, actual);
            m.setDelayDays(Math.max(0, days));
            if (m.getStatus() != MilestoneStatus.COMPLETED) {
                m.setStatus(days > 0 ? MilestoneStatus.DELAYED : MilestoneStatus.COMPLETED);
            }
        } else if (today.isAfter(planned) && m.getStatus() != MilestoneStatus.COMPLETED) {
            long days = ChronoUnit.DAYS.between(planned, today);
            m.setDelayDays(days);
            m.setStatus(MilestoneStatus.DELAYED);
        } else {
            m.setDelayDays(0L);
        }
    }

    private MilestoneResponse computeAndMapMilestone(ProjectMilestone m) {
        computeDelay(m);
        return MilestoneResponse.fromEntity(m);
    }
}
