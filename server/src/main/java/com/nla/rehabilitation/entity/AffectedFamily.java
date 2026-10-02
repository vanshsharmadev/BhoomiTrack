package com.nla.rehabilitation.entity;

import com.nla.project.entity.Project;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "affected_families", indexes = {
        @Index(name = "idx_af_project", columnList = "project_id"),
        @Index(name = "idx_af_category", columnList = "category"),
        @Index(name = "idx_af_status", columnList = "rehabilitationStatus")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class AffectedFamily {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, length = 150)
    private String familyHeadName;

    @Column(nullable = false)
    @Builder.Default
    private Integer familyMemberCount = 1;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private FamilyCategory category = FamilyCategory.AFFECTED;

    @Column(length = 50)
    private String socialCategory; // SC, ST, OBC, GENERAL

    @Column(nullable = false, length = 100)
    private String village;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(columnDefinition = "TEXT")
    private String entitlementDetails;

    @Column(precision = 14, scale = 2)
    private BigDecimal assistanceAmount;

    @Column(precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal assistanceProvided = BigDecimal.ZERO;

    @Builder.Default
    private Boolean alternativeSiteAllotted = false;

    @Column(length = 200)
    private String alternativeSiteDetails;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private RehabilitationStatus rehabilitationStatus = RehabilitationStatus.IDENTIFIED;

    private LocalDate completionDate;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
