package com.nla.rehabilitation.dto;

import com.nla.rehabilitation.entity.RehabilitationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FamilyStatusUpdateRequest {

    @NotNull(message = "Rehabilitation status is required")
    private RehabilitationStatus status;

    private BigDecimal additionalAssistanceProvided;

    private Boolean alternativeSiteAllotted;

    private String alternativeSiteDetails;

    private LocalDate completionDate;

    private String remarks;
}
