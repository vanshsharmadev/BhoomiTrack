package com.nla.compensation.controller;

import com.nla.common.dto.ApiResponse;
import com.nla.compensation.dto.CompensationRequest;
import com.nla.compensation.dto.CompensationResponse;
import com.nla.compensation.dto.PaymentConfirmationRequest;
import com.nla.compensation.entity.PaymentStatus;
import com.nla.compensation.service.CompensationService;
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
@RequestMapping("/api/compensation")
@RequiredArgsConstructor
@Tag(name = "Compensation Module", description = "Beneficiary compensation assessment, approval, and disbursement tracking")
public class CompensationController {

    private final CompensationService compensationService;

    @PostMapping
    @Operation(summary = "Create a compensation assessment record for a parcel beneficiary")
    public ResponseEntity<ApiResponse<CompensationResponse>> createCompensation(@Valid @RequestBody CompensationRequest request) {
        CompensationResponse response = compensationService.createCompensation(request);
        return new ResponseEntity<>(ApiResponse.created(response, "Compensation record created successfully"), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get compensation records with filtering by projectId, parcelId, and paymentStatus")
    public ResponseEntity<ApiResponse<Page<CompensationResponse>>> getCompensations(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long parcelId,
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CompensationResponse> result = compensationService.getCompensations(projectId, parcelId, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get compensation details by ID")
    public ResponseEntity<ApiResponse<CompensationResponse>> getCompensationById(@PathVariable Long id) {
        CompensationResponse response = compensationService.getCompensationById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update compensation assessment details")
    public ResponseEntity<ApiResponse<CompensationResponse>> updateCompensation(
            @PathVariable Long id,
            @Valid @RequestBody CompensationRequest request
    ) {
        CompensationResponse response = compensationService.updateCompensation(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Compensation updated successfully"));
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve compensation for payment disbursement")
    public ResponseEntity<ApiResponse<CompensationResponse>> approveCompensation(@PathVariable Long id) {
        CompensationResponse response = compensationService.approveCompensation(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Compensation approved for disbursement"));
    }

    @PostMapping("/{id}/mark-paid")
    @Operation(summary = "Record compensation payment and transaction reference (RTGS/NEFT/Treasury)")
    public ResponseEntity<ApiResponse<CompensationResponse>> markPaid(
            @PathVariable Long id,
            @Valid @RequestBody PaymentConfirmationRequest request
    ) {
        CompensationResponse response = compensationService.markPaid(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Payment recorded successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete compensation record")
    public ResponseEntity<ApiResponse<Void>> deleteCompensation(@PathVariable Long id) {
        compensationService.deleteCompensation(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Compensation record deleted"));
    }
}
