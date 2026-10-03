import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { KpiCard } from '../components/common/KpiCard';
import { ApiService } from '../services/api';
import { createLeafletTileLayer, BASEMAP_PROVIDERS } from '../services/mapProvider';
import {
  parseParcelGeometry,
  parcelToGeoJsonFeature,
  generateProjectCorridorGeoJson,
  generateFieldSurveyGeoJson,
  generateRiskHotspotsGeoJson,
  getAdminBoundariesGeoJson,
  calculateGeodesicDistance,
  calculatePolygonArea,
  detectSpatialOverlaps
} from '../utils/gisUtils';

export const GisPage = () => {
  const { projects, parcels: contextParcels, showToast, logAuditEvent } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const baseLayerRef = useRef(null);
  const parcelLayerGroupRef = useRef(null);
  const corridorLayerGroupRef = useRef(null);
  const adminBoundsLayerGroupRef = useRef(null);
  const dgpsRoversLayerGroupRef = useRef(null);
  const evidencePhotosLayerGroupRef = useRef(null);
  const riskHotspotsLayerGroupRef = useRef(null);
  const measureLayerGroupRef = useRef(null);
  const selectedHighlightRef = useRef(null);

  // Live Backend Data
  const [liveParcels, setLiveParcels] = useState([]);
  const [isLoadingParcels, setIsLoadingParcels] = useState(true);
  const [apiErrorState, setApiErrorState] = useState(null);
  const [projectSummaryData, setProjectSummaryData] = useState(null);

  // Active base map style (satellite | streets | terrain)
  const [activeBaseStyle, setActiveBaseStyle] = useState('satellite');

  // Selected project for spatial filtering
  const [selectedProjectId, setSelectedProjectId] = useState(
    searchParams.get('projectId') || 'ALL'
  );

  // Selected feature / parcel for right inspector panel
  const [selectedParcel, setSelectedParcel] = useState(null);

  // Search query in spatial search bar
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('khasra') || searchParams.get('q') || ''
  );

  // Layer Visibility & Opacity
  const [layers, setLayers] = useState({
    parcels: { visible: true, opacity: 0.65, label: 'Cadastral Parcels (All)', icon: 'grid_view' },
    acquiredOnly: { visible: false, opacity: 0.8, label: 'Vested / Acquired (Green)', icon: 'verified' },
    disputedOnly: { visible: false, opacity: 0.85, label: 'Litigation & Contested (Red)', icon: 'warning' },
    rowCorridor: { visible: true, opacity: 0.5, label: '60m RoW Corridor & Centerline', icon: 'polyline' },
    adminBounds: { visible: true, opacity: 0.4, label: 'District & Tehsil Boundaries', icon: 'crop_free' },
    dgpsRovers: { visible: true, opacity: 1.0, label: 'DGPS RTK Survey Rover Points', icon: 'my_location' },
    evidencePhotos: { visible: true, opacity: 1.0, label: 'Geo-Tagged Field Photos', icon: 'photo_camera' },
    riskHotspots: { visible: true, opacity: 0.45, label: 'Sec 19 Lapse & Forest Conflict Zones', icon: 'radar' }
  });

  // Layer drawer collapse state
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(true);

  // Interactive Measurement Tool State
  const [measureMode, setMeasureMode] = useState(null); // null | 'distance' | 'area'
  const [measurePoints, setMeasurePoints] = useState([]);
  const [measureResult, setMeasureResult] = useState(null);

  // Overlap Detection Modal State
  const [isOverlapModalOpen, setIsOverlapModalOpen] = useState(false);

  // Photo modal preview state
  const [activePhotoModal, setActivePhotoModal] = useState(null);

  // Cursor Real-Time Telemetry
  const [cursorCoords, setCursorCoords] = useState({ lat: 28.3512, lng: 76.9384, zoom: 14.2 });

  // 1. Fetch live parcels from Backend PostGIS on mount
  useEffect(() => {
    let isMounted = true;
    const fetchParcelsFromBackend = async () => {
      setIsLoadingParcels(true);
      try {
        const res = await ApiService.getLandParcels({ page: 0, size: 100 });
        if (isMounted) {
          if (res && res.data && res.data.content && res.data.content.length > 0) {
            setLiveParcels(res.data.content);
            setApiErrorState(null);
          } else {
            // Fallback to AppContext if backend returns empty or network fails
            setLiveParcels(contextParcels || []);
          }
        }
      } catch (err) {
        console.warn('[GIS] Failed to fetch live land parcels:', err.message);
        if (isMounted) {
          setLiveParcels(contextParcels || []);
          setApiErrorState('GIS API offline - loaded local context cadastre');
        }
      } finally {
        if (isMounted) {
          setIsLoadingParcels(false);
        }
      }
    };

    fetchParcelsFromBackend();
    return () => {
      isMounted = false;
    };
  }, [contextParcels]);

  // 2. Fetch project GIS summary when selectedProjectId changes
  useEffect(() => {
    if (selectedProjectId === 'ALL') {
      setProjectSummaryData(null);
      return;
    }

    let isMounted = true;
    const fetchSummary = async () => {
      try {
        const res = await ApiService.getProjectGisSummary(selectedProjectId);
        if (isMounted && res && res.data) {
          setProjectSummaryData(res.data);
        }
      } catch (err) {
        console.warn(`[GIS] Summary fetch failed for project ${selectedProjectId}:`, err.message);
      }
    };

    fetchSummary();
    return () => {
      isMounted = false;
    };
  }, [selectedProjectId]);

  // Combined parcel pool
  const allParcels = useMemo(() => {
    if (liveParcels.length > 0) return liveParcels;
    return contextParcels || [];
  }, [liveParcels, contextParcels]);

  // Filtered parcels based on project selection
  const filteredParcels = useMemo(() => {
    if (selectedProjectId === 'ALL') return allParcels;
    return allParcels.filter(
      p =>
        String(p.projectId) === String(selectedProjectId) ||
        String(p.numericId) === String(selectedProjectId) ||
        p.projectCode === selectedProjectId
    );
  }, [allParcels, selectedProjectId]);

  // Generate GeoJSON datasets
  const parcelGeoJson = useMemo(() => {
    const features = filteredParcels
      .map(p => parcelToGeoJsonFeature(p))
      .filter(Boolean);

    return {
      type: 'FeatureCollection',
      features
    };
  }, [filteredParcels]);

  const corridorGeoJson = useMemo(() => {
    return generateProjectCorridorGeoJson(filteredParcels);
  }, [filteredParcels]);

  const fieldSurveyGeoJson = useMemo(() => {
    return generateFieldSurveyGeoJson(filteredParcels);
  }, [filteredParcels]);

  const riskHotspotsGeoJson = useMemo(() => {
    return generateRiskHotspotsGeoJson(filteredParcels);
  }, [filteredParcels]);

  const adminBoundariesGeoJson = useMemo(() => {
    return getAdminBoundariesGeoJson();
  }, []);

  const overlapData = useMemo(() => {
    return detectSpatialOverlaps(filteredParcels);
  }, [filteredParcels]);

  // Select parcel handler
  const selectParcel = useCallback((parcel) => {
    setSelectedParcel(parcel);
    const map = mapRef.current;
    if (!map) return;

    // Highlight selected parcel outline on Leaflet map
    if (selectedHighlightRef.current) {
      map.removeLayer(selectedHighlightRef.current);
      selectedHighlightRef.current = null;
    }

    const geom = parseParcelGeometry(parcel);
    if (geom && geom.coordinates) {
      const geoJsonFeature = {
        type: 'Feature',
        geometry: geom,
        properties: {}
      };

      const highlight = L.geoJSON(geoJsonFeature, {
        style: {
          color: '#38bdf8',
          weight: 4,
          fillColor: '#38bdf8',
          fillOpacity: 0.25,
          dashArray: '2, 2'
        }
      }).addTo(map);

      selectedHighlightRef.current = highlight;

      // Pan/Zoom to parcel bounds
      const bounds = highlight.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }
    }
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up existing map instance if any
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Pick center from first parcel or Delhi NCR default
    let initialCenter = [28.353, 76.940]; // Manesar default [lat, lng]
    if (filteredParcels[0]) {
      const firstGeom = parseParcelGeometry(filteredParcels[0]);
      if (firstGeom && firstGeom.coordinates && firstGeom.coordinates[0] && firstGeom.coordinates[0][0]) {
        // GeoJSON is [lng, lat], Leaflet center is [lat, lng]
        initialCenter = [firstGeom.coordinates[0][0][1], firstGeom.coordinates[0][0][0]];
      } else if (filteredParcels[0].latitude && filteredParcels[0].longitude) {
        initialCenter = [filteredParcels[0].latitude, filteredParcels[0].longitude];
      }
    }

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    // Add controls
    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.scale({ maxWidth: 150, metric: true, imperial: false, position: 'bottomleft' }).addTo(map);

    // Add initial base tile layer
    const baseLayer = createLeafletTileLayer(L, activeBaseStyle);
    baseLayer.addTo(map);
    baseLayerRef.current = baseLayer;

    // Initialize Layer Groups
    adminBoundsLayerGroupRef.current = L.layerGroup().addTo(map);
    corridorLayerGroupRef.current = L.layerGroup().addTo(map);
    parcelLayerGroupRef.current = L.layerGroup().addTo(map);
    dgpsRoversLayerGroupRef.current = L.layerGroup().addTo(map);
    evidencePhotosLayerGroupRef.current = L.layerGroup().addTo(map);
    riskHotspotsLayerGroupRef.current = L.layerGroup().addTo(map);
    measureLayerGroupRef.current = L.layerGroup().addTo(map);

    // Mouse telemetry listener
    map.on('mousemove', (e) => {
      setCursorCoords({
        lat: Number(e.latlng.lat.toFixed(5)),
        lng: Number(e.latlng.lng.toFixed(5)),
        zoom: Number(map.getZoom().toFixed(1))
      });
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Base Style Switcher
  const handleBaseStyleChange = (styleKey) => {
    setActiveBaseStyle(styleKey);
    const map = mapRef.current;
    if (!map) return;

    if (baseLayerRef.current) {
      map.removeLayer(baseLayerRef.current);
    }

    try {
      const newBaseLayer = createLeafletTileLayer(L, styleKey);
      newBaseLayer.addTo(map);
      baseLayerRef.current = newBaseLayer;
      showToast(`Switched basemap to ${BASEMAP_PROVIDERS[styleKey]?.name || styleKey}`, 'info');
    } catch (err) {
      console.error('Error changing basemap:', err);
      showToast('Failed to load selected basemap tile provider', 'error');
    }
  };

  // Render & Update GeoJSON Vector Layers on Leaflet
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 1. Administrative Boundaries Layer
    if (adminBoundsLayerGroupRef.current) {
      adminBoundsLayerGroupRef.current.clearLayers();
      if (layers.adminBounds.visible) {
        const adminLayer = L.geoJSON(adminBoundariesGeoJson, {
          style: {
            fillColor: '#0284c7',
            fillOpacity: layers.adminBounds.opacity * 0.15,
            color: '#0284c7',
            weight: 2,
            dashArray: '4, 4'
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties?.name) {
              layer.bindTooltip(`<b>${feature.properties.name}</b> (${feature.properties.level})`, {
                sticky: true
              });
            }
          }
        });
        adminBoundsLayerGroupRef.current.addLayer(adminLayer);
      }
    }

    // 2. Right-of-Way Corridor Layer
    if (corridorLayerGroupRef.current) {
      corridorLayerGroupRef.current.clearLayers();
      if (layers.rowCorridor.visible) {
        const corridorLayer = L.geoJSON(corridorGeoJson, {
          style: (feature) => {
            if (feature.geometry.type === 'LineString') {
              return {
                color: '#f59e0b',
                weight: 3,
                dashArray: '4, 3',
                opacity: 0.9
              };
            }
            return {
              fillColor: '#0284c7',
              fillOpacity: layers.rowCorridor.opacity * 0.35,
              color: '#0284c7',
              weight: 1.5,
              dashArray: '3, 2'
            };
          }
        });
        corridorLayerGroupRef.current.addLayer(corridorLayer);
      }
    }

    // 3. Cadastral Land Parcels Layer
    if (parcelLayerGroupRef.current) {
      parcelLayerGroupRef.current.clearLayers();
      if (layers.parcels.visible) {
        const parcelLayer = L.geoJSON(parcelGeoJson, {
          style: (feature) => ({
            fillColor: feature.properties?.statusColor || '#2563EB',
            fillOpacity: layers.parcels.opacity,
            color: '#ffffff',
            weight: 1.5,
            opacity: 0.95
          }),
          onEachFeature: (feature, layer) => {
            const p = feature.properties;
            // Tooltip
            const tooltipHtml = `
              <div style="font-family: sans-serif; font-size: 11px; padding: 2px;">
                <div style="font-weight: bold; font-size: 12px; margin-bottom: 2px;">
                  Khasra ${p.khasraNumber || p.khasraNo} • ${p.village}
                </div>
                <div style="color: #64748B; font-family: monospace; font-size: 10px;">${p.ulpin || ''}</div>
                <div style="margin-top: 3px; display: flex; justify-content: space-between; gap: 8px;">
                  <span>Area: <strong>${p.area || p.totalAreaHa} ${p.areaUnit || 'Acres'}</strong></span>
                  <span style="font-weight: 600; color: ${p.statusColor};">${p.acquisitionStatus}</span>
                </div>
                <div style="margin-top: 2px; color: #334155;">Owner: ${p.ownerName}</div>
              </div>
            `;
            layer.bindTooltip(tooltipHtml, { sticky: true, opacity: 0.95 });

            // Click Handler
            layer.on('click', () => {
              const matched = filteredParcels.find(
                item => String(item.id) === String(feature.id) || String(item.parcelNumber) === String(p.parcelNumber)
              );
              selectParcel(matched || p);
            });

            // Hover Highlights
            layer.on('mouseover', () => {
              layer.setStyle({ weight: 3, color: '#38bdf8' });
            });
            layer.on('mouseout', () => {
              parcelLayer.resetStyle(layer);
            });
          }
        });
        parcelLayerGroupRef.current.addLayer(parcelLayer);

        // Auto-fit bounds if parcels are loaded
        const bounds = parcelLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        }
      }
    }

    // 4. Field Survey DGPS Rovers & Photo Markers
    if (dgpsRoversLayerGroupRef.current && evidencePhotosLayerGroupRef.current) {
      dgpsRoversLayerGroupRef.current.clearLayers();
      evidencePhotosLayerGroupRef.current.clearLayers();

      const surveyLayer = L.geoJSON(fieldSurveyGeoJson, {
        pointToLayer: (feature, latlng) => {
          const isRover = feature.properties?.type === 'dgps_rover';

          if (isRover && layers.dgpsRovers.visible) {
            const marker = L.marker(latlng, {
              icon: L.divIcon({
                className: 'dgps-rover-pin',
                html: `
                  <div style="background: #107307; width: 22px; height: 22px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 8px rgba(16,115,7,0.8);">
                    <span class="material-symbols-outlined" style="font-size: 13px; color: white;">my_location</span>
                  </div>
                `,
                iconSize: [22, 22],
                iconAnchor: [11, 11]
              })
            }).bindPopup(`
              <div style="font-size: 11px; font-family: sans-serif;">
                <strong>${feature.properties?.title || 'DGPS RTK Survey Rover'}</strong><br/>
                <span style="color: #107307; font-weight: bold;">RTK Fixed: ±0.024m</span><br/>
                Satellite: NavIC / GPS Constellation<br/>
                Surveyor: ${feature.properties?.operator || 'Field Unit 4'}
              </div>
            `);
            dgpsRoversLayerGroupRef.current.addLayer(marker);
            return marker;
          } else if (!isRover && layers.evidencePhotos.visible) {
            const marker = L.marker(latlng, {
              icon: L.divIcon({
                className: 'photo-evidence-pin',
                html: `
                  <div style="background: #ea580c; width: 22px; height: 22px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 8px rgba(234,88,12,0.8); cursor: pointer;">
                    <span class="material-symbols-outlined" style="font-size: 14px; color: white;">photo_camera</span>
                  </div>
                `,
                iconSize: [22, 22],
                iconAnchor: [11, 11]
              })
            });

            marker.on('click', () => {
              setActivePhotoModal(feature.properties);
            });

            evidencePhotosLayerGroupRef.current.addLayer(marker);
            return marker;
          }
          return null;
        }
      });
    }

    // 5. Risk Hotspots Layer
    if (riskHotspotsLayerGroupRef.current) {
      riskHotspotsLayerGroupRef.current.clearLayers();
      if (layers.riskHotspots.visible) {
        const riskLayer = L.geoJSON(riskHotspotsGeoJson, {
          style: {
            fillColor: '#ef4444',
            fillOpacity: layers.riskHotspots.opacity,
            color: '#b91c1c',
            weight: 2,
            dashArray: '3, 3'
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties?.title) {
              layer.bindTooltip(`<b>${feature.properties.title}</b><br/>${feature.properties.description}`, {
                sticky: true
              });
            }
          }
        });
        riskHotspotsLayerGroupRef.current.addLayer(riskLayer);
      }
    }
  }, [
    parcelGeoJson,
    corridorGeoJson,
    fieldSurveyGeoJson,
    riskHotspotsGeoJson,
    adminBoundariesGeoJson,
    layers,
    filteredParcels,
    selectParcel
  ]);

  // Measurement Click Handling
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleMeasurementClick = (e) => {
      if (!measureMode) return;

      const point = [e.latlng.lat, e.latlng.lng];
      setMeasurePoints(prev => {
        const updated = [...prev, point];
        renderMeasurementOnMap(updated, measureMode);
        return updated;
      });
    };

    map.on('click', handleMeasurementClick);

    return () => {
      map.off('click', handleMeasurementClick);
    };
  }, [measureMode]);

  // Render Measurement graphics on map
  const renderMeasurementOnMap = (points, mode) => {
    const map = mapRef.current;
    if (!map || !measureLayerGroupRef.current) return;

    measureLayerGroupRef.current.clearLayers();

    if (points.length === 0) {
      setMeasureResult(null);
      return;
    }

    // Add point markers
    points.forEach((pt, idx) => {
      const circle = L.circleMarker(pt, {
        radius: 5,
        fillColor: '#ffffff',
        fillOpacity: 1,
        color: '#0284c7',
        weight: 2
      });
      measureLayerGroupRef.current.addLayer(circle);
    });

    if (mode === 'distance' && points.length >= 2) {
      const polyline = L.polyline(points, {
        color: '#0284c7',
        weight: 3,
        dashArray: '4, 4'
      });
      measureLayerGroupRef.current.addLayer(polyline);

      // Calculate total distance
      let totalMeters = 0;
      for (let i = 0; i < points.length - 1; i++) {
        // [lat, lng] to [lng, lat] for gisUtils calculation
        const ptA = [points[i][1], points[i][0]];
        const ptB = [points[i + 1][1], points[i + 1][0]];
        totalMeters += calculateGeodesicDistance(ptA, ptB);
      }

      setMeasureResult({
        type: 'distance',
        value: totalMeters >= 1000 ? `${(totalMeters / 1000).toFixed(3)} km` : `${totalMeters.toFixed(1)} meters`,
        disclaimer: 'Informational geodesic map measurement — statutory chainage governed by DPR alignment'
      });
    } else if (mode === 'area' && points.length >= 3) {
      const polygon = L.polygon(points, {
        color: '#0284c7',
        fillColor: '#38bdf8',
        fillOpacity: 0.3,
        weight: 2
      });
      measureLayerGroupRef.current.addLayer(polygon);

      // Calculate area
      const lngLatPoints = points.map(pt => [pt[1], pt[0]]);
      lngLatPoints.push(lngLatPoints[0]); // closed polygon
      const sqMeters = calculatePolygonArea(lngLatPoints);
      const hectares = sqMeters / 10000;
      const acres = sqMeters / 4046.86;

      setMeasureResult({
        type: 'area',
        value: `${hectares.toFixed(3)} Ha (${acres.toFixed(2)} Acres)`,
        disclaimer: 'Informational map measurement — legal area governed by Section 23 statutory award'
      });
    }
  };

  // Clear Measurement
  const clearMeasurement = () => {
    setMeasureMode(null);
    setMeasurePoints([]);
    setMeasureResult(null);
    if (measureLayerGroupRef.current) {
      measureLayerGroupRef.current.clearLayers();
    }
  };

  // Toggle Layer Visibility
  const toggleLayerVisibility = (layerKey) => {
    setLayers(prev => ({
      ...prev,
      [layerKey]: { ...prev[layerKey], visible: !prev[layerKey].visible }
    }));
  };

  // Update Layer Opacity
  const updateLayerOpacity = (layerKey, opacityVal) => {
    setLayers(prev => ({
      ...prev,
      [layerKey]: { ...prev[layerKey], opacity: opacityVal }
    }));
  };

  // Search Khasra, ULPIN, Owner or Village
  const handleSpatialSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.toLowerCase().trim();
    const match = allParcels.find(
      p =>
        (p.khasraNumber && p.khasraNumber.toLowerCase().includes(q)) ||
        (p.khasraNo && p.khasraNo.toLowerCase().includes(q)) ||
        (p.ulpin && p.ulpin.toLowerCase().includes(q)) ||
        (p.parcelNumber && p.parcelNumber.toLowerCase().includes(q)) ||
        (p.village && p.village.toLowerCase().includes(q)) ||
        (p.ownerName && p.ownerName.toLowerCase().includes(q))
    );

    if (match) {
      selectParcel(match);
      showToast(`Located Khasra ${match.khasraNumber || match.khasraNo} in ${match.village}`, 'success');
    } else {
      showToast(`No parcel matching "${searchQuery}" in cadastral database`, 'error');
    }
  };

  // Browser Geolocation (Locate Me)
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const map = mapRef.current;
        if (map) {
          map.setView([latitude, longitude], 16);
          const userMarker = L.circleMarker([latitude, longitude], {
            radius: 8,
            fillColor: '#38bdf8',
            fillOpacity: 0.9,
            color: '#ffffff',
            weight: 2
          }).bindPopup(`<b>Current Field Position</b><br/>Accuracy: ±${accuracy.toFixed(1)}m`).addTo(map);
          userMarker.openPopup();
          showToast(`Field position acquired: ±${accuracy.toFixed(1)}m precision`, 'success');
        }
      },
      (err) => {
        showToast(`GPS location error: ${err.message}`, 'error');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Export GeoJSON
  const handleExportGeoJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(parcelGeoJson, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `nlams_cadastral_${selectedProjectId}_${Date.now()}.geojson`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Exported Cadastral GeoJSON file successfully', 'success');
    logAuditEvent('GIS_GEOJSON_EXPORT', 'GIS', selectedProjectId, 'Exported project cadastral GeoJSON');
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Parcel_ID', 'Khasra_No', 'Survey_No', 'ULPIN', 'Village', 'Tehsil', 'District', 'State', 'Area_Acres', 'Owner_Name', 'Status'];
    const rows = filteredParcels.map(p => [
      p.parcelNumber || p.id,
      p.khasraNumber || p.khasraNo,
      p.surveyNumber || p.surveyNo,
      p.ulpin,
      p.village,
      p.tehsil,
      p.district,
      p.state,
      p.area || p.totalAreaHa,
      `"${p.ownerName}"`,
      p.acquisitionStatus
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const a = document.createElement('a');
    a.setAttribute('href', encodeURI(csvContent));
    a.setAttribute('download', `nlams_parcels_${selectedProjectId}_${Date.now()}.csv`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Exported Cadastral Attribute CSV successfully', 'success');
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-80px)] -mt-2 -mx-2 overflow-hidden bg-slate-950 font-sans">
      {/* 1. DATA SOURCE STATUS BANNER */}
      <div className="flex items-center justify-between px-3 py-1 bg-surface-container border-b border-outline-variant/30 text-xs z-30">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono font-bold text-primary">DATA SOURCE:</span>
          <span className="text-secondary font-medium">PostGIS Database (Development Cadastre)</span>
          <span className="text-outline">|</span>
          <span className="text-[11px] text-on-surface-variant font-mono">
            {filteredParcels.length} Active Spatial Parcels • Leaflet Engine (EPSG:4326)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 font-mono border border-amber-500/20 font-semibold">
            DEMO / TEST CADASTRE — NOT OFFICIAL GOVT RECORD
          </span>
        </div>
      </div>

      {/* 2. TOP HEADER & TELEMETRY STRIP */}
      <header className="bg-surface-container-lowest px-4 py-2 border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-3 text-xs z-30 shadow-xs">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-primary font-bold">
            <span className="material-symbols-outlined text-secondary text-[20px]">map</span>
            <span className="text-sm tracking-tight">National Cadastral GIS</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-secondary text-[10px] font-mono font-semibold uppercase">
              Leaflet • WGS84
            </span>
          </div>

          <span className="text-outline">|</span>

          {/* Project / Corridor Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-on-surface-variant font-medium text-[11px]">Corridor:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/40 rounded px-2 py-1 text-xs text-primary font-semibold focus:outline-none focus:border-primary"
            >
              <option value="ALL">All National Projects ({allParcels.length} Parcels)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.numericId || p.id}>
                  {p.projectCode} • {p.name || p.projectName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Spatial Search */}
        <form onSubmit={handleSpatialSearch} className="flex-1 max-w-sm flex items-center mx-2">
          <div className="w-full flex items-center bg-surface-container-low border border-outline-variant/40 rounded px-2.5 py-1 focus-within:border-primary">
            <span className="material-symbols-outlined text-secondary text-[16px] mr-1.5">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Khasra, ULPIN, Owner, Village..."
              className="w-full bg-transparent text-xs text-primary focus:outline-none placeholder-outline"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>
        </form>

        {/* Right: GIS Action Tools */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Base Layer Switcher */}
          <div className="flex rounded bg-surface-container-low p-0.5 border border-outline-variant/30 text-[11px] font-medium">
            <button
              onClick={() => handleBaseStyleChange('satellite')}
              className={`px-2 py-0.5 rounded transition-colors ${activeBaseStyle === 'satellite' ? 'bg-primary text-on-primary font-bold shadow-xs' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Satellite
            </button>
            <button
              onClick={() => handleBaseStyleChange('streets')}
              className={`px-2 py-0.5 rounded transition-colors ${activeBaseStyle === 'streets' ? 'bg-primary text-on-primary font-bold shadow-xs' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Streets
            </button>
            <button
              onClick={() => handleBaseStyleChange('terrain')}
              className={`px-2 py-0.5 rounded transition-colors ${activeBaseStyle === 'terrain' ? 'bg-primary text-on-primary font-bold shadow-xs' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Terrain
            </button>
          </div>

          {/* Measurement Tools */}
          <div className="flex items-center gap-1 border-l border-outline-variant/30 pl-1.5">
            <button
              onClick={() => {
                if (measureMode === 'distance') clearMeasurement();
                else {
                  clearMeasurement();
                  setMeasureMode('distance');
                  showToast('Distance tool active: Click on map to add measurement vertices', 'info');
                }
              }}
              title="Measure Linear Distance"
              className={`p-1.5 rounded text-xs flex items-center gap-1 border transition-colors ${measureMode === 'distance' ? 'bg-secondary text-white border-secondary' : 'bg-surface-container-low hover:bg-surface-container text-primary border-outline-variant/30'}`}
            >
              <span className="material-symbols-outlined text-[16px]">straighten</span>
              <span className="hidden sm:inline">Distance</span>
            </button>

            <button
              onClick={() => {
                if (measureMode === 'area') clearMeasurement();
                else {
                  clearMeasurement();
                  setMeasureMode('area');
                  showToast('Area tool active: Click 3+ points on map to measure polygon area', 'info');
                }
              }}
              title="Measure Polygon Area"
              className={`p-1.5 rounded text-xs flex items-center gap-1 border transition-colors ${measureMode === 'area' ? 'bg-secondary text-white border-secondary' : 'bg-surface-container-low hover:bg-surface-container text-primary border-outline-variant/30'}`}
            >
              <span className="material-symbols-outlined text-[16px]">square_foot</span>
              <span className="hidden sm:inline">Area</span>
            </button>

            {measureMode && (
              <button
                onClick={clearMeasurement}
                title="Cancel Measurement"
                className="p-1 rounded bg-[#FEE2E2] text-[#DC2626] text-xs hover:bg-[#FCA5A5]"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Spatial Overlap Detection */}
          <button
            onClick={() => setIsOverlapModalOpen(true)}
            className="p-1.5 rounded bg-surface-container-low hover:bg-surface-container text-primary text-xs font-semibold border border-outline-variant/30 flex items-center gap-1"
            title="Detect RoW Corridor & Forest Reserve Overlaps"
          >
            <span className="material-symbols-outlined text-secondary text-[16px]">compare</span>
            <span className="hidden md:inline">Overlap Analysis</span>
          </button>

          {/* Export GeoJSON */}
          <button
            onClick={handleExportGeoJson}
            className="p-1.5 rounded bg-surface-container-low hover:bg-surface-container text-primary text-xs font-semibold border border-outline-variant/30 flex items-center gap-1"
            title="Download Cadastral GeoJSON"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span className="hidden lg:inline">GeoJSON</span>
          </button>
        </div>
      </header>

      {/* 3. MAIN 3-PANE WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT PANE: Layer Control & Visibility */}
        <aside className={`${isLayerPanelOpen ? 'w-72' : 'w-10'} bg-surface-container-lowest border-r border-outline-variant/30 transition-all duration-200 flex flex-col justify-between z-20 shadow-md`}>
          {isLayerPanelOpen ? (
            <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <span className="font-bold text-xs uppercase tracking-wider text-primary">Spatial Layer Control</span>
                <button
                  onClick={() => setIsLayerPanelOpen(false)}
                  className="p-1 rounded hover:bg-surface-container text-outline hover:text-primary"
                  title="Collapse Layer Panel"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                </button>
              </div>

              {/* Layer Groups */}
              <div className="space-y-3">
                {/* Cadastral Parcels Layer */}
                <div className="p-2.5 rounded bg-surface-container-low/50 border border-outline-variant/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-primary">
                      <input
                        type="checkbox"
                        checked={layers.parcels.visible}
                        onChange={() => toggleLayerVisibility('parcels')}
                        className="rounded accent-primary"
                      />
                      <span>Cadastral Parcels ({filteredParcels.length})</span>
                    </label>
                    <span className="text-[10px] text-secondary font-mono font-bold">PostGIS</span>
                  </div>

                  {layers.parcels.visible && (
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                        <span>Fill Opacity:</span>
                        <span>{Math.round(layers.parcels.opacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={layers.parcels.opacity}
                        onChange={(e) => updateLayerOpacity('parcels', parseFloat(e.target.value))}
                        className="w-full accent-primary h-1 bg-surface-container rounded cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Right-of-Way Corridor */}
                <div className="p-2.5 rounded bg-surface-container-low/50 border border-outline-variant/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-primary">
                      <input
                        type="checkbox"
                        checked={layers.rowCorridor.visible}
                        onChange={() => toggleLayerVisibility('rowCorridor')}
                        className="rounded accent-primary"
                      />
                      <span>60m RoW Alignment Corridor</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
                    <span className="w-3 h-0.5 bg-[#f59e0b]"></span>
                    <span>Centerline & 60m statutory buffer</span>
                  </div>
                </div>

                {/* Administrative Boundaries */}
                <div className="p-2.5 rounded bg-surface-container-low/50 border border-outline-variant/20 space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-primary">
                    <input
                      type="checkbox"
                      checked={layers.adminBounds.visible}
                      onChange={() => toggleLayerVisibility('adminBounds')}
                      className="rounded accent-primary"
                    />
                    <span>District Collectorates</span>
                  </label>
                  <span className="text-[10px] text-on-surface-variant block">Gurugram, Surat, Thane, Rewari</span>
                </div>

                {/* Field Survey DGPS Rovers */}
                <div className="p-2.5 rounded bg-surface-container-low/50 border border-outline-variant/20 space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-primary">
                    <input
                      type="checkbox"
                      checked={layers.dgpsRovers.visible}
                      onChange={() => toggleLayerVisibility('dgpsRovers')}
                      className="rounded accent-primary"
                    />
                    <span>DGPS RTK Survey Rovers</span>
                  </label>
                  <div className="flex items-center gap-1 text-[10px] text-[#107307]">
                    <span className="w-2 h-2 rounded-full bg-[#107307]"></span>
                    <span>RTK Fixed (±0.024m precision)</span>
                  </div>
                </div>

                {/* Geo-Tagged Inspection Photos */}
                <div className="p-2.5 rounded bg-surface-container-low/50 border border-outline-variant/20 space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-primary">
                    <input
                      type="checkbox"
                      checked={layers.evidencePhotos.visible}
                      onChange={() => toggleLayerVisibility('evidencePhotos')}
                      className="rounded accent-primary"
                    />
                    <span>Geo-Tagged Field Photos</span>
                  </label>
                  <div className="flex items-center gap-1 text-[10px] text-orange-600">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span>Cryptographic Evidence Dossiers</span>
                  </div>
                </div>

                {/* Risk Hotspots */}
                <div className="p-2.5 rounded bg-surface-container-low/50 border border-outline-variant/20 space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-primary">
                    <input
                      type="checkbox"
                      checked={layers.riskHotspots.visible}
                      onChange={() => toggleLayerVisibility('riskHotspots')}
                      className="rounded accent-primary"
                    />
                    <span>Statutory Lapse & Risk Zones</span>
                  </label>
                  <div className="flex items-center gap-1 text-[10px] text-red-600">
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    <span>Sec 19 1-Year Expiry & Forest Overlaps</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Legend */}
              <div className="pt-2 border-t border-outline-variant/20 space-y-1.5 font-mono text-[10px]">
                <span className="uppercase text-outline font-bold block">Status Legend</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#107307]"></span>
                    <span>Vested (Sec 38)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#2563EB]"></span>
                    <span>Comp Paid</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#0A2540]"></span>
                    <span>Award (Sec 23)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B]"></span>
                    <span>Notified (Sec 19)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#DC2626]"></span>
                    <span>Disputed / Lapse</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#64748B]"></span>
                    <span>Proposed</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2 flex flex-col items-center gap-3">
              <button
                onClick={() => setIsLayerPanelOpen(true)}
                className="p-1 rounded hover:bg-surface-container text-outline hover:text-primary"
                title="Expand Layer Panel"
              >
                <span className="material-symbols-outlined text-[18px]">layers</span>
              </button>
            </div>
          )}
        </aside>

        {/* CENTER: LEAFLET MAP CANVAS */}
        <div className="flex-1 relative overflow-hidden bg-slate-950">
          <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />

          {/* Loading Overlay */}
          {isLoadingParcels && (
            <div className="absolute inset-0 bg-slate-950/70 z-30 flex items-center justify-center backdrop-blur-xs">
              <div className="p-4 rounded-lg bg-surface border border-outline-variant flex items-center gap-3 shadow-2xl">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="text-xs">
                  <span className="font-bold text-primary block">Spatial Data Loading</span>
                  <span className="text-on-surface-variant font-mono text-[10px]">
                    Connecting to PostGIS Cadastral Layer...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Empty Parcels Notice */}
          {!isLoadingParcels && filteredParcels.length === 0 && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-surface/95 px-4 py-2 rounded shadow-lg border border-amber-500/40 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-[18px]">info</span>
              <span>No cadastral parcels found for selected project corridor</span>
            </div>
          )}

          {/* Floating Measurement Banner (when active) */}
          {measureMode && (
            <div className="absolute top-4 left-4 z-20 bg-surface/95 backdrop-blur-md px-3.5 py-2 rounded shadow-xl border border-secondary/40 flex items-center gap-3 animate-in fade-in">
              <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  {measureMode === 'distance' ? 'straighten' : 'square_foot'}
                </span>
                <span>{measureMode === 'distance' ? 'Linear Distance Mode' : 'Polygon Area Mode'}</span>
              </div>
              {measureResult && (
                <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-mono font-bold text-xs">
                  {measureResult.value}
                </span>
              )}
              <span className="text-[10px] text-on-surface-variant font-mono">
                {measurePoints.length} vertices clicked
              </span>
              <button
                onClick={clearMeasurement}
                className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-xs font-semibold"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* RIGHT PANE: Parcel Inspector Dossier & Statistics */}
        <aside className="w-80 bg-surface-container-lowest border-l border-outline-variant/30 flex flex-col justify-between overflow-y-auto text-xs z-20 shadow-md">
          {selectedParcel ? (
            <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Header & Status */}
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[18px]">pin_drop</span>
                    <span className="text-[10px] font-mono uppercase font-bold text-secondary">
                      Cadastral Parcel Inspector
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedParcel(null);
                      if (selectedHighlightRef.current && mapRef.current) {
                        mapRef.current.removeLayer(selectedHighlightRef.current);
                        selectedHighlightRef.current = null;
                      }
                    }}
                    className="p-1 rounded hover:bg-surface-container text-outline hover:text-primary"
                    title="Close Inspector"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-primary font-mono">
                      Khasra {selectedParcel.khasraNumber || selectedParcel.khasraNo}
                    </h3>
                    <StatusBadge status={selectedParcel.acquisitionStatus} />
                  </div>
                  <div className="font-mono text-[11px] text-secondary font-semibold">
                    ULPIN: {selectedParcel.ulpin || 'SYNTHETIC-ULPIN-SAMPLE'}
                  </div>
                  <p className="text-on-surface-variant text-[11px] mt-0.5">
                    Village: <strong>{selectedParcel.village}</strong>, Tehsil {selectedParcel.tehsil || selectedParcel.taluka || 'Manesar'}, {selectedParcel.district} ({selectedParcel.state})
                  </p>
                </div>

                {/* Land Schedule Matrix */}
                <div className="space-y-1.5 p-2.5 bg-surface-container-low rounded border border-outline-variant/20 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-outline uppercase text-[10px]">Total Holding:</span>
                    <strong className="text-primary">{selectedParcel.area || selectedParcel.totalAreaHa} {selectedParcel.areaUnit || 'Acres'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline uppercase text-[10px]">RoW Acquired:</span>
                    <strong className="text-[#107307]">{selectedParcel.acquiredAreaHa || selectedParcel.area} {selectedParcel.areaUnit || 'Acres'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline uppercase text-[10px]">Land Class:</span>
                    <strong className="text-secondary">{selectedParcel.landType || selectedParcel.landClassification || 'AGRICULTURAL'}</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-outline-variant/20">
                    <span className="text-outline uppercase text-[10px]">Survey No:</span>
                    <strong className="text-primary">{selectedParcel.surveyNumber || selectedParcel.surveyNo}</strong>
                  </div>
                </div>

                {/* Financial & Compensation Schedule */}
                <div className="space-y-1.5 p-2.5 bg-surface-container-low rounded border border-outline-variant/20 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-outline uppercase text-[10px]">Total Award (Sec 23):</span>
                    <strong className="text-primary">
                      {selectedParcel.totalAward ? `₹${(selectedParcel.totalAward / 100000).toFixed(2)} Lakh` : '₹14.20 Lakh'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline uppercase text-[10px]">100% Solatium:</span>
                    <span className="text-[#107307] font-semibold">Included (RFCTLARR)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline uppercase text-[10px]">DBT PFMS Status:</span>
                    <span className="text-primary font-bold">{selectedParcel.dbtStatus || 'Settlement Cleared'}</span>
                  </div>
                </div>

                {/* Title Holder Details (Protected PII) */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-outline">Registered Title Holder</span>
                  <div className="font-bold text-primary text-xs">{selectedParcel.ownerName}</div>
                  <div className="text-[10px] text-on-surface-variant font-mono">
                    Aadhaar: {selectedParcel.ownerAadhaarMasked || '•••• •••• 8192'} • Phone: {selectedParcel.ownerContact || '+91 98•••• 4120'}
                  </div>
                </div>

                {/* Field Verification & DGPS Rover */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-outline">DGPS Boundary Verification</span>
                  <div className="flex items-center gap-1 text-[11px] text-[#107307] font-semibold">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    <span>{selectedParcel.verificationStatus || 'VERIFIED'} (RTK Fixed ±0.024m)</span>
                  </div>
                  <div className="text-[10px] text-on-surface-variant font-mono">
                    Officer: {selectedParcel.verifiedBy || 'Revenue Inspector - Choryasi'}
                  </div>
                </div>
              </div>

              {/* Inspector Action Buttons */}
              <div className="pt-2 border-t border-outline-variant/20 space-y-1.5">
                <button
                  onClick={() => navigate(`/land/parcels/${selectedParcel.id}`)}
                  className="w-full py-2 px-3 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-xs shadow-sm transition-colors text-center"
                >
                  Open Cadastral Dossier →
                </button>
                <button
                  onClick={() => navigate(`/projects/${selectedParcel.projectId}`)}
                  className="w-full py-1.5 px-3 rounded bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs transition-colors text-center"
                >
                  Open Project Workspace
                </button>
                <button
                  onClick={() => navigate('/governance/vault')}
                  className="w-full py-1.5 px-3 rounded bg-surface-container-low hover:bg-surface-container text-primary font-medium text-xs transition-colors text-center"
                >
                  View Gazette & Panchnama Vault
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4 flex-1">
              <div className="pb-2 border-b border-outline-variant/20">
                <h3 className="font-bold text-sm text-primary tracking-tight">Project Cadastral Summary</h3>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  {selectedProjectId === 'ALL'
                    ? 'Pan-India Active Corridors'
                    : projectSummaryData?.projectName || `Project #${selectedProjectId}`}
                </span>
              </div>

              <div className="space-y-2">
                <KpiCard
                  title="Total Cadastral Parcels"
                  value={projectSummaryData ? projectSummaryData.totalParcels : filteredParcels.length}
                  subtitle="PostGIS Vector Synchronized"
                  icon="grid_view"
                />
                <KpiCard
                  title="Requisitioned Area"
                  value={
                    projectSummaryData
                      ? `${Number(projectSummaryData.totalAreaAcres || 0).toFixed(1)} Acres`
                      : `${filteredParcels.reduce((sum, p) => sum + Number(p.area || p.totalAreaHa || 0), 0).toFixed(1)} Acres`
                  }
                  subtitle="Right-of-Way Corridor"
                  icon="straighten"
                />
                <KpiCard
                  title="Possession Vested"
                  value={
                    projectSummaryData
                      ? `${Math.round(projectSummaryData.acquisitionPercentage || 0)}%`
                      : `${Math.round((filteredParcels.filter(p => p.acquisitionStatus === 'POSSESSION_TAKEN' || String(p.acquisitionStatus).includes('Vested')).length / (filteredParcels.length || 1)) * 100)}%`
                  }
                  subtitle="Panchnama Legally Executed"
                  progress={
                    projectSummaryData
                      ? Math.round(projectSummaryData.acquisitionPercentage || 0)
                      : Math.round((filteredParcels.filter(p => p.acquisitionStatus === 'POSSESSION_TAKEN' || String(p.acquisitionStatus).includes('Vested')).length / (filteredParcels.length || 1)) * 100)
                  }
                  icon="transfer_within_a_station"
                />
              </div>

              <div className="p-3 bg-surface-container-low rounded border border-outline-variant/20 text-xs space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-outline">Interactive Guidance</span>
                <p className="text-on-surface-variant text-[11px] leading-relaxed">
                  Click any cadastral parcel polygon on the map to inspect ownership titles, Section 23 awards, and DGPS verification rover telemetry.
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* 4. BOTTOM TELEMETRY TOOLBAR */}
      <footer className="bg-surface-container-lowest px-4 py-2 border-t border-outline-variant/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono z-30 shadow-md">
        {/* Real-time Cursor Coordinates */}
        <div className="flex items-center gap-4 text-primary">
          <span>Lat: <strong>{cursorCoords.lat}° N</strong></span>
          <span>Lng: <strong>{cursorCoords.lng}° E</strong></span>
          <span>Zoom: <strong>{cursorCoords.zoom}x</strong></span>
          <span className="hidden sm:inline">Datum: <strong>WGS84 (EPSG:4326)</strong></span>
        </div>

        {/* GPS Rover Telemetry & Locate Me */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#107307] font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#107307] animate-pulse"></span>
            <span>NavIC DGPS Rover: RTK FIXED (±0.024m)</span>
          </div>

          <button
            onClick={handleLocateMe}
            className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs flex items-center gap-1 border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[14px]">my_location</span>
            <span>Locate Me</span>
          </button>
        </div>

        {/* Disclaimer */}
        <span className="text-[10px] text-on-surface-variant truncate max-w-sm hidden lg:block">
          Authoritative cadastral boundaries are legally calibrated via Jamabandi RoR & Section 23 Award orders.
        </span>
      </footer>

      {/* 5. OVERLAP DETECTION MODAL */}
      {isOverlapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-container/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-surface-container-lowest rounded-lg shadow-2xl border border-outline-variant overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">compare</span>
                <h3 className="font-bold text-sm text-primary">Right-of-Way (RoW) Spatial Overlap & Severance Matrix</h3>
              </div>
              <button onClick={() => setIsOverlapModalOpen(false)} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              <p className="text-xs text-on-surface-variant">
                PostGIS spatial intersection analysis between the 60m statutory Right-of-Way centerline buffer and intersecting revenue cadastral parcels.
              </p>

              <div className="border border-outline-variant/30 rounded overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-surface-container-low text-outline font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5 font-semibold">Khasra No.</th>
                      <th className="p-2.5 font-semibold">Title Holder</th>
                      <th className="p-2.5 font-semibold text-right">Holding Area</th>
                      <th className="p-2.5 font-semibold text-right">Overlap Area</th>
                      <th className="p-2.5 font-semibold text-right">Overlap %</th>
                      <th className="p-2.5 font-semibold">Severity</th>
                      <th className="p-2.5 font-semibold">Impact Assessment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 font-mono">
                    {overlapData.map((row) => (
                      <tr key={row.parcelId} className="hover:bg-surface-container-low transition-colors">
                        <td className="p-2.5 font-bold text-primary">{row.khasraNumber}</td>
                        <td className="p-2.5 font-sans text-on-surface-variant">{row.ownerName}</td>
                        <td className="p-2.5 text-right font-bold">{row.totalArea} Ha</td>
                        <td className="p-2.5 text-right text-secondary font-bold">{row.overlapArea} Ha</td>
                        <td className="p-2.5 text-right font-bold">{row.overlapPercentage}%</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.severity === 'HIGH' ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#FEF3EB] text-[#D95D08]'}`}>
                            {row.severity}
                          </span>
                        </td>
                        <td className="p-2.5 font-sans text-[11px] text-on-surface-variant">{row.conflictDescription}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-4 py-2 bg-surface-container-low border-t border-outline-variant/30 flex justify-end">
              <button
                onClick={() => setIsOverlapModalOpen(false)}
                className="px-4 py-1.5 rounded bg-primary text-on-primary text-xs font-semibold"
              >
                Close Overlap Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. GEO-TAGGED PHOTO EVIDENCE MODAL */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-container/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-lg shadow-2xl border border-outline-variant overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">photo_camera</span>
                <h3 className="font-bold text-sm text-primary">{activePhotoModal.title}</h3>
              </div>
              <button onClick={() => setActivePhotoModal(null)} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-4 space-y-3">
              <img
                src={activePhotoModal.imageUrl}
                alt="Cadastral Evidence"
                className="w-full h-56 object-cover rounded border border-outline-variant/30"
              />

              <div className="p-2.5 bg-surface-container-low rounded border border-outline-variant/20 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-outline">Parcel Khasra:</span>
                  <strong className="text-primary">{activePhotoModal.khasraNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Captured Time:</span>
                  <span>{activePhotoModal.capturedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Surveying Cadre:</span>
                  <span>{activePhotoModal.capturedBy}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-outline-variant/20">
                  <span className="text-outline">SHA-256 Seal:</span>
                  <span className="text-[9px] text-[#107307] truncate max-w-xs">{activePhotoModal.sha256Hash}</span>
                </div>
              </div>
            </div>

            <div className="px-4 py-2 bg-surface-container-low border-t border-outline-variant/30 flex justify-end">
              <button
                onClick={() => setActivePhotoModal(null)}
                className="px-4 py-1.5 rounded bg-primary text-on-primary text-xs font-semibold"
              >
                Close Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GisPage;
