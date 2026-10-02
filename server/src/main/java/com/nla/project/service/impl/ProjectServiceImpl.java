package com.nla.project.service.impl;

import com.nla.audit.entity.AuditAction;
import com.nla.audit.service.AuditService;
import com.nla.common.exception.BusinessRuleException;
import com.nla.common.exception.ResourceNotFoundException;
import com.nla.project.dto.ProjectRequest;
import com.nla.project.dto.ProjectResponse;
import com.nla.project.entity.Project;
import com.nla.project.entity.ProjectStatus;
import com.nla.project.entity.ProjectType;
import com.nla.project.repository.ProjectRepository;
import com.nla.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final AuditService auditService;

    @Override
    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        String code = request.getProjectCode();
        if (code == null || code.isBlank()) {
            code = "PRJ-" + System.currentTimeMillis() % 1000000;
        }

        if (projectRepository.existsByProjectCode(code)) {
            throw new BusinessRuleException("Project with code '" + code + "' already exists");
        }

        Project project = Project.builder()
                .projectCode(code)
                .projectName(request.getProjectName())
                .projectType(request.getProjectType())
                .description(request.getDescription())
                .implementingAgency(request.getImplementingAgency())
                .ministryDepartment(request.getMinistryDepartment())
                .state(request.getState())
                .district(request.getDistrict())
                .estimatedLandRequirement(request.getEstimatedLandRequirement())
                .requiredLandUnit(request.getRequiredLandUnit() != null ? request.getRequiredLandUnit() : "ACRES")
                .projectStartDate(request.getProjectStartDate())
                .expectedCompletionDate(request.getExpectedCompletionDate())
                .status(request.getStatus() != null ? request.getStatus() : ProjectStatus.DRAFT)
                .build();

        Project saved = projectRepository.save(project);

        auditService.logAction(
                "Project",
                saved.getId(),
                AuditAction.CREATED,
                null,
                saved.getStatus().name(),
                null,
                "Project created: " + saved.getProjectName()
        );

        return ProjectResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return ProjectResponse.fromEntity(project);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectByCode(String code) {
        Project project = projectRepository.findByProjectCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "code", code));
        return ProjectResponse.fromEntity(project);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProjectResponse> getProjects(String state, String district, ProjectStatus status, ProjectType projectType, Pageable pageable) {
        return projectRepository.findByFilters(state, district, status, projectType, pageable)
                .map(ProjectResponse::fromEntity);
    }

    @Override
    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        project.setProjectName(request.getProjectName());
        project.setProjectType(request.getProjectType());
        project.setDescription(request.getDescription());
        project.setImplementingAgency(request.getImplementingAgency());
        project.setMinistryDepartment(request.getMinistryDepartment());
        project.setState(request.getState());
        project.setDistrict(request.getDistrict());
        project.setEstimatedLandRequirement(request.getEstimatedLandRequirement());
        if (request.getRequiredLandUnit() != null) {
            project.setRequiredLandUnit(request.getRequiredLandUnit());
        }
        project.setProjectStartDate(request.getProjectStartDate());
        project.setExpectedCompletionDate(request.getExpectedCompletionDate());

        Project saved = projectRepository.save(project);

        auditService.logAction(
                "Project",
                saved.getId(),
                AuditAction.UPDATED,
                null,
                saved.getStatus().name(),
                null,
                "Project details updated"
        );

        return ProjectResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public ProjectResponse updateProjectStatus(Long id, ProjectStatus newStatus, String remarks) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        ProjectStatus oldStatus = project.getStatus();
        if (oldStatus == newStatus) {
            return ProjectResponse.fromEntity(project);
        }

        project.setStatus(newStatus);
        Project saved = projectRepository.save(project);

        auditService.logAction(
                "Project",
                saved.getId(),
                AuditAction.STATUS_CHANGED,
                oldStatus.name(),
                newStatus.name(),
                null,
                remarks != null ? remarks : "Status updated from " + oldStatus + " to " + newStatus
        );

        return ProjectResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        projectRepository.delete(project);

        auditService.logAction(
                "Project",
                id,
                AuditAction.DELETED,
                project.getStatus().name(),
                null,
                null,
                "Project deleted: " + project.getProjectName()
        );
    }
}
