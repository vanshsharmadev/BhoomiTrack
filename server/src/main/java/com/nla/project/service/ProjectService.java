package com.nla.project.service;

import com.nla.project.dto.ProjectRequest;
import com.nla.project.dto.ProjectResponse;
import com.nla.project.entity.ProjectStatus;
import com.nla.project.entity.ProjectType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProjectService {

    ProjectResponse createProject(ProjectRequest request);

    ProjectResponse getProjectById(Long id);

    ProjectResponse getProjectByCode(String code);

    Page<ProjectResponse> getProjects(String state, String district, ProjectStatus status, ProjectType projectType, Pageable pageable);

    ProjectResponse updateProject(Long id, ProjectRequest request);

    ProjectResponse updateProjectStatus(Long id, ProjectStatus newStatus, String remarks);

    void deleteProject(Long id);
}
