package com.nla.proposal.repository;

import com.nla.proposal.entity.ProposalApprovalHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProposalApprovalHistoryRepository extends JpaRepository<ProposalApprovalHistory, Long> {

    List<ProposalApprovalHistory> findByProposalIdOrderByTimestampDesc(Long proposalId);
}
