package com.nla.possession.dto;

import com.nla.possession.entity.Possession;
import com.nla.possession.entity.PossessionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PossessionResponse {

    private Long id;
    private Long projectId;
    private String projectCode;
    private String projectName;
    private Long parcelId;
    private String parcelNumber;
    private String surveyNumber;
    private String village;
    private LocalDate possessionDate;
    private PossessionStatus possessionStatus;
    private String possessionOfficer;
    private String inspectionReference;
    private Long panchnamaDocumentId;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PossessionResponse fromEntity(Possession p) {
        return PossessionResponse.builder()
                .id(p.getId())
                .projectId(p.getProject().getId())
                .projectCode(p.getProject().getProjectCode())
                .projectName(p.getProject().getProjectName())
                .parcelId(p.getParcel().getId())
                .parcelNumber(p.getParcel().getParcelNumber())
                .surveyNumber(p.getParcel().getSurveyNumber())
                .village(p.getParcel().getVillage())
                .possessionDate(p.getPossessionDate())
                .possessionStatus(p.getPossessionStatus())
                .possessionOfficer(p.getPossessionOfficer())
                .inspectionReference(p.getInspectionReference())
                .panchnamaDocumentId(p.getPanchnamaDocumentId())
                .remarks(p.getRemarks())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
