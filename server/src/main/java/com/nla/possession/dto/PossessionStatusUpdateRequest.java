package com.nla.possession.dto;

import com.nla.possession.entity.PossessionStatus;
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
public class PossessionStatusUpdateRequest {

    @NotNull(message = "Possession status is required")
    private PossessionStatus status;

    private LocalDate possessionDate;

    private String remarks;
}
