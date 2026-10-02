package com.nla.proposal.dto;

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
public class ProposalRequest {

    private String proposalNumber;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotNull(message = "Land required is mandatory")
    @DecimalMin(value = "0.0001", message = "Land requirement must be greater than zero")
    private BigDecimal landRequired;

    @Builder.Default
    private String landUnit = "ACRES";

    @NotBlank(message = "Villages list is required")
    private String villages;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    private Integer proposedTimelineMonths;

    private Integer affectedFamiliesCount;

    @DecimalMin(value = "0.0", message = "Estimated compensation cannot be negative")
    private BigDecimal estimatedCompensation;

    private String remarks;
}
