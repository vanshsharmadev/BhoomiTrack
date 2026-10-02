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
public class NationalDashboardResponse {

    private long totalProjects;
    private BigDecimal totalLandProposed;
    private BigDecimal totalLandAcquired;
    private double landAcquisitionPercentage;
    private BigDecimal totalCompensationAssessed;
    private BigDecimal totalCompensationPaid;
    private double compensationDisbursementPercentage;
    private long totalAffectedFamilies;
    private long totalDisplacedFamilies;
    private double possessionProgressPercentage;
    private double rrProgressPercentage;
    private long delayedProjectsCount;
    private Map<String, Long> projectsByStatus;
    private Map<String, Long> projectsByType;
}
