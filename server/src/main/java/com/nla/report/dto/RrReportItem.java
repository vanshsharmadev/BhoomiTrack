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
public class RrReportItem {
    private Long familyId;
    private Long projectId;
    private String projectCode;
    private String projectName;
    private String familyHeadName;
    private Integer familyMemberCount;
    private String category;
    private String village;
    private BigDecimal assistanceAmount;
    private BigDecimal assistanceProvided;
    private Boolean alternativeSiteAllotted;
    private String rehabilitationStatus;
    private LocalDate completionDate;
}
