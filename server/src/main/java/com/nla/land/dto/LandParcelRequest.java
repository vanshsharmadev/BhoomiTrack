package com.nla.land.dto;

import com.nla.land.entity.LandType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LandParcelRequest {

    private String parcelNumber;

    @NotBlank(message = "Survey number is required")
    private String surveyNumber;

    private String khasraNumber;

    @NotBlank(message = "Village is required")
    private String village;

    private String tehsil;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "State is required")
    private String state;

    @NotNull(message = "Area is required")
    @DecimalMin(value = "0.0001", message = "Area must be greater than zero")
    private BigDecimal area;

    @Builder.Default
    private String areaUnit = "ACRES";

    @NotNull(message = "Land type is required")
    private LandType landType;

    @NotBlank(message = "Owner name is required")
    private String ownerName;

    private String ownerContact;

    private String ownerAadhaarMasked;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    private Double latitude;

    private Double longitude;

    private String geometry;

    private String remarks;
}
