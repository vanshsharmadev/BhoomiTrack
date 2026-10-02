package com.nla.report.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectWiseReportResponse {
    private Long projectId;
    private String projectCode;
    private String projectName;
    private String projectType;
    private String state;
    private String district;
    private String status;
    private BigDecimal landRequired;
    private BigDecimal landAcquired;
    private double landAcquisitionPercentage;
    private BigDecimal compensationAssessed;
    private BigDecimal compensationPaid;
    private long totalParcels;
    private long possessionTakenParcels;
    private long affectedFamilies;
    private LocalDate projectStartDate;
    private LocalDate expectedCompletionDate;
    private long delayedDays;
}
