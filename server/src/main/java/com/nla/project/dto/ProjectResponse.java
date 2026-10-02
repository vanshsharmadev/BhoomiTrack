package com.nla.project.dto;

import com.nla.project.entity.Project;
import com.nla.project.entity.ProjectStatus;
import com.nla.project.entity.ProjectType;
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
public class ProjectResponse {

    private Long id;
    private String projectCode;
    private String projectName;
    private ProjectType projectType;
    private String description;
    private String implementingAgency;
    private String ministryDepartment;
    private String state;
    private String district;
    private BigDecimal estimatedLandRequirement;
    private String requiredLandUnit;
    private LocalDate projectStartDate;
    private LocalDate expectedCompletionDate;
    private ProjectStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;

    public static ProjectResponse fromEntity(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .projectCode(project.getProjectCode())
                .projectName(project.getProjectName())
                .projectType(project.getProjectType())
                .description(project.getDescription())
                .implementingAgency(project.getImplementingAgency())
                .ministryDepartment(project.getMinistryDepartment())
                .state(project.getState())
                .district(project.getDistrict())
                .estimatedLandRequirement(project.getEstimatedLandRequirement())
                .requiredLandUnit(project.getRequiredLandUnit())
                .projectStartDate(project.getProjectStartDate())
                .expectedCompletionDate(project.getExpectedCompletionDate())
                .status(project.getStatus())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .createdBy(project.getCreatedBy())
                .build();
    }
}
