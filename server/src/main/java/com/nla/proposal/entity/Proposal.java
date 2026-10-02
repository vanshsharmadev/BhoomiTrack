package com.nla.proposal.entity;

import com.nla.project.entity.Project;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "proposals", indexes = {
        @Index(name = "idx_proposal_project", columnList = "project_id"),
        @Index(name = "idx_proposal_status", columnList = "status"),
        @Index(name = "idx_proposal_district", columnList = "district")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Proposal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String proposalNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, precision = 14, scale = 4)
    private BigDecimal landRequired;

    @Column(length = 20)
    @Builder.Default
    private String landUnit = "ACRES";

    @Column(columnDefinition = "TEXT", nullable = false)
    private String villages;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String purpose;

    private Integer proposedTimelineMonths;

    private Integer affectedFamiliesCount;

    @Column(precision = 16, scale = 2)
    private BigDecimal estimatedCompensation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    @Builder.Default
    private ProposalStatus status = ProposalStatus.DRAFT;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime submittedAt;

    private LocalDateTime reviewedAt;

    @Column(length = 100)
    private String submittedBy;
}
