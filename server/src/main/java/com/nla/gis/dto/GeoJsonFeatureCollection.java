package com.nla.gis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeoJsonFeatureCollection {

    @Builder.Default
    private String type = "FeatureCollection";

    @Builder.Default
    private List<GeoJsonFeature> features = new ArrayList<>();
}
