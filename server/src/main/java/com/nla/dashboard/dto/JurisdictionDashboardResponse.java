package com.nla.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JurisdictionDashboardResponse {

    private String jurisdictionType; // STATE or DISTRICT
    private String jurisdictionName;
    private long totalProjects;
    private BigDecimal totalLandProposed;
    private BigDecimal totalLandAcquired;
    private double landAcquisitionPercentage;
    private BigDecimal totalCompensationAssessed;
    private BigDecimal totalCompensationPaid;
    private double compensationDisbursementPercentage;
    private long totalAffectedFamilies;
    private double possessionProgressPercentage;
    private double rrProgressPercentage;
    private Map<String, Long> projectsByStatus;
}
