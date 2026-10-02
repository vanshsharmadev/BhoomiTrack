package com.nla.project.controller;

import com.nla.common.dto.ApiResponse;
import com.nla.project.dto.ProjectRequest;
import com.nla.project.dto.ProjectResponse;
import com.nla.project.dto.ProjectStatusUpdateRequest;
import com.nla.project.entity.ProjectStatus;
import com.nla.project.entity.ProjectType;
import com.nla.project.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Project Module", description = "Lifecycle management for infrastructure acquisition projects")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @Operation(summary = "Create a new project")
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(@Valid @RequestBody ProjectRequest request) {
        ProjectResponse response = projectService.createProject(request);
        return new ResponseEntity<>(ApiResponse.created(response, "Project created successfully"), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get list of projects with filtering by state, district, status, and projectType")
    public ResponseEntity<ApiResponse<Page<ProjectResponse>>> getProjects(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) ProjectType projectType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProjectResponse> result = projectService.getProjects(state, district, status, projectType, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project details by ID")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable Long id) {
        ProjectResponse response = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update project details")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request
    ) {
        ProjectResponse response = projectService.updateProject(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Project updated successfully"));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update project lifecycle status")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProjectStatus(
            @PathVariable Long id,
            @Valid @RequestBody ProjectStatusUpdateRequest request
    ) {
        ProjectResponse response = projectService.updateProjectStatus(id, request.getStatus(), request.getRemarks());
        return ResponseEntity.ok(ApiResponse.success(response, "Project status updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a project")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Project deleted successfully"));
    }
}
