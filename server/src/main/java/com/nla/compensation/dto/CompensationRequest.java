package com.nla.compensation.dto;

import com.nla.compensation.entity.PaymentStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompensationRequest {

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotNull(message = "Land parcel ID is required")
    private Long parcelId;

    @NotBlank(message = "Beneficiary name is required")
    private String beneficiaryName;

    private String beneficiaryType;

    private String bankAccountNumberMasked;

    private String ifscCode;

    @NotNull(message = "Assessed amount is required")
    @DecimalMin(value = "0.0", message = "Assessed amount cannot be negative")
    private BigDecimal assessedAmount;

    @DecimalMin(value = "0.0", message = "Approved amount cannot be negative")
    private BigDecimal approvedAmount;

    private PaymentStatus paymentStatus;

    private String remarks;
}
