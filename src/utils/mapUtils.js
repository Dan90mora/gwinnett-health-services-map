import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Icon, Text, Fill, Stroke } from 'ol/style';

/**
 * Extrae coordenadas de una URL de Google Maps o genera coordenadas aproximadas
 * @param {string} googleMapsUrl - URL de Google Maps o dirección
 * @returns {[number, number]|null} - [longitude, latitude] o null si no se puede extraer
 */
export const extractCoordinatesFromGoogleMaps = (googleMapsUrl) => {
  if (!googleMapsUrl || typeof googleMapsUrl !== 'string') {
    return null;
  }

  // Si ya es una URL de Google Maps, intentar extraer coordenadas
  if (googleMapsUrl.includes('google.com') || googleMapsUrl.includes('maps.')) {
    // Patrones para diferentes formatos de URLs de Google Maps
    const patterns = [
      // Formato: @lat,lng,zoom
      /@(-?\d+\.?\d*),(-?\d+\.?\d*),/,
      // Formato: ll=lat,lng
      /ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      // Formato: !3d lat !4d lng
      /!3d(-?\d+\.?\d*).*!4d(-?\d+\.?\d*)/,
      // Formato: lugar con coordenadas
      /place\/.*@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      // Formato query con coordenadas
      /query=(-?\d+\.?\d*),(-?\d+\.?\d*)/
    ];

    for (const pattern of patterns) {
      const match = googleMapsUrl.match(pattern);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        
        // Validar que las coordenadas sean válidas
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return [lng, lat]; // OpenLayers usa [lng, lat]
        }
      }
    }
  }

  // Si no se encontraron coordenadas en la URL, generar coordenadas aproximadas por ciudad
  return generateApproximateCoordinates(googleMapsUrl);
};

/**
 * Genera coordenadas aproximadas basadas en la dirección o ciudad
 */
const generateApproximateCoordinates = (address) => {
  if (!address) return null;
  
  const addressLower = address.toLowerCase();
  
  // Coordenadas de referencia para ciudades de Gwinnett County
  const cityCoordinates = {
    'lawrenceville': [-84.0016, 33.9562],
    'duluth': [-84.1447, 34.0028],
    'suwanee': [-84.0713, 34.0518],
    'dacula': [-83.9079, 34.0042],
    'norcross': [-84.2135, 33.9412],
    'tucker': [-84.2197, 33.8515],
    'atlanta': [-84.3880, 33.7490],
    'buford': [-84.0052, 34.1206],
    'sugar hill': [-84.0377, 34.1173]
  };
  
  // Buscar la ciudad en la dirección
  for (const [city, coords] of Object.entries(cityCoordinates)) {
    if (addressLower.includes(city)) {
      // Agregar una pequeña variación aleatoria para evitar que todos los marcadores se superpongan
      const offset = 0.005; // Aproximadamente 500 metros
      const randomLng = coords[0] + (Math.random() - 0.5) * offset;
      const randomLat = coords[1] + (Math.random() - 0.5) * offset;
      
      return [randomLng, randomLat];
    }
  }
  
  // Si no se encuentra la ciudad, usar coordenadas del centro de Gwinnett County
  return [-84.0719, 33.9526];
};

/**
 * Crea un Feature (marcador) para OpenLayers
 * @param {Object} location - Objeto con información de la ubicación
 * @param {[number, number]} coordinates - [longitude, latitude]
 * @returns {Feature} - Feature de OpenLayers
 */
export const createLocationFeature = (location, coordinates) => {
  const feature = new Feature({
    geometry: new Point(fromLonLat(coordinates)),
    ...location // Agregar todas las propiedades de la ubicación
  });

  return feature;
};

/**
 * Crea el estilo para los marcadores
 * @param {string} color - Color del marcador (opcional)
 * @returns {Style} - Estilo de OpenLayers
 */
export const createMarkerStyle = (color = '#FF4444') => {
  return new Style({
    image: new Icon({
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg width="29" height="29" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}"/>
          <circle cx="12" cy="9" r="2.5" fill="white"/>
        </svg>
      `)}`
    }),
    text: new Text({
      offsetY: -38,
      fill: new Fill({ color: '#000' }),
      stroke: new Stroke({ color: '#fff', width: 2 }),
      font: '12px Arial, sans-serif'
    })
  });
};

/**
 * Ajusta la vista del mapa para mostrar todas las ubicaciones
 * @param {Map} map - Instancia del mapa de OpenLayers
 * @param {VectorSource} vectorSource - Fuente vectorial con los features
 */
export const fitMapToFeatures = (map, vectorSource) => {
  if (!map || !vectorSource) return;

  const view = map.getView();
  const extent = vectorSource.getExtent();
  
  if (extent && extent.every(coord => isFinite(coord))) {
    view.fit(extent, {
      padding: [50, 50, 50, 50],
      maxZoom: 15
    });
  }
};

/**
 * Valida los datos de una ubicación
 * @param {Object} location - Objeto de ubicación
 * @returns {boolean} - true si es válida
 */
export const validateLocation = (location) => {
  return location && 
         typeof location === 'object' && 
         (location.googleMapsUrl || (location.latitude && location.longitude));
};
