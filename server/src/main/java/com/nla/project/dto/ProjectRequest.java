package com.nla.project.dto;

import com.nla.project.entity.ProjectStatus;
import com.nla.project.entity.ProjectType;
import jakarta.validation.constraints.*;
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
public class ProjectRequest {

    private String projectCode;

    @NotBlank(message = "Project name is required")
    @Size(max = 200, message = "Project name must not exceed 200 characters")
    private String projectName;

    @NotNull(message = "Project type is required")
    private ProjectType projectType;

    private String description;

    @NotBlank(message = "Implementing agency is required")
    private String implementingAgency;

    private String ministryDepartment;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "District is required")
    private String district;

    @NotNull(message = "Estimated land requirement is required")
    @DecimalMin(value = "0.0001", message = "Land requirement must be greater than zero")
    private BigDecimal estimatedLandRequirement;

    @Builder.Default
    private String requiredLandUnit = "ACRES";

    private LocalDate projectStartDate;

    private LocalDate expectedCompletionDate;

    private ProjectStatus status;
}
