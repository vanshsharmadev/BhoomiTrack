package com.nla.land.entity;

import com.nla.project.entity.Project;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "land_parcels", indexes = {
        @Index(name = "idx_parcel_project", columnList = "project_id"),
        @Index(name = "idx_parcel_status", columnList = "acquisitionStatus"),
        @Index(name = "idx_parcel_district", columnList = "district"),
        @Index(name = "idx_parcel_village", columnList = "village"),
        @Index(name = "idx_parcel_survey", columnList = "surveyNumber")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class LandParcel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String parcelNumber;

    @Column(nullable = false, length = 50)
    private String surveyNumber;

    @Column(length = 50)
    private String khasraNumber;

    @Column(nullable = false, length = 100)
    private String village;

    @Column(length = 100)
    private String tehsil;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, precision = 12, scale = 4)
    private BigDecimal area;

    @Column(length = 20)
    @Builder.Default
    private String areaUnit = "ACRES";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private LandType landType;

    @Column(nullable = false, length = 150)
    private String ownerName;

    @Column(length = 20)
    private String ownerContact;

    @Column(length = 20)
    private String ownerAadhaarMasked;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private AcquisitionStatus acquisitionStatus = AcquisitionStatus.PROPOSED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    private Double latitude;

    private Double longitude;

    @Column(columnDefinition = "TEXT")
    private String geometry;

    @Column(length = 100)
    private String verifiedBy;

    private LocalDateTime verifiedAt;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
