package com.nla.award.dto;

import com.nla.award.entity.AwardStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class AwardRequest {

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotNull(message = "Land parcel ID is required")
    private Long parcelId;

    @NotBlank(message = "Award number is required")
    private String awardNumber;

    @NotNull(message = "Award date is required")
    private LocalDate awardDate;

    @NotNull(message = "Assessed amount is required")
    @DecimalMin(value = "0.0", message = "Assessed amount cannot be negative")
    private BigDecimal assessedAmount;

    private BigDecimal marketValue;

    private BigDecimal solatium;

    private BigDecimal additionalAmount;

    @NotBlank(message = "Competent authority is required")
    private String competentAuthority;

    private Long documentId;

    private AwardStatus status;

    private String remarks;
}
