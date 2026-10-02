package com.nla.project.dto;

import com.nla.project.entity.ProjectStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectStatusUpdateRequest {

    @NotNull(message = "New status is required")
    private ProjectStatus status;

    private String remarks;
}
