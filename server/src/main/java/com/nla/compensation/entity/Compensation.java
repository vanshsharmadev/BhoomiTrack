package com.nla.compensation.entity;

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
@Table(name = "compensations", indexes = {
        @Index(name = "idx_comp_project", columnList = "project_id"),
        @Index(name = "idx_comp_parcel", columnList = "parcel_id"),
        @Index(name = "idx_comp_status", columnList = "paymentStatus")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Compensation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parcel_id", nullable = false)
    private LandParcel parcel;

    @Column(nullable = false, length = 150)
    private String beneficiaryName;

    @Column(length = 50)
    @Builder.Default
    private String beneficiaryType = "TITLE_HOLDER";

    @Column(length = 30)
    private String bankAccountNumberMasked;

    @Column(length = 20)
    private String ifscCode;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal assessedAmount;

    @Column(precision = 16, scale = 2)
    private BigDecimal approvedAmount;

    @Column(precision = 16, scale = 2)
    @Builder.Default
    private BigDecimal paidAmount = BigDecimal.ZERO;

    private LocalDate paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.ASSESSED;

    @Column(length = 100)
    private String transactionReference;

    @Column(length = 50)
    private String paymentMode;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
