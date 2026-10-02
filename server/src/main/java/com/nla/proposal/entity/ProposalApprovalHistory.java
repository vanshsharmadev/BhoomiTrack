package com.nla.proposal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "proposal_approval_histories", indexes = {
        @Index(name = "idx_approval_history_proposal", columnList = "proposal_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ProposalApprovalHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposal_id", nullable = false)
    private Proposal proposal;

    @Enumerated(EnumType.STRING)
    @Column(length = 40)
    private ProposalStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private ProposalStatus toStatus;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(length = 100)
    private String reviewedBy;

    @Column(length = 50)
    private String reviewerRole;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;
}
