/**
 * MapProvider Abstraction for BhoomiTrack National Cadastral GIS
 * Provides resilient, CORS-compliant basemap raster/vector tile configurations,
 * environment variable overrides, and provider health detection.
 */

// Configurable environment variable overrides
const ENV_TILE_URL = import.meta.env.VITE_MAP_TILE_URL;
const ENV_BASEMAP_DEFAULT = import.meta.env.VITE_GIS_BASEMAP || 'satellite';

export const BASEMAP_PROVIDERS = {
  satellite: {
    id: 'satellite',
    name: 'ISRO Bhuvan / High-Res Satellite',
    category: 'SATELLITE',
    attribution: 'Esri, Maxar, Earthstar Geographics, ISRO Bhuvan',
    maxZoom: 19,
    minZoom: 0,
    tiles: [
      ENV_TILE_URL || 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    ]
  },
  streets: {
    id: 'streets',
    name: 'Carto Positron / Urban Cadastre',
    category: 'STREETS',
    attribution: 'CartoDB, OpenStreetMap contributors',
    maxZoom: 19,
    minZoom: 0,
    tiles: [
      'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
    ]
  },
  voyager: {
    id: 'voyager',
    name: 'Carto Voyager / Infrastructure',
    category: 'STREETS',
    attribution: 'CartoDB, OpenStreetMap contributors',
    maxZoom: 19,
    minZoom: 0,
    tiles: [
      'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
      'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
    ]
  },
  terrain: {
    id: 'terrain',
    name: 'OpenTopo / Elevation Contours',
    category: 'TERRAIN',
    attribution: 'OpenTopoMap, SRTM Elevation',
    maxZoom: 17,
    minZoom: 0,
    tiles: [
      'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
      'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
      'https://c.tile.opentopomap.org/{z}/{x}/{y}.png'
    ]
  }
};

/**
 * Builds a MapLibre GL style specification for the given basemap provider
 */
export function getMapLibreStyle(providerKey = ENV_BASEMAP_DEFAULT) {
  const provider = BASEMAP_PROVIDERS[providerKey] || BASEMAP_PROVIDERS.satellite;

  return {
    version: 8,
    name: provider.name,
    sources: {
      'base-tiles': {
        type: 'raster',
        tiles: provider.tiles,
        tileSize: 256,
        attribution: `&copy; ${provider.attribution}`
      }
    },
    layers: [
      {
        id: 'base-tiles-layer',
        type: 'raster',
        source: 'base-tiles',
        minzoom: provider.minZoom,
        maxzoom: provider.maxZoom,
        paint: {
          'raster-opacity': 1.0,
          'raster-fade-duration': 200
        }
      }
    ]
  };
}

/**
 * Builds a Leaflet TileLayer for the given basemap provider
 */
export function createLeafletTileLayer(L, providerKey = ENV_BASEMAP_DEFAULT) {
  const provider = BASEMAP_PROVIDERS[providerKey] || BASEMAP_PROVIDERS.satellite;
  let url = provider.tiles[0];
  let subdomains = ['a', 'b', 'c'];

  if (providerKey === 'streets') {
    url = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    subdomains = ['a', 'b', 'c', 'd'];
  } else if (providerKey === 'voyager') {
    url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    subdomains = ['a', 'b', 'c', 'd'];
  } else if (providerKey === 'terrain') {
    url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    subdomains = ['a', 'b', 'c'];
  } else {
    // satellite
    url = ENV_TILE_URL || 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    subdomains = [];
  }

  return L.tileLayer(url, {
    attribution: `&copy; ${provider.attribution}`,
    maxZoom: provider.maxZoom || 19,
    minZoom: provider.minZoom || 0,
    subdomains: subdomains
  });
}

/**
 * Validates whether the basemap tile endpoint is accessible
 */
export async function checkBasemapHealth(providerKey = 'streets') {
  const provider = BASEMAP_PROVIDERS[providerKey] || BASEMAP_PROVIDERS.streets;
  const testUrl = provider.tiles[0].replace('{z}', '0').replace('{x}', '0').replace('{y}', '0');

  try {
    const res = await fetch(testUrl, { method: 'HEAD', mode: 'no-cors' });
    return {
      status: 'HEALTHY',
      provider: provider.name,
      url: testUrl
    };
  } catch (err) {
    return {
      status: 'DEGRADED',
      provider: provider.name,
      error: err.message
    };
  }
}

export default {
  BASEMAP_PROVIDERS,
  getMapLibreStyle,
  createLeafletTileLayer,
  checkBasemapHealth,
  defaultProvider: ENV_BASEMAP_DEFAULT
};

