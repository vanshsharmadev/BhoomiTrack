package com.nla.land.controller;

import com.nla.common.dto.ApiResponse;
import com.nla.land.dto.LandParcelRequest;
import com.nla.land.dto.LandParcelResponse;
import com.nla.land.dto.ParcelStatusUpdateRequest;
import com.nla.land.dto.ParcelVerificationRequest;
import com.nla.land.entity.AcquisitionStatus;
import com.nla.land.service.LandParcelService;
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
@RequestMapping("/api/land-parcels")
@RequiredArgsConstructor
@Tag(name = "Land Parcel Module", description = "Survey, khasra, boundary, and cadastral acquisition tracking")
public class LandParcelController {

    private final LandParcelService landParcelService;

    @PostMapping
    @Operation(summary = "Register a new land parcel under a project")
    public ResponseEntity<ApiResponse<LandParcelResponse>> createLandParcel(@Valid @RequestBody LandParcelRequest request) {
        LandParcelResponse response = landParcelService.createLandParcel(request);
        return new ResponseEntity<>(ApiResponse.created(response, "Land parcel created successfully"), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get land parcels with optional filters: projectId, district, status, village")
    public ResponseEntity<ApiResponse<Page<LandParcelResponse>>> getLandParcels(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) AcquisitionStatus status,
            @RequestParam(required = false) String village,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<LandParcelResponse> result = landParcelService.getLandParcels(projectId, district, status, village, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get land parcel details by ID")
    public ResponseEntity<ApiResponse<LandParcelResponse>> getLandParcelById(@PathVariable Long id) {
        LandParcelResponse response = landParcelService.getLandParcelById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update land parcel details")
    public ResponseEntity<ApiResponse<LandParcelResponse>> updateLandParcel(
            @PathVariable Long id,
            @Valid @RequestBody LandParcelRequest request
    ) {
        LandParcelResponse response = landParcelService.updateLandParcel(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Land parcel updated successfully"));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update land parcel acquisition lifecycle status")
    public ResponseEntity<ApiResponse<LandParcelResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ParcelStatusUpdateRequest request
    ) {
        LandParcelResponse response = landParcelService.updateStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Acquisition status updated successfully"));
    }

    @PatchMapping("/{id}/verify")
    @Operation(summary = "Record field verification status by field officer")
    public ResponseEntity<ApiResponse<LandParcelResponse>> verifyParcel(
            @PathVariable Long id,
            @Valid @RequestBody ParcelVerificationRequest request
    ) {
        LandParcelResponse response = landParcelService.verifyParcel(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Field verification recorded"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete land parcel")
    public ResponseEntity<ApiResponse<Void>> deleteLandParcel(@PathVariable Long id) {
        landParcelService.deleteLandParcel(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Land parcel deleted successfully"));
    }
}
