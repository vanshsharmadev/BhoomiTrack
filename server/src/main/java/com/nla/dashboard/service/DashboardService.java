package com.nla.dashboard.service;

import com.nla.dashboard.dto.JurisdictionDashboardResponse;
import com.nla.dashboard.dto.NationalDashboardResponse;
import com.nla.dashboard.dto.ProjectDashboardResponse;

public interface DashboardService {

    NationalDashboardResponse getNationalDashboard();

    ProjectDashboardResponse getProjectDashboard(Long projectId);

    JurisdictionDashboardResponse getStateDashboard(String stateName);

    JurisdictionDashboardResponse getDistrictDashboard(String districtName);
}
