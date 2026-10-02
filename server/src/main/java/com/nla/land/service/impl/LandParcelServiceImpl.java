package com.nla.land.service.impl;

import com.nla.audit.entity.AuditAction;
import com.nla.audit.service.AuditService;
import com.nla.common.exception.BusinessRuleException;
import com.nla.common.exception.ResourceNotFoundException;
import com.nla.land.dto.LandParcelRequest;
import com.nla.land.dto.LandParcelResponse;
import com.nla.land.dto.ParcelStatusUpdateRequest;
import com.nla.land.dto.ParcelVerificationRequest;
import com.nla.land.entity.AcquisitionStatus;
import com.nla.land.entity.LandParcel;
import com.nla.land.entity.VerificationStatus;
import com.nla.land.repository.LandParcelRepository;
import com.nla.land.service.LandParcelService;
import com.nla.project.entity.Project;
import com.nla.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LandParcelServiceImpl implements LandParcelService {

    private final LandParcelRepository landParcelRepository;
    private final ProjectRepository projectRepository;
    private final AuditService auditService;

    @Override
    @Transactional
    public LandParcelResponse createLandParcel(LandParcelRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", request.getProjectId()));

        if (request.getArea() == null || request.getArea().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleException("Parcel area must be greater than zero");
        }

        // Duplicate check within village/district/project
        if (landParcelRepository.existsBySurveyNumberAndVillageAndDistrictAndProjectId(
                request.getSurveyNumber(), request.getVillage(), request.getDistrict(), project.getId())) {
            throw new BusinessRuleException(String.format("Survey number '%s' in village '%s', district '%s' already exists for this project",
                    request.getSurveyNumber(), request.getVillage(), request.getDistrict()));
        }

        String parcelNum = request.getParcelNumber();
        if (parcelNum == null || parcelNum.isBlank()) {
            parcelNum = "LP-" + (System.currentTimeMillis() % 1000000);
        }

        String geometry = request.getGeometry();
        if ((geometry == null || geometry.isBlank()) && request.getLatitude() != null && request.getLongitude() != null) {
            // Generate synthetic polygon around coordinates for GIS visualization
            double lat = request.getLatitude();
            double lng = request.getLongitude();
            double delta = 0.001; // ~100m square
            geometry = String.format("{\"type\":\"Polygon\",\"coordinates\":[[[%f,%f],[%f,%f],[%f,%f],[%f,%f],[%f,%f]]]}",
                    lng - delta, lat - delta,
                    lng + delta, lat - delta,
                    lng + delta, lat + delta,
                    lng - delta, lat + delta,
                    lng - delta, lat - delta);
        }

        LandParcel parcel = LandParcel.builder()
                .parcelNumber(parcelNum)
                .surveyNumber(request.getSurveyNumber())
                .khasraNumber(request.getKhasraNumber())
                .village(request.getVillage())
                .tehsil(request.getTehsil())
                .district(request.getDistrict())
                .state(request.getState())
                .area(request.getArea())
                .areaUnit(request.getAreaUnit() != null ? request.getAreaUnit() : "ACRES")
                .landType(request.getLandType())
                .ownerName(request.getOwnerName())
                .ownerContact(request.getOwnerContact())
                .ownerAadhaarMasked(request.getOwnerAadhaarMasked())
                .project(project)
                .acquisitionStatus(AcquisitionStatus.PROPOSED)
                .verificationStatus(VerificationStatus.PENDING)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .geometry(geometry)
                .remarks(request.getRemarks())
                .build();

        LandParcel saved = landParcelRepository.save(parcel);

        auditService.logAction(
                "LandParcel",
                saved.getId(),
                AuditAction.CREATED,
                null,
                saved.getAcquisitionStatus().name(),
                null,
                "Land parcel created: " + saved.getParcelNumber() + " (Survey: " + saved.getSurveyNumber() + ")"
        );

        return LandParcelResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public LandParcelResponse getLandParcelById(Long id) {
        LandParcel parcel = landParcelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LandParcel", "id", id));
        return LandParcelResponse.fromEntity(parcel);
    }

    @Override
    @Transactional(readOnly = true)
    public LandParcelResponse getLandParcelByNumber(String parcelNumber) {
        LandParcel parcel = landParcelRepository.findByParcelNumber(parcelNumber)
                .orElseThrow(() -> new ResourceNotFoundException("LandParcel", "parcelNumber", parcelNumber));
        return LandParcelResponse.fromEntity(parcel);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LandParcelResponse> getLandParcels(Long projectId, String district, AcquisitionStatus status, String village, Pageable pageable) {
        return landParcelRepository.findByFilters(projectId, district, status, village, pageable)
                .map(LandParcelResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LandParcelResponse> getParcelsByProject(Long projectId) {
        return landParcelRepository.findByProjectId(projectId).stream()
                .map(LandParcelResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public LandParcelResponse updateLandParcel(Long id, LandParcelRequest request) {
        LandParcel parcel = landParcelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LandParcel", "id", id));

        parcel.setSurveyNumber(request.getSurveyNumber());
        parcel.setKhasraNumber(request.getKhasraNumber());
        parcel.setVillage(request.getVillage());
        parcel.setTehsil(request.getTehsil());
        parcel.setDistrict(request.getDistrict());
        parcel.setState(request.getState());
        parcel.setArea(request.getArea());
        if (request.getAreaUnit() != null) parcel.setAreaUnit(request.getAreaUnit());
        parcel.setLandType(request.getLandType());
        parcel.setOwnerName(request.getOwnerName());
        parcel.setOwnerContact(request.getOwnerContact());
        parcel.setOwnerAadhaarMasked(request.getOwnerAadhaarMasked());
        if (request.getLatitude() != null) parcel.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) parcel.setLongitude(request.getLongitude());
        if (request.getGeometry() != null) parcel.setGeometry(request.getGeometry());
        parcel.setRemarks(request.getRemarks());

        LandParcel saved = landParcelRepository.save(parcel);

        auditService.logAction(
                "LandParcel",
                saved.getId(),
                AuditAction.UPDATED,
                null,
                saved.getAcquisitionStatus().name(),
                null,
                "Land parcel updated"
        );

        return LandParcelResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public LandParcelResponse updateStatus(Long id, ParcelStatusUpdateRequest request) {
        LandParcel parcel = landParcelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LandParcel", "id", id));

        AcquisitionStatus oldStatus = parcel.getAcquisitionStatus();
        if (oldStatus == request.getStatus()) {
            return LandParcelResponse.fromEntity(parcel);
        }

        parcel.setAcquisitionStatus(request.getStatus());
        if (request.getRemarks() != null) {
            parcel.setRemarks(request.getRemarks());
        }

        LandParcel saved = landParcelRepository.save(parcel);

        auditService.logAction(
                "LandParcel",
                saved.getId(),
                AuditAction.STATUS_CHANGED,
                oldStatus.name(),
                request.getStatus().name(),
                null,
                request.getRemarks() != null ? request.getRemarks() : "Acquisition status changed"
        );

        return LandParcelResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public LandParcelResponse verifyParcel(Long id, ParcelVerificationRequest request) {
        LandParcel parcel = landParcelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LandParcel", "id", id));

        VerificationStatus oldVerif = parcel.getVerificationStatus();
        parcel.setVerificationStatus(request.getVerificationStatus());
        parcel.setVerifiedAt(LocalDateTime.now());
        parcel.setVerifiedBy(request.getVerifiedBy() != null ? request.getVerifiedBy() : getCurrentUser());

        if (request.getVerificationStatus() == VerificationStatus.VERIFIED && parcel.getAcquisitionStatus() == AcquisitionStatus.PROPOSED) {
            parcel.setAcquisitionStatus(AcquisitionStatus.VERIFIED);
        }

        LandParcel saved = landParcelRepository.save(parcel);

        auditService.logAction(
                "LandParcel",
                saved.getId(),
                AuditAction.VERIFIED,
                oldVerif.name(),
                request.getVerificationStatus().name(),
                parcel.getVerifiedBy(),
                request.getRemarks() != null ? request.getRemarks() : "Parcel field verification recorded"
        );

        return LandParcelResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteLandParcel(Long id) {
        LandParcel parcel = landParcelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LandParcel", "id", id));

        landParcelRepository.delete(parcel);

        auditService.logAction(
                "LandParcel",
                id,
                AuditAction.DELETED,
                parcel.getAcquisitionStatus().name(),
                null,
                null,
                "Land parcel deleted: " + parcel.getParcelNumber()
        );
    }

    private String getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.isAuthenticated()) ? auth.getName() : "FIELD_OFFICER";
    }
}
