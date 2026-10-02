package com.nla.possession.entity;

import com.nla.land.entity.LandParcel;
import com.nla.project.entity.Project;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "possessions", indexes = {
        @Index(name = "idx_possession_project", columnList = "project_id"),
        @Index(name = "idx_possession_parcel", columnList = "parcel_id"),
        @Index(name = "idx_possession_status", columnList = "possessionStatus")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Possession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parcel_id", nullable = false)
    private LandParcel parcel;

    private LocalDate possessionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PossessionStatus possessionStatus = PossessionStatus.PENDING;

    @Column(nullable = false, length = 150)
    private String possessionOfficer;

    @Column(length = 150)
    private String inspectionReference;

    private Long panchnamaDocumentId;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
