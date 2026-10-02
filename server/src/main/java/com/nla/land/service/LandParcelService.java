package com.nla.land.service;

import com.nla.land.dto.LandParcelRequest;
import com.nla.land.dto.LandParcelResponse;
import com.nla.land.dto.ParcelStatusUpdateRequest;
import com.nla.land.dto.ParcelVerificationRequest;
import com.nla.land.entity.AcquisitionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LandParcelService {

    LandParcelResponse createLandParcel(LandParcelRequest request);

    LandParcelResponse getLandParcelById(Long id);

    LandParcelResponse getLandParcelByNumber(String parcelNumber);

    Page<LandParcelResponse> getLandParcels(Long projectId, String district, AcquisitionStatus status, String village, Pageable pageable);

    List<LandParcelResponse> getParcelsByProject(Long projectId);

    LandParcelResponse updateLandParcel(Long id, LandParcelRequest request);

    LandParcelResponse updateStatus(Long id, ParcelStatusUpdateRequest request);

    LandParcelResponse verifyParcel(Long id, ParcelVerificationRequest request);

    void deleteLandParcel(Long id);
}
