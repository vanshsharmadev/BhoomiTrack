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
public class ProjectDashboardResponse {

    private Long projectId;
    private String projectCode;
    private String projectName;
    private String status;
    private BigDecimal landRequired;
    private BigDecimal landAcquired;
    private BigDecimal landPending;
    private double landAcquisitionPercentage;
    private long notificationsIssued;
    private long awardsDeclared;
    private BigDecimal compensationAssessed;
    private BigDecimal compensationPaid;
    private double compensationDisbursementPercentage;
    private long totalParcels;
    private long possessionCompletedParcels;
    private double possessionPercentage;
    private long affectedFamiliesCount;
    private long rehabilitatedFamiliesCount;
    private double rrProgressPercentage;
    private long totalMilestones;
    private long completedMilestones;
    private long delayedMilestones;
    private double timelineProgressPercentage;
    private Map<String, Long> parcelsByStatus;
}
