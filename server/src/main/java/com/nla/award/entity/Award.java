package com.nla.award.entity;

import com.nla.land.entity.LandParcel;
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
@Table(name = "awards", indexes = {
        @Index(name = "idx_award_project", columnList = "project_id"),
        @Index(name = "idx_award_parcel", columnList = "parcel_id"),
        @Index(name = "idx_award_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Award {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parcel_id", nullable = false)
    private LandParcel parcel;

    @Column(nullable = false, unique = true, length = 100)
    private String awardNumber;

    @Column(nullable = false)
    private LocalDate awardDate;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal assessedAmount;

    @Column(precision = 16, scale = 2)
    private BigDecimal marketValue;

    @Column(precision = 16, scale = 2)
    private BigDecimal solatium; // 100% of market value under RFCTLARR

    @Column(precision = 16, scale = 2)
    private BigDecimal additionalAmount;

    @Column(nullable = false, length = 150)
    private String competentAuthority;

    private Long documentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private AwardStatus status = AwardStatus.DRAFT;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
