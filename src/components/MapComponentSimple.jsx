import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { defaults as defaultControls } from 'ol/control';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Icon } from 'ol/style';
import Overlay from 'ol/Overlay';
import { extractCoordinatesFromGoogleMaps, createMarkerStyle } from '../utils/mapUtils';
import 'ol/ol.css';

const MapComponentSimple = ({ locations = [], selectedLocationId, onLocationSelect, isLoading = false }) => {
  const mapRef = useRef();
  const mapInstanceRef = useRef();
  const vectorLayerRef = useRef();
  const popupRef = useRef();
  const popupOverlayRef = useRef();
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Función auxiliar para obtener coordenadas aproximadas por ciudad
  const geocodeAddress = useCallback((address, city) => {
    const cityCoordinates = {
      'Lawrenceville': [-84.0016, 33.9562],
      'Duluth': [-84.1447, 34.0028],
      'Suwanee': [-84.0713, 34.0518],
      'Dacula': [-83.9079, 34.0042],
      'Norcross': [-84.2135, 33.9412],
      'Tucker': [-84.2197, 33.8515],
      'Atlanta': [-84.3880, 33.7490],
      'Buford': [-84.0052, 34.1206]
    };
    
    for (const [cityName, coords] of Object.entries(cityCoordinates)) {
      if (city && city.toLowerCase().includes(cityName.toLowerCase())) {
        return coords;
      }
      if (address && address.toLowerCase().includes(cityName.toLowerCase())) {
        return coords;
      }
    }
    
    return [-84.0719, 33.9526]; // Centro de Gwinnett County por defecto
  }, []);

  // Función para obtener color por tipo de servicio
  const getServiceTypeColor = useCallback((serviceType) => {
    const colors = {
      medical: '#EF4444',
      dental: '#3B82F6',
      vision: '#8B5CF6',
      mental_health: '#10B981',
      pharmacy: '#F59E0B',
      other: '#6B7280'
    };
    
    return colors[serviceType] || colors.other;
  }, []);

  // Inicializar el mapa
  useEffect(() => {
    const initializeMap = async () => {
      try {
        if (!mapRef.current) {
          console.warn('MapComponent: Contenedor no disponible');
          return;
        }

        console.log('MapComponent: Inicializando mapa...');

        // Crear fuente de datos vectoriales para los marcadores
        const vectorSource = new VectorSource();
        
        // Crear capa vectorial para los marcadores
        const vectorLayer = new VectorLayer({
          source: vectorSource
        });
        
        vectorLayerRef.current = vectorLayer;

        // Crear popup overlay
        const popupOverlay = new Overlay({
          element: popupRef.current,
          positioning: 'bottom-center',
          stopEvent: false,
          offset: [0, -10]
        });
        
        popupOverlayRef.current = popupOverlay;

        // Configurar el mapa
        const map = new Map({
          target: mapRef.current,
          layers: [
            new TileLayer({
              source: new OSM({
                attributions: '© OpenStreetMap contributors'
              })
            }),
            vectorLayer
          ],
          view: new View({
            center: fromLonLat([-84.3880, 33.7490]), // Atlanta, Georgia
            zoom: 11,
            minZoom: 3,
            maxZoom: 19
          }),
          controls: defaultControls(),
          overlays: [popupOverlay]
        });

        // Evento de clic para mostrar popups
        map.on('click', (event) => {
          const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
          
          if (feature) {
            const locationData = feature.get('locationData');
            if (locationData) {
              setSelectedLocation(locationData);
              popupOverlay.setPosition(event.coordinate);
              
              if (onLocationSelect) {
                onLocationSelect(locationData.id);
              }
            }
          } else {
            setSelectedLocation(null);
            popupOverlay.setPosition(undefined);
          }
        });

        // Cambiar cursor al pasar sobre marcadores
        map.on('pointermove', (event) => {
          const pixel = map.getEventPixel(event.originalEvent);
          const hit = map.hasFeatureAtPixel(pixel);
          map.getTarget().style.cursor = hit ? 'pointer' : '';
        });

        mapInstanceRef.current = map;
        setIsMapReady(true);
        console.log('MapComponent: Mapa inicializado exitosamente');

      } catch (error) {
        console.error('MapComponent: Error al inicializar mapa:', error);
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(null);
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Efecto para actualizar marcadores cuando cambien las ubicaciones
  useEffect(() => {
    if (isMapReady && vectorLayerRef.current && locations.length > 0) {
      const vectorSource = vectorLayerRef.current.getSource();
      vectorSource.clear();
      
      console.log(`Procesando ${locations.length} ubicaciones para el mapa...`);
      
      const features = [];
      let coordinatesFound = 0;
      
      locations.forEach((location) => {
        let coordinates = null;
        
        // Intentar obtener coordenadas de la URL de Google Maps
        if (location.googleMapsUrl) {
          coordinates = extractCoordinatesFromGoogleMaps(location.googleMapsUrl);
        }
        
        // Si no se pudieron extraer coordenadas, usar geocodificación simple
        if (!coordinates && location.address) {
          coordinates = geocodeAddress(location.address, location.city);
        }
        
        if (coordinates) {
          coordinatesFound++;
          
          const feature = new Feature({
            geometry: new Point(fromLonLat(coordinates)),
            locationData: location
          });
          
          const markerColor = getServiceTypeColor(location.serviceType);
          feature.setStyle(createMarkerStyle(markerColor));
          
          features.push(feature);
        }
      });
      
      vectorSource.addFeatures(features);
      
      console.log(`Agregados ${coordinatesFound} marcadores de ${locations.length} ubicaciones`);
      
      // Ajustar vista para mostrar todos los marcadores
      if (features.length > 0) {
        const extent = vectorSource.getExtent();
        const view = mapInstanceRef.current.getView();
        
        setTimeout(() => {
          view.fit(extent, {
            padding: [50, 50, 50, 50],
            maxZoom: 15,
            duration: 800
          });
        }, 100);
      }
    }
  }, [locations, isMapReady, geocodeAddress, getServiceTypeColor]);

  // Efecto para manejar selección de ubicación
  useEffect(() => {
    if (selectedLocationId && mapInstanceRef.current && vectorLayerRef.current) {
      const vectorSource = vectorLayerRef.current.getSource();
      const features = vectorSource.getFeatures();
      
      const selectedFeature = features.find(feature => {
        const locationData = feature.get('locationData');
        return locationData && locationData.id === selectedLocationId;
      });
      
      if (selectedFeature) {
        const coordinates = selectedFeature.getGeometry().getCoordinates();
        const view = mapInstanceRef.current.getView();
        
        view.animate({
          center: coordinates,
          zoom: 16,
          duration: 500
        });
        
        const locationData = selectedFeature.get('locationData');
        setSelectedLocation(locationData);
        popupOverlayRef.current.setPosition(coordinates);
      }
    }
  }, [selectedLocationId]);

  return (
    <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden shadow-lg border border-gray-200">
      {/* Contenedor del mapa */}
      <div
        ref={mapRef}
        className="absolute inset-0"
        style={{ height: '100%', width: '100%' }}
      />

      {/* Popup para mostrar información de ubicación */}
      <div
        ref={popupRef}
        className={`bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm z-10 ${
          selectedLocation ? 'block' : 'hidden'
        }`}
      >
        {selectedLocation && (
          <div>
            <button
              onClick={() => {
                setSelectedLocation(null);
                popupOverlayRef.current.setPosition(undefined);
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-2 text-gray-800 pr-6">
              {selectedLocation.name || 'Ubicación'}
            </h3>
            {selectedLocation.address && (
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Dirección:</span> {selectedLocation.address}
              </p>
            )}
            {selectedLocation.city && (
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Ciudad:</span> {selectedLocation.city}
              </p>
            )}
            {selectedLocation.phone && (
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Teléfono:</span> {selectedLocation.phone}
              </p>
            )}
            {selectedLocation.serviceType && (
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Tipo:</span> {selectedLocation.serviceType}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Indicador de carga */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando mapa...</p>
          </div>
        </div>
      )}

      {/* Información del mapa */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
          <span>OpenStreetMap</span>
          {locations.length > 0 && (
            <>
              <span>•</span>
              <span>{locations.length} ubicaciones</span>
            </>
          )}
          {isLoading && (
            <>
              <span>•</span>
              <span>Cargando...</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapComponentSimple;
