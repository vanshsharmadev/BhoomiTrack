package com.nla.workflow.dto;

import com.nla.workflow.entity.MilestoneStatus;
import com.nla.workflow.entity.MilestoneType;
import com.nla.workflow.entity.ProjectMilestone;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MilestoneResponse {

    private Long id;
    private Long projectId;
    private String projectCode;
    private String projectName;
    private MilestoneType milestone;
    private String customName;
    private Integer sequenceOrder;
    private LocalDate plannedDate;
    private LocalDate actualDate;
    private MilestoneStatus status;
    private Long delayDays;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MilestoneResponse fromEntity(ProjectMilestone m) {
        return MilestoneResponse.builder()
                .id(m.getId())
                .projectId(m.getProject().getId())
                .projectCode(m.getProject().getProjectCode())
                .projectName(m.getProject().getProjectName())
                .milestone(m.getMilestone())
                .customName(m.getCustomName())
                .sequenceOrder(m.getSequenceOrder())
                .plannedDate(m.getPlannedDate())
                .actualDate(m.getActualDate())
                .status(m.getStatus())
                .delayDays(m.getDelayDays())
                .remarks(m.getRemarks())
                .createdAt(m.getCreatedAt())
                .updatedAt(m.getUpdatedAt())
                .build();
    }
}
