package com.nla.possession.dto;

import com.nla.possession.entity.PossessionStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PossessionRequest {

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotNull(message = "Land parcel ID is required")
    private Long parcelId;

    private LocalDate possessionDate;

    private PossessionStatus possessionStatus;

    @NotBlank(message = "Possession officer name is required")
    private String possessionOfficer;

    private String inspectionReference;

    private Long panchnamaDocumentId;

    private String remarks;
}
