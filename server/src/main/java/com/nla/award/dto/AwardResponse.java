package com.nla.award.dto;

import com.nla.award.entity.Award;
import com.nla.award.entity.AwardStatus;
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
public class AwardResponse {

    private Long id;
    private Long projectId;
    private String projectCode;
    private String projectName;
    private Long parcelId;
    private String parcelNumber;
    private String surveyNumber;
    private String ownerName;
    private String awardNumber;
    private LocalDate awardDate;
    private BigDecimal assessedAmount;
    private BigDecimal marketValue;
    private BigDecimal solatium;
    private BigDecimal additionalAmount;
    private String competentAuthority;
    private Long documentId;
    private AwardStatus status;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AwardResponse fromEntity(Award a) {
        return AwardResponse.builder()
                .id(a.getId())
                .projectId(a.getProject().getId())
                .projectCode(a.getProject().getProjectCode())
                .projectName(a.getProject().getProjectName())
                .parcelId(a.getParcel().getId())
                .parcelNumber(a.getParcel().getParcelNumber())
                .surveyNumber(a.getParcel().getSurveyNumber())
                .ownerName(a.getParcel().getOwnerName())
                .awardNumber(a.getAwardNumber())
                .awardDate(a.getAwardDate())
                .assessedAmount(a.getAssessedAmount())
                .marketValue(a.getMarketValue())
                .solatium(a.getSolatium())
                .additionalAmount(a.getAdditionalAmount())
                .competentAuthority(a.getCompetentAuthority())
                .documentId(a.getDocumentId())
                .status(a.getStatus())
                .remarks(a.getRemarks())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }
}
