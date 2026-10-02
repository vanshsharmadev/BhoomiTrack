package com.nla.rehabilitation.dto;

import com.nla.rehabilitation.entity.AffectedFamily;
import com.nla.rehabilitation.entity.FamilyCategory;
import com.nla.rehabilitation.entity.RehabilitationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AffectedFamilyResponse {

    private Long id;
    private Long projectId;
    private String projectCode;
    private String projectName;
    private String familyHeadName;
    private Integer familyMemberCount;
    private FamilyCategory category;
    private String socialCategory;
    private String village;
    private String district;
    private String state;
    private String entitlementDetails;
    private BigDecimal assistanceAmount;
    private BigDecimal assistanceProvided;
    private Boolean alternativeSiteAllotted;
    private String alternativeSiteDetails;
    private RehabilitationStatus rehabilitationStatus;
    private LocalDate completionDate;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AffectedFamilyResponse fromEntity(AffectedFamily f) {
        return AffectedFamilyResponse.builder()
                .id(f.getId())
                .projectId(f.getProject().getId())
                .projectCode(f.getProject().getProjectCode())
                .projectName(f.getProject().getProjectName())
                .familyHeadName(f.getFamilyHeadName())
                .familyMemberCount(f.getFamilyMemberCount())
                .category(f.getCategory())
                .socialCategory(f.getSocialCategory())
                .village(f.getVillage())
                .district(f.getDistrict())
                .state(f.getState())
                .entitlementDetails(f.getEntitlementDetails())
                .assistanceAmount(f.getAssistanceAmount())
                .assistanceProvided(f.getAssistanceProvided())
                .alternativeSiteAllotted(f.getAlternativeSiteAllotted())
                .alternativeSiteDetails(f.getAlternativeSiteDetails())
                .rehabilitationStatus(f.getRehabilitationStatus())
                .completionDate(f.getCompletionDate())
                .remarks(f.getRemarks())
                .createdAt(f.getCreatedAt())
                .updatedAt(f.getUpdatedAt())
                .build();
    }
}
