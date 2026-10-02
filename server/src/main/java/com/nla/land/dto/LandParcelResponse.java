package com.nla.land.dto;

import com.nla.land.entity.AcquisitionStatus;
import com.nla.land.entity.LandParcel;
import com.nla.land.entity.LandType;
import com.nla.land.entity.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LandParcelResponse {

    private Long id;
    private String parcelNumber;
    private String surveyNumber;
    private String khasraNumber;
    private String village;
    private String tehsil;
    private String district;
    private String state;
    private BigDecimal area;
    private String areaUnit;
    private LandType landType;
    private String ownerName;
    private String ownerContact;
    private String ownerAadhaarMasked;
    private Long projectId;
    private String projectCode;
    private String projectName;
    private AcquisitionStatus acquisitionStatus;
    private VerificationStatus verificationStatus;
    private Double latitude;
    private Double longitude;
    private String geometry;
    private String verifiedBy;
    private LocalDateTime verifiedAt;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static LandParcelResponse fromEntity(LandParcel parcel) {
        return LandParcelResponse.builder()
                .id(parcel.getId())
                .parcelNumber(parcel.getParcelNumber())
                .surveyNumber(parcel.getSurveyNumber())
                .khasraNumber(parcel.getKhasraNumber())
                .village(parcel.getVillage())
                .tehsil(parcel.getTehsil())
                .district(parcel.getDistrict())
                .state(parcel.getState())
                .area(parcel.getArea())
                .areaUnit(parcel.getAreaUnit())
                .landType(parcel.getLandType())
                .ownerName(parcel.getOwnerName())
                .ownerContact(parcel.getOwnerContact())
                .ownerAadhaarMasked(parcel.getOwnerAadhaarMasked())
                .projectId(parcel.getProject().getId())
                .projectCode(parcel.getProject().getProjectCode())
                .projectName(parcel.getProject().getProjectName())
                .acquisitionStatus(parcel.getAcquisitionStatus())
                .verificationStatus(parcel.getVerificationStatus())
                .latitude(parcel.getLatitude())
                .longitude(parcel.getLongitude())
                .geometry(parcel.getGeometry())
                .verifiedBy(parcel.getVerifiedBy())
                .verifiedAt(parcel.getVerifiedAt())
                .remarks(parcel.getRemarks())
                .createdAt(parcel.getCreatedAt())
                .updatedAt(parcel.getUpdatedAt())
                .build();
    }
}
