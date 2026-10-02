package com.nla.proposal.service;

import com.nla.proposal.dto.ProposalApprovalRequest;
import com.nla.proposal.dto.ProposalRequest;
import com.nla.proposal.dto.ProposalResponse;
import com.nla.proposal.entity.ProposalApprovalHistory;
import com.nla.proposal.entity.ProposalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProposalService {

    ProposalResponse createProposal(ProposalRequest request);

    ProposalResponse getProposalById(Long id);

    Page<ProposalResponse> getProposals(Long projectId, ProposalStatus status, String district, String state, Pageable pageable);

    ProposalResponse updateProposal(Long id, ProposalRequest request);

    ProposalResponse submitProposal(Long id, String submittedBy);

    ProposalResponse approveProposal(Long id, ProposalApprovalRequest request);

    ProposalResponse rejectProposal(Long id, ProposalApprovalRequest request);

    ProposalResponse returnProposal(Long id, ProposalApprovalRequest request);

    List<ProposalApprovalHistory> getApprovalHistory(Long id);
}
