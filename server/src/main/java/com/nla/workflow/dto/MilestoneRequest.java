package com.nla.workflow.dto;

import com.nla.workflow.entity.MilestoneStatus;
import com.nla.workflow.entity.MilestoneType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MilestoneRequest {

    @NotNull(message = "Milestone type is required")
    private MilestoneType milestone;

    private String customName;

    private Integer sequenceOrder;

    @NotNull(message = "Planned date is required")
    private LocalDate plannedDate;

    private LocalDate actualDate;

    private MilestoneStatus status;

    private String remarks;
}
