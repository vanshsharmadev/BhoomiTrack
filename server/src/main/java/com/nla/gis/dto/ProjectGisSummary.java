package com.nla.gis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectGisSummary {

    private Long projectId;
    private String projectName;
    private long totalParcels;
    private long acquiredParcels;
    private long pendingParcels;
    private BigDecimal totalAreaAcres;
    private BigDecimal acquiredAreaAcres;
    private BigDecimal pendingAreaAcres;
    private double acquisitionPercentage;
    private Map<String, Long> statusBreakdown;
    private GeoJsonFeatureCollection featureCollection;
}
