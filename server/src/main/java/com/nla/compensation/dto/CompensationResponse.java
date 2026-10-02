package com.nla.compensation.dto;

import com.nla.compensation.entity.Compensation;
import com.nla.compensation.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompensationResponse {

    private Long id;
    private Long projectId;
    private String projectCode;
    private String projectName;
    private Long parcelId;
    private String parcelNumber;
    private String surveyNumber;
    private String beneficiaryName;
    private String beneficiaryType;
    private String bankAccountNumberMasked;
    private String ifscCode;
    private BigDecimal assessedAmount;
    private BigDecimal approvedAmount;
    private BigDecimal paidAmount;
    private LocalDate paymentDate;
    private PaymentStatus paymentStatus;
    private String transactionReference;
    private String paymentMode;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CompensationResponse fromEntity(Compensation c) {
        return CompensationResponse.builder()
                .id(c.getId())
                .projectId(c.getProject().getId())
                .projectCode(c.getProject().getProjectCode())
                .projectName(c.getProject().getProjectName())
                .parcelId(c.getParcel().getId())
                .parcelNumber(c.getParcel().getParcelNumber())
                .surveyNumber(c.getParcel().getSurveyNumber())
                .beneficiaryName(c.getBeneficiaryName())
                .beneficiaryType(c.getBeneficiaryType())
                .bankAccountNumberMasked(c.getBankAccountNumberMasked())
                .ifscCode(c.getIfscCode())
                .assessedAmount(c.getAssessedAmount())
                .approvedAmount(c.getApprovedAmount())
                .paidAmount(c.getPaidAmount())
                .paymentDate(c.getPaymentDate())
                .paymentStatus(c.getPaymentStatus())
                .transactionReference(c.getTransactionReference())
                .paymentMode(c.getPaymentMode())
                .remarks(c.getRemarks())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
