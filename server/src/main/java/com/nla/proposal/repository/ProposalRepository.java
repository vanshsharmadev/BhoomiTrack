package com.nla.proposal.repository;

import com.nla.proposal.entity.Proposal;
import com.nla.proposal.entity.ProposalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {

    Optional<Proposal> findByProposalNumber(String proposalNumber);

    boolean existsByProposalNumber(String proposalNumber);

    List<Proposal> findByProjectId(Long projectId);

    @Query("SELECT p FROM Proposal p WHERE " +
            "(:projectId IS NULL OR p.project.id = :projectId) AND " +
            "(:status IS NULL OR p.status = :status) AND " +
            "(CAST(:district AS string) IS NULL OR LOWER(p.district) = LOWER(CAST(:district AS string))) AND " +
            "(CAST(:state AS string) IS NULL OR LOWER(p.state) = LOWER(CAST(:state AS string))) " +
            "ORDER BY p.createdAt DESC")
    Page<Proposal> findByFilters(
            @Param("projectId") Long projectId,
            @Param("status") ProposalStatus status,
            @Param("district") String district,
            @Param("state") String state,
            Pageable pageable
    );
}
