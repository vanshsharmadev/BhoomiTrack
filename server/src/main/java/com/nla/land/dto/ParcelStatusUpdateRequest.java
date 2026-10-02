package com.nla.land.dto;

import com.nla.land.entity.AcquisitionStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParcelStatusUpdateRequest {

    @NotNull(message = "New acquisition status is required")
    private AcquisitionStatus status;

    private String remarks;
}
