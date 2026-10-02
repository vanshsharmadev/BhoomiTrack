package com.nla.dashboard.controller;

import com.nla.common.dto.ApiResponse;
import com.nla.dashboard.dto.JurisdictionDashboardResponse;
import com.nla.dashboard.dto.NationalDashboardResponse;
import com.nla.dashboard.dto.ProjectDashboardResponse;
import com.nla.dashboard.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard Module", description = "Aggregated national, state, district, and project analytics KPIs")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/national")
    @Operation(summary = "Get National Dashboard aggregated KPIs")
    public ResponseEntity<ApiResponse<NationalDashboardResponse>> getNationalDashboard() {
        NationalDashboardResponse response = dashboardService.getNationalDashboard();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get Project Dashboard progress metrics and status breakdown")
    public ResponseEntity<ApiResponse<ProjectDashboardResponse>> getProjectDashboard(@PathVariable Long projectId) {
        ProjectDashboardResponse response = dashboardService.getProjectDashboard(projectId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/state/{stateName}")
    @Operation(summary = "Get State-level Dashboard overview")
    public ResponseEntity<ApiResponse<JurisdictionDashboardResponse>> getStateDashboard(@PathVariable String stateName) {
        JurisdictionDashboardResponse response = dashboardService.getStateDashboard(stateName);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/district/{districtName}")
    @Operation(summary = "Get District-level Dashboard overview")
    public ResponseEntity<ApiResponse<JurisdictionDashboardResponse>> getDistrictDashboard(@PathVariable String districtName) {
        JurisdictionDashboardResponse response = dashboardService.getDistrictDashboard(districtName);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
