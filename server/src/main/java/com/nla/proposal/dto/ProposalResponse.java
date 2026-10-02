package com.nla.proposal.dto;

import com.nla.proposal.entity.Proposal;
import com.nla.proposal.entity.ProposalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalResponse {

    private Long id;
    private String proposalNumber;
    private Long projectId;
    private String projectCode;
    private String projectName;
    private BigDecimal landRequired;
    private String landUnit;
    private String villages;
    private String district;
    private String state;
    private String purpose;
    private Integer proposedTimelineMonths;
    private Integer affectedFamiliesCount;
    private BigDecimal estimatedCompensation;
    private ProposalStatus status;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private String submittedBy;

    public static ProposalResponse fromEntity(Proposal proposal) {
        return ProposalResponse.builder()
                .id(proposal.getId())
                .proposalNumber(proposal.getProposalNumber())
                .projectId(proposal.getProject().getId())
                .projectCode(proposal.getProject().getProjectCode())
                .projectName(proposal.getProject().getProjectName())
                .landRequired(proposal.getLandRequired())
                .landUnit(proposal.getLandUnit())
                .villages(proposal.getVillages())
                .district(proposal.getDistrict())
                .state(proposal.getState())
                .purpose(proposal.getPurpose())
                .proposedTimelineMonths(proposal.getProposedTimelineMonths())
                .affectedFamiliesCount(proposal.getAffectedFamiliesCount())
                .estimatedCompensation(proposal.getEstimatedCompensation())
                .status(proposal.getStatus())
                .remarks(proposal.getRemarks())
                .createdAt(proposal.getCreatedAt())
                .updatedAt(proposal.getUpdatedAt())
                .submittedAt(proposal.getSubmittedAt())
                .reviewedAt(proposal.getReviewedAt())
                .submittedBy(proposal.getSubmittedBy())
                .build();
    }
}
