package com.nla.rehabilitation.dto;

import com.nla.rehabilitation.entity.FamilyCategory;
import com.nla.rehabilitation.entity.RehabilitationStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
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
public class AffectedFamilyRequest {

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotBlank(message = "Family head name is required")
    private String familyHeadName;

    @NotNull(message = "Family member count is required")
    @Min(value = 1, message = "Family member count must be at least 1")
    private Integer familyMemberCount;

    @NotNull(message = "Category is required")
    private FamilyCategory category;

    private String socialCategory;

    @NotBlank(message = "Village is required")
    private String village;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "State is required")
    private String state;

    private String entitlementDetails;

    @DecimalMin(value = "0.0", message = "Assistance amount cannot be negative")
    private BigDecimal assistanceAmount;

    @DecimalMin(value = "0.0", message = "Assistance provided cannot be negative")
    private BigDecimal assistanceProvided;

    private Boolean alternativeSiteAllotted;

    private String alternativeSiteDetails;

    private RehabilitationStatus rehabilitationStatus;

    private LocalDate completionDate;

    private String remarks;
}
