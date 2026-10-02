package com.nla.gis.service.impl;

import com.nla.common.exception.ResourceNotFoundException;
import com.nla.gis.dto.GeoJsonFeature;
import com.nla.gis.dto.GeoJsonFeatureCollection;
import com.nla.gis.dto.ProjectGisSummary;
import com.nla.gis.service.GisService;
import com.nla.land.entity.AcquisitionStatus;
import com.nla.land.entity.LandParcel;
import com.nla.land.repository.LandParcelRepository;
import com.nla.project.entity.Project;
import com.nla.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GisServiceImpl implements GisService {

    private final LandParcelRepository landParcelRepository;
    private final ProjectRepository projectRepository;

    @Override
    @Transactional(readOnly = true)
    public GeoJsonFeatureCollection getParcelsGeoJsonByProject(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project", "id", projectId);
        }

        List<LandParcel> parcels = landParcelRepository.findByProjectId(projectId);
        return buildFeatureCollection(parcels);
    }

    @Override
    @Transactional(readOnly = true)
    public GeoJsonFeatureCollection getParcelsGeoJsonByDistrict(String district) {
        List<LandParcel> parcels = landParcelRepository.findByFilters(null, district, null, null, Pageable.unpaged()).getContent();
        return buildFeatureCollection(parcels);
    }

    @Override
    @Transactional(readOnly = true)
    public GeoJsonFeatureCollection getNearbyParcels(Double latitude, Double longitude, Double radiusKm) {
        if (radiusKm == null || radiusKm <= 0) {
            radiusKm = 10.0;
        }

        // Bounding box approximation: 1 deg lat ~ 111 km, 1 deg lng ~ 111 * cos(lat)
        double latDelta = radiusKm / 111.0;
        double lngDelta = radiusKm / (111.0 * Math.cos(Math.toRadians(latitude)));

        List<LandParcel> candidates = landParcelRepository.findWithinBoundingBox(
                latitude - latDelta, latitude + latDelta,
                longitude - lngDelta, longitude + lngDelta
        );

        return buildFeatureCollection(candidates);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectGisSummary getProjectGisSummary(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        List<LandParcel> parcels = landParcelRepository.findByProjectId(projectId);
        long totalParcels = parcels.size();
        long acquiredParcels = parcels.stream().filter(p -> p.getAcquisitionStatus() == AcquisitionStatus.ACQUIRED || p.getAcquisitionStatus() == AcquisitionStatus.POSSESSION_TAKEN).count();
        long pendingParcels = totalParcels - acquiredParcels;

        BigDecimal totalArea = parcels.stream().map(LandParcel::getArea).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal acquiredArea = parcels.stream()
                .filter(p -> p.getAcquisitionStatus() == AcquisitionStatus.ACQUIRED || p.getAcquisitionStatus() == AcquisitionStatus.POSSESSION_TAKEN)
                .map(LandParcel::getArea)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal pendingArea = totalArea.subtract(acquiredArea);

        double pct = (totalArea.compareTo(BigDecimal.ZERO) > 0)
                ? acquiredArea.divide(totalArea, 4, RoundingMode.HALF_UP).doubleValue() * 100
                : 0.0;

        Map<String, Long> statusBreakdown = parcels.stream()
                .collect(Collectors.groupingBy(p -> p.getAcquisitionStatus().name(), Collectors.counting()));

        return ProjectGisSummary.builder()
                .projectId(project.getId())
                .projectName(project.getProjectName())
                .totalParcels(totalParcels)
                .acquiredParcels(acquiredParcels)
                .pendingParcels(pendingParcels)
                .totalAreaAcres(totalArea)
                .acquiredAreaAcres(acquiredArea)
                .pendingAreaAcres(pendingArea)
                .acquisitionPercentage(pct)
                .statusBreakdown(statusBreakdown)
                .featureCollection(buildFeatureCollection(parcels))
                .build();
    }

    private GeoJsonFeatureCollection buildFeatureCollection(List<LandParcel> parcels) {
        List<GeoJsonFeature> features = parcels.stream().map(parcel -> {
            Map<String, Object> props = new LinkedHashMap<>();
            props.put("parcelId", parcel.getId());
            props.put("parcelNumber", parcel.getParcelNumber());
            props.put("surveyNumber", parcel.getSurveyNumber());
            props.put("khasraNumber", parcel.getKhasraNumber());
            props.put("village", parcel.getVillage());
            props.put("tehsil", parcel.getTehsil());
            props.put("district", parcel.getDistrict());
            props.put("state", parcel.getState());
            props.put("area", parcel.getArea());
            props.put("areaUnit", parcel.getAreaUnit());
            props.put("landType", parcel.getLandType() != null ? parcel.getLandType().name() : null);
            props.put("ownerName", parcel.getOwnerName());
            props.put("acquisitionStatus", parcel.getAcquisitionStatus() != null ? parcel.getAcquisitionStatus().name() : null);
            props.put("verificationStatus", parcel.getVerificationStatus() != null ? parcel.getVerificationStatus().name() : null);
            props.put("projectId", parcel.getProject().getId());
            props.put("projectName", parcel.getProject().getProjectName());

            Object geom = GeoJsonFeature.parseGeometryString(parcel.getGeometry(), parcel.getLatitude(), parcel.getLongitude());

            return GeoJsonFeature.builder()
                    .type("Feature")
                    .id(parcel.getId())
                    .geometry(geom)
                    .properties(props)
                    .build();
        }).toList();

        return GeoJsonFeatureCollection.builder()
                .type("FeatureCollection")
                .features(features)
                .build();
    }
}
