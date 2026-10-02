package com.nla.proposal.controller;

import com.nla.common.dto.ApiResponse;
import com.nla.proposal.dto.ProposalApprovalRequest;
import com.nla.proposal.dto.ProposalRequest;
import com.nla.proposal.dto.ProposalResponse;
import com.nla.proposal.entity.ProposalApprovalHistory;
import com.nla.proposal.entity.ProposalStatus;
import com.nla.proposal.service.ProposalService;
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

import java.util.List;

@RestController
@RequestMapping("/api/proposals")
@RequiredArgsConstructor
@Tag(name = "Proposal Module", description = "Land acquisition proposal submission, verification, and multi-tier approvals")
public class ProposalController {

    private final ProposalService proposalService;

    @PostMapping
    @Operation(summary = "Create a land acquisition proposal draft")
    public ResponseEntity<ApiResponse<ProposalResponse>> createProposal(@Valid @RequestBody ProposalRequest request) {
        ProposalResponse response = proposalService.createProposal(request);
        return new ResponseEntity<>(ApiResponse.created(response, "Proposal draft created"), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get proposals with filtering by projectId, status, district, and state")
    public ResponseEntity<ApiResponse<Page<ProposalResponse>>> getProposals(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) ProposalStatus status,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String state,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProposalResponse> result = proposalService.getProposals(projectId, status, district, state, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get proposal by ID")
    public ResponseEntity<ApiResponse<ProposalResponse>> getProposalById(@PathVariable Long id) {
        ProposalResponse response = proposalService.getProposalById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update proposal details (allowed in DRAFT or RETURNED state)")
    public ResponseEntity<ApiResponse<ProposalResponse>> updateProposal(
            @PathVariable Long id,
            @Valid @RequestBody ProposalRequest request
    ) {
        ProposalResponse response = proposalService.updateProposal(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Proposal updated successfully"));
    }

    @PostMapping("/{id}/submit")
    @Operation(summary = "Submit proposal for review")
    public ResponseEntity<ApiResponse<ProposalResponse>> submitProposal(
            @PathVariable Long id,
            @RequestParam(required = false) String submittedBy
    ) {
        ProposalResponse response = proposalService.submitProposal(id, submittedBy);
        return ResponseEntity.ok(ApiResponse.success(response, "Proposal submitted for review"));
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve proposal")
    public ResponseEntity<ApiResponse<ProposalResponse>> approveProposal(
            @PathVariable Long id,
            @Valid @RequestBody ProposalApprovalRequest request
    ) {
        ProposalResponse response = proposalService.approveProposal(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Proposal approved successfully"));
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Reject proposal")
    public ResponseEntity<ApiResponse<ProposalResponse>> rejectProposal(
            @PathVariable Long id,
            @Valid @RequestBody ProposalApprovalRequest request
    ) {
        ProposalResponse response = proposalService.rejectProposal(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Proposal rejected"));
    }

    @PostMapping("/{id}/return")
    @Operation(summary = "Return proposal for correction")
    public ResponseEntity<ApiResponse<ProposalResponse>> returnProposal(
            @PathVariable Long id,
            @Valid @RequestBody ProposalApprovalRequest request
    ) {
        ProposalResponse response = proposalService.returnProposal(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Proposal returned for correction"));
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "Get complete proposal approval and review history")
    public ResponseEntity<ApiResponse<List<ProposalApprovalHistory>>> getApprovalHistory(@PathVariable Long id) {
        List<ProposalApprovalHistory> history = proposalService.getApprovalHistory(id);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
