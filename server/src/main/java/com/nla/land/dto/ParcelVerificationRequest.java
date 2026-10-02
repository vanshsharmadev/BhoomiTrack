package com.nla.land.dto;

import com.nla.land.entity.VerificationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParcelVerificationRequest {

    @NotNull(message = "Verification status is required")
    private VerificationStatus verificationStatus;

    private String remarks;

    private String verifiedBy;
}
