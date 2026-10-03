package com.nla.gis.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GeoJsonFeature {

    @Builder.Default
    private String type = "Feature";

    private Long id;

    private Object geometry;

    private Map<String, Object> properties;

    public static Object parseGeometryString(String geometryJson, Double lat, Double lng) {
        if (geometryJson != null && !geometryJson.isBlank()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                return mapper.readValue(geometryJson, Map.class);
            } catch (Exception ignored) {
            }
        }
        if (lat != null && lng != null) {
            return Map.of(
                    "type", "Point",
                    "coordinates", new double[]{lng, lat}
            );
        }
        return null;
    }
}
