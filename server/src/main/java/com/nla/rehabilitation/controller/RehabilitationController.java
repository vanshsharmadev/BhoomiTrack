package com.nla.rehabilitation.controller;

import com.nla.common.dto.ApiResponse;
import com.nla.rehabilitation.dto.AffectedFamilyRequest;
import com.nla.rehabilitation.dto.AffectedFamilyResponse;
import com.nla.rehabilitation.dto.FamilyStatusUpdateRequest;
import com.nla.rehabilitation.entity.FamilyCategory;
import com.nla.rehabilitation.entity.RehabilitationStatus;
import com.nla.rehabilitation.service.RehabilitationService;
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
@RequestMapping("/api/rr/families")
@RequiredArgsConstructor
@Tag(name = "Rehabilitation & Resettlement (R&R) Module", description = "Affected and displaced families entitlement and resettlement tracking")
public class RehabilitationController {

    private final RehabilitationService rehabilitationService;

    @PostMapping
    @Operation(summary = "Register an affected or displaced family")
    public ResponseEntity<ApiResponse<AffectedFamilyResponse>> createFamily(@Valid @RequestBody AffectedFamilyRequest request) {
        AffectedFamilyResponse response = rehabilitationService.createAffectedFamily(request);
        return new ResponseEntity<>(ApiResponse.created(response, "Family registered successfully"), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get list of affected families with optional filters: projectId, category, status, district")
    public ResponseEntity<ApiResponse<Page<AffectedFamilyResponse>>> getFamilies(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) FamilyCategory category,
            @RequestParam(required = false) RehabilitationStatus status,
            @RequestParam(required = false) String district,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AffectedFamilyResponse> result = rehabilitationService.getFamilies(projectId, category, status, district, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get affected family details by ID")
    public ResponseEntity<ApiResponse<AffectedFamilyResponse>> getFamilyById(@PathVariable Long id) {
        AffectedFamilyResponse response = rehabilitationService.getFamilyById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update affected family details")
    public ResponseEntity<ApiResponse<AffectedFamilyResponse>> updateFamily(
            @PathVariable Long id,
            @Valid @RequestBody AffectedFamilyRequest request
    ) {
        AffectedFamilyResponse response = rehabilitationService.updateFamily(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Family details updated successfully"));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update R&R status, record assistance payment or site allotment")
    public ResponseEntity<ApiResponse<AffectedFamilyResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody FamilyStatusUpdateRequest request
    ) {
        AffectedFamilyResponse response = rehabilitationService.updateStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "R&R status updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete family record")
    public ResponseEntity<ApiResponse<Void>> deleteFamily(@PathVariable Long id) {
        rehabilitationService.deleteFamily(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Family record deleted"));
    }
}
