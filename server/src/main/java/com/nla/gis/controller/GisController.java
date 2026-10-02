package com.nla.gis.controller;

import com.nla.common.dto.ApiResponse;
import com.nla.gis.dto.GeoJsonFeatureCollection;
import com.nla.gis.dto.ProjectGisSummary;
import com.nla.gis.service.GisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gis")
@RequiredArgsConstructor
@Tag(name = "GIS Module", description = "Spatial PostGIS and GeoJSON boundaries and mapping APIs")
public class GisController {

    private final GisService gisService;

    @GetMapping("/projects/{projectId}/parcels")
    @Operation(summary = "Get project parcels formatted as GeoJSON FeatureCollection for map visualization")
    public ResponseEntity<GeoJsonFeatureCollection> getProjectParcelsGeoJson(@PathVariable Long projectId) {
        GeoJsonFeatureCollection collection = gisService.getParcelsGeoJsonByProject(projectId);
        return ResponseEntity.ok(collection);
    }

    @GetMapping("/projects/{projectId}/summary")
    @Operation(summary = "Get comprehensive GIS acquisition breakdown and boundary geometries")
    public ResponseEntity<ApiResponse<ProjectGisSummary>> getProjectGisSummary(@PathVariable Long projectId) {
        ProjectGisSummary summary = gisService.getProjectGisSummary(projectId);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping("/parcels/district")
    @Operation(summary = "Get all parcel polygons within a district as GeoJSON")
    public ResponseEntity<GeoJsonFeatureCollection> getDistrictParcelsGeoJson(@RequestParam String district) {
        GeoJsonFeatureCollection collection = gisService.getParcelsGeoJsonByDistrict(district);
        return ResponseEntity.ok(collection);
    }

    @GetMapping("/parcels/nearby")
    @Operation(summary = "Find parcels within radius (km) of given coordinates")
    public ResponseEntity<GeoJsonFeatureCollection> getNearbyParcels(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "10.0") Double radiusKm
    ) {
        GeoJsonFeatureCollection collection = gisService.getNearbyParcels(lat, lng, radiusKm);
        return ResponseEntity.ok(collection);
    }
}
