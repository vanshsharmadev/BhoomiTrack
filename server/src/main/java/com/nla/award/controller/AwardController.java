package com.nla.award.controller;

import com.nla.award.dto.AwardRequest;
import com.nla.award.dto.AwardResponse;
import com.nla.award.entity.AwardStatus;
import com.nla.award.service.AwardService;
import com.nla.common.dto.ApiResponse;
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
@RequestMapping("/api/awards")
@RequiredArgsConstructor
@Tag(name = "Award Module", description = "Award determination and statutory compensation assessment")
public class AwardController {

    private final AwardService awardService;

    @PostMapping
    @Operation(summary = "Declare or draft an award for a land parcel")
    public ResponseEntity<ApiResponse<AwardResponse>> createAward(@Valid @RequestBody AwardRequest request) {
        AwardResponse response = awardService.createAward(request);
        return new ResponseEntity<>(ApiResponse.created(response, "Award declared successfully"), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get awards with filtering by projectId, parcelId, and status")
    public ResponseEntity<ApiResponse<Page<AwardResponse>>> getAwards(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) Long parcelId,
            @RequestParam(required = false) AwardStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AwardResponse> result = awardService.getAwards(projectId, parcelId, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get award details by ID")
    public ResponseEntity<ApiResponse<AwardResponse>> getAwardById(@PathVariable Long id) {
        AwardResponse response = awardService.getAwardById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update award details")
    public ResponseEntity<ApiResponse<AwardResponse>> updateAward(
            @PathVariable Long id,
            @Valid @RequestBody AwardRequest request
    ) {
        AwardResponse response = awardService.updateAward(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Award updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an award record")
    public ResponseEntity<ApiResponse<Void>> deleteAward(@PathVariable Long id) {
        awardService.deleteAward(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Award deleted successfully"));
    }
}
