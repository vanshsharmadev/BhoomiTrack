package com.nla.report.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DelayReportItem {
    private Long projectId;
    private String projectCode;
    private String projectName;
    private String state;
    private String district;
    private String delayedMilestone;
    private LocalDate plannedDate;
    private LocalDate actualDate;
    private long delayDays;
    private String remarks;
}
