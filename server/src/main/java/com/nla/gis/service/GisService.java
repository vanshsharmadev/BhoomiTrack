package com.nla.gis.service;

import com.nla.gis.dto.GeoJsonFeatureCollection;
import com.nla.gis.dto.ProjectGisSummary;

public interface GisService {

    GeoJsonFeatureCollection getParcelsGeoJsonByProject(Long projectId);

    GeoJsonFeatureCollection getParcelsGeoJsonByDistrict(String district);

    GeoJsonFeatureCollection getNearbyParcels(Double latitude, Double longitude, Double radiusKm);

    ProjectGisSummary getProjectGisSummary(Long projectId);
}
