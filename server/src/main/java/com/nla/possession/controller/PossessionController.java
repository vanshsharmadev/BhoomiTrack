package com.nla.possession.controller;

import com.nla.common.dto.ApiResponse;
import com.nla.possession.dto.PossessionRequest;
import com.nla.possession.dto.PossessionResponse;
import com.nla.possession.dto.PossessionStatusUpdateRequest;
import com.nla.possession.entity.PossessionStatus;
import com.nla.possession.service.PossessionService;
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
@RequestMapping("/api/possession")
@RequiredArgsConstructor
@Tag(name = "Possession Module", description = "Physical land possession handover, panchnama, and inspection tracking")
public class PossessionController {

    private final PossessionService possessionService;

    @PostMapping
    @Operation(summary = "Schedule or record physical land possession")
    public ResponseEntity<ApiResponse<PossessionResponse>> createPossession(@Valid @RequestBody PossessionRequest request) {
        PossessionResponse response = possessionService.createPossession(request);
        return new ResponseEntity<>(ApiResponse.created(response, "Possession recorded successfully"), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get possession records with filtering by projectId, parcelId, and status")
    public ResponseEntity<ApiResponse<Page<PossessionResponse>>> getPossessions(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long parcelId,
            @RequestParam(required = false) PossessionStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PossessionResponse> result = possessionService.getPossessions(projectId, parcelId, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get possession record by ID")
    public ResponseEntity<ApiResponse<PossessionResponse>> getPossessionById(@PathVariable Long id) {
        PossessionResponse response = possessionService.getPossessionById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update possession status (e.g. mark TAKEN or SCHEDULED)")
    public ResponseEntity<ApiResponse<PossessionResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody PossessionStatusUpdateRequest request
    ) {
        PossessionResponse response = possessionService.updateStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Possession status updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete possession record")
    public ResponseEntity<ApiResponse<Void>> deletePossession(@PathVariable Long id) {
        possessionService.deletePossession(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Possession record deleted"));
    }
}
