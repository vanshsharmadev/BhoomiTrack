package com.nla.proposal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalApprovalRequest {

    @NotBlank(message = "Comments / justification is required")
    private String comments;

    private String reviewerRole;
}
