package com.nla.report.controller;

import com.nla.common.dto.ApiResponse;
import com.nla.compensation.entity.PaymentStatus;
import com.nla.possession.entity.PossessionStatus;
import com.nla.project.entity.ProjectStatus;
import com.nla.project.entity.ProjectType;
import com.nla.rehabilitation.entity.RehabilitationStatus;
import com.nla.report.dto.*;
import com.nla.report.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Reports & Analytics Module", description = "Analytical reporting across states, districts, compensation, possession, R&R, and timelines")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/state-wise")
    @Operation(summary = "Get state-wise acquisition and financial performance report")
    public ResponseEntity<ApiResponse<List<StateWiseReportResponse>>> getStateWiseReport() {
        List<StateWiseReportResponse> report = reportService.getStateWiseReport();
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/district-wise")
    @Operation(summary = "Get district-wise acquisition report with optional state filter")
    public ResponseEntity<ApiResponse<List<DistrictWiseReportResponse>>> getDistrictWiseReport(
            @RequestParam(required = false) String state
    ) {
        List<DistrictWiseReportResponse> report = reportService.getDistrictWiseReport(state);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/project-wise")
    @Operation(summary = "Get project-wise progress report with state, district, projectType, and status filters")
    public ResponseEntity<ApiResponse<List<ProjectWiseReportResponse>>> getProjectWiseReport(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) ProjectType projectType,
            @RequestParam(required = false) ProjectStatus status
    ) {
        List<ProjectWiseReportResponse> report = reportService.getProjectWiseReport(state, district, projectType, status);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/compensation")
    @Operation(summary = "Get detailed compensation disbursement audit report")
    public ResponseEntity<ApiResponse<List<CompensationReportItem>>> getCompensationReport(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) PaymentStatus status
    ) {
        List<CompensationReportItem> report = reportService.getCompensationReport(projectId, status);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/possession")
    @Operation(summary = "Get physical land possession progress report")
    public ResponseEntity<ApiResponse<List<PossessionReportItem>>> getPossessionReport(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) PossessionStatus status
    ) {
        List<PossessionReportItem> report = reportService.getPossessionReport(projectId, status);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/rr")
    @Operation(summary = "Get Rehabilitation and Resettlement progress report")
    public ResponseEntity<ApiResponse<List<RrReportItem>>> getRrReport(
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) RehabilitationStatus status
    ) {
        List<RrReportItem> report = reportService.getRrReport(projectId, status);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/delays")
    @Operation(summary = "Get delayed projects and milestone bottlenecks report")
    public ResponseEntity<ApiResponse<List<DelayReportItem>>> getDelayReport(
            @RequestParam(required = false) String state
    ) {
        List<DelayReportItem> report = reportService.getDelayReport(state);
        return ResponseEntity.ok(ApiResponse.success(report));
    }
}
