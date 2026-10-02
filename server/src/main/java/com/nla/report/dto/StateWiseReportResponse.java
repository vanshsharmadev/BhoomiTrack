package com.nla.report.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StateWiseReportResponse {
    private String state;
    private long totalProjects;
    private BigDecimal totalLandProposed;
    private BigDecimal totalLandAcquired;
    private double acquisitionPercentage;
    private BigDecimal totalCompensationAssessed;
    private BigDecimal totalCompensationPaid;
    private long affectedFamilies;
    private long delayedProjects;
}
