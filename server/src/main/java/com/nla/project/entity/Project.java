package com.nla.project.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects", indexes = {
        @Index(name = "idx_project_state", columnList = "state"),
        @Index(name = "idx_project_district", columnList = "district"),
        @Index(name = "idx_project_status", columnList = "status"),
        @Index(name = "idx_project_type", columnList = "projectType")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String projectCode;

    @Column(nullable = false, length = 200)
    private String projectName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ProjectType projectType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 150)
    private String implementingAgency;

    @Column(length = 150)
    private String ministryDepartment;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(precision = 14, scale = 4)
    private BigDecimal estimatedLandRequirement;

    @Column(length = 20)
    @Builder.Default
    private String requiredLandUnit = "ACRES";

    private LocalDate projectStartDate;

    private LocalDate expectedCompletionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ProjectStatus status = ProjectStatus.DRAFT;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Column(length = 100)
    private String createdBy;
}
