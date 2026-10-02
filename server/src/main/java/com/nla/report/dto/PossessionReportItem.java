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
public class PossessionReportItem {
    private Long possessionId;
    private Long projectId;
    private String projectCode;
    private String projectName;
    private String parcelNumber;
    private String surveyNumber;
    private String village;
    private BigDecimal area;
    private String possessionStatus;
    private LocalDate possessionDate;
    private String possessionOfficer;
}
