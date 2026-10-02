package com.nla.workflow.controller;

import com.nla.common.dto.ApiResponse;
import com.nla.workflow.dto.MilestoneRequest;
import com.nla.workflow.dto.MilestoneResponse;
import com.nla.workflow.service.WorkflowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/milestones")
@RequiredArgsConstructor
@Tag(name = "Workflow & Milestones Module", description = "Acquisition lifecycle milestones and automated timeline delay tracking")
public class WorkflowController {

    private final WorkflowService workflowService;

    @GetMapping
    @Operation(summary = "Get all milestones and delay calculations for a project")
    public ResponseEntity<ApiResponse<List<MilestoneResponse>>> getMilestones(@PathVariable Long projectId) {
        List<MilestoneResponse> milestones = workflowService.getMilestonesByProject(projectId);
        return ResponseEntity.ok(ApiResponse.success(milestones));
    }

    @PostMapping
    @Operation(summary = "Add a custom lifecycle milestone to a project")
    public ResponseEntity<ApiResponse<MilestoneResponse>> addMilestone(
            @PathVariable Long projectId,
            @Valid @RequestBody MilestoneRequest request
    ) {
        MilestoneResponse response = workflowService.addMilestone(projectId, request);
        return new ResponseEntity<>(ApiResponse.created(response, "Milestone created successfully"), HttpStatus.CREATED);
    }

    @PostMapping("/initialize-lifecycle")
    @Operation(summary = "Initialize standard statutory acquisition lifecycle pipeline for project")
    public ResponseEntity<ApiResponse<List<MilestoneResponse>>> initializeLifecycle(@PathVariable Long projectId) {
        List<MilestoneResponse> milestones = workflowService.initializeProjectLifecycle(projectId);
        return ResponseEntity.ok(ApiResponse.success(milestones, "Standard lifecycle milestones initialized"));
    }

    @PutMapping("/{milestoneId}")
    @Operation(summary = "Update milestone dates and status")
    public ResponseEntity<ApiResponse<MilestoneResponse>> updateMilestone(
            @PathVariable Long projectId,
            @PathVariable Long milestoneId,
            @Valid @RequestBody MilestoneRequest request
    ) {
        MilestoneResponse response = workflowService.updateMilestone(milestoneId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Milestone updated successfully"));
    }

    @DeleteMapping("/{milestoneId}")
    @Operation(summary = "Delete a milestone")
    public ResponseEntity<ApiResponse<Void>> deleteMilestone(
            @PathVariable Long projectId,
            @PathVariable Long milestoneId
    ) {
        workflowService.deleteMilestone(milestoneId);
        return ResponseEntity.ok(ApiResponse.success(null, "Milestone deleted"));
    }
}
