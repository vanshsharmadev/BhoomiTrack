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
public class CompensationReportItem {
    private Long compensationId;
    private Long projectId;
    private String projectCode;
    private String projectName;
    private String parcelNumber;
    private String surveyNumber;
    private String beneficiaryName;
    private BigDecimal assessedAmount;
    private BigDecimal approvedAmount;
    private BigDecimal paidAmount;
    private String paymentStatus;
    private LocalDate paymentDate;
    private String transactionReference;
}
