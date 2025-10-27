import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { defaults as defaultControls, FullScreen, ScaleLine } from 'ol/control';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import Overlay from 'ol/Overlay';
import { extractCoordinatesFromGoogleMaps, createMarkerStyle } from '../utils/mapUtils';
import { debounce } from '../utils/debounce';
import 'ol/ol.css';

const MapComponent = ({ locations = [], selectedLocationId, onLocationSelect, isLoading = false }) => {
  const mapRef = useRef();
  const mapInstanceRef = useRef();
  const vectorLayerRef = useRef();
  const popupRef = useRef();
  const popupOverlayRef = useRef();
  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);

  // Función auxiliar para obtener coordenadas aproximadas por ciudad
  const geocodeAddress = useCallback((address, city) => {
    // Coordenadas aproximadas de ciudades de Gwinnett County
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
    
    // Buscar coordenadas por ciudad
    for (const [cityName, coords] of Object.entries(cityCoordinates)) {
      if (city && city.toLowerCase().includes(cityName.toLowerCase())) {
        return coords;
      }
      if (address && address.toLowerCase().includes(cityName.toLowerCase())) {
        return coords;
      }
    }
    
    // Por defecto, centro de Gwinnett County
    return [-84.0719, 33.9526];
  }, []);

  // Optimización: Memoizar los estilos de marcadores
  const markerStyles = useMemo(() => {
    const colors = {
      medical: '#EF4444',
      dental: '#3B82F6',
      vision: '#8B5CF6',
      mental_health: '#10B981',
      pharmacy: '#F59E0B',
      other: '#6B7280'
    };
    
    return Object.entries(colors).reduce((acc, [type, color]) => {
      acc[type] = createMarkerStyle(color);
      return acc;
    }, {});
  }, []);

  // Optimización: Procesar coordenadas en lotes para mejor performance
  const processLocationCoordinates = useCallback(async (locations) => {
    setMapLoading(true);
    const processed = [];
    const batchSize = 50; // Procesar en lotes de 50
    
    for (let i = 0; i < locations.length; i += batchSize) {
      const batch = locations.slice(i, i + batchSize);
      
      // Procesar lote actual
      const batchProcessed = batch.map((location) => {
        let coordinates = null;
        
        if (location.googleMapsUrl) {
          coordinates = extractCoordinatesFromGoogleMaps(location.googleMapsUrl);
        }
        
        if (!coordinates && location.address) {
          coordinates = geocodeAddress(location.address, location.city);
        }
        
        return coordinates ? { ...location, coordinates } : null;
      }).filter(Boolean);
      
      processed.push(...batchProcessed);
      
      // Pequeña pausa para no bloquear la UI
      if (i + batchSize < locations.length) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
    
    setMapLoading(false);
    return processed;
  }, [geocodeAddress]);

  // Optimización: Debounce para actualizaciones de marcadores
  const updateMarkersDebounced = useCallback(
    debounce(async (locations) => {
      if (!isMapReady || !vectorLayerRef.current || locations.length === 0) return;
      
      const vectorSource = vectorLayerRef.current.getSource();
      vectorSource.clear();
      
      console.log(`Procesando ${locations.length} ubicaciones para el mapa...`);
      
      const processedLocations = await processLocationCoordinates(locations);
      const features = [];
      
      processedLocations.forEach((location) => {
        if (location.coordinates) {
          const feature = new Feature({
            geometry: new Point(fromLonLat(location.coordinates)),
            locationData: location
          });
          
          const serviceType = location.serviceType || 'other';
          feature.setStyle(markerStyles[serviceType] || markerStyles.other);
          
          features.push(feature);
        }
      });
      
      vectorSource.addFeatures(features);
      
      console.log(`Agregados ${features.length} marcadores de ${locations.length} ubicaciones`);
      
      // Ajustar vista si hay marcadores
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
    }, 300),
    [isMapReady, markerStyles, processLocationCoordinates]
  );

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
          source: vectorSource,
          style: null // Se definirá más adelante
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

        // Configurar el mapa con controles avanzados
        const map = new Map({
          target: mapRef.current,
          layers: [
            // Capa base de OpenStreetMap
            new TileLayer({
              source: new OSM({
                attributions: '© OpenStreetMap contributors'
              })
            }),
            // Capa vectorial para marcadores
            vectorLayer
          ],
          view: new View({
            center: fromLonLat([-84.3880, 33.7490]), // Atlanta, Georgia en coordenadas correctas
            zoom: 11,
            minZoom: 3,
            maxZoom: 19
          }),
          controls: defaultControls().extend([
            new FullScreen(),
            new ScaleLine({
              units: 'metric'
            })
          ]),
          overlays: [popupOverlay]
        });

        // Agregar evento de clic para mostrar popups
        map.on('click', (event) => {
          const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
          
          if (feature) {
            const locationData = feature.get('locationData');
            if (locationData) {
              setSelectedLocation(locationData);
              popupOverlay.setPosition(event.coordinate);
              
              // Notificar al componente padre sobre la selección
              if (onLocationSelect) {
                onLocationSelect(locationData.id);
              }
            }
          } else {
            // Cerrar popup si se hace clic fuera de un marcador
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

    // Cleanup al desmontar el componente
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(null);
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Efecto para actualizar marcadores cuando cambien las ubicaciones
  useEffect(() => {
    if (locations.length > 0 && isMapReady) {
      updateMarkersDebounced(locations);
    }
  }, [locations, isMapReady, updateMarkersDebounced]);

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

  // Función para centrar el mapa en Gwinnett County
  const centerMapOnGwinnett = useCallback(() => {
    if (mapInstanceRef.current) {
      const view = mapInstanceRef.current.getView();
      view.animate({
        center: fromLonLat([-84.3880, 33.7490]), // Atlanta, Georgia
        zoom: 11,
        duration: 500
      });
    }
  }, []);

  return (
    <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden shadow-lg border border-gray-200 animate-fade-in" style={{ height: '500px' }}>
      {/* Contenedor del mapa */}
      <div
        ref={mapRef}
        className="absolute inset-0"
        style={{ height: '100%', width: '100%' }}
      />

      {/* Popup para mostrar información de ubicación */}
      <div
        ref={popupRef}
        className={`bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm z-20 transition-all duration-200 ${
          selectedLocation ? 'block animate-slide-in' : 'hidden'
        }`}
      >
        {selectedLocation && (
          <div>
            <button
              onClick={() => {
                setSelectedLocation(null);
                popupOverlayRef.current.setPosition(undefined);
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar popup"
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
                <span className="font-semibold">Teléfono:</span> 
                <a href={`tel:${selectedLocation.phone}`} className="text-blue-600 hover:text-blue-800 ml-1">
                  {selectedLocation.phone}
                </a>
              </p>
            )}
            {selectedLocation.serviceType && (
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Tipo:</span> {selectedLocation.serviceType}
              </p>
            )}
            {selectedLocation.paymentMethods && (
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Métodos de pago:</span> {selectedLocation.paymentMethods}
              </p>
            )}
            {selectedLocation.languages && (
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Idiomas:</span> {selectedLocation.languages}
              </p>
            )}
            {selectedLocation.googleMapsUrl && (
              <a
                href={selectedLocation.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ver en Google Maps →
              </a>
            )}
          </div>
        )}
      </div>

      {/* Controles del mapa */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={centerMapOnGwinnett}
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 hover:bg-gray-50 transition-colors"
          title="Centrar en Gwinnett County"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Indicador de carga */}
      {(isLoading || mapLoading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 rounded-lg z-15">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">
              {mapLoading ? 'Procesando ubicaciones...' : 'Cargando mapa...'}
            </p>
          </div>
        </div>
      )}

      {/* Información del mapa */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full transition-colors ${
            isLoading || mapLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
          }`}></div>
          <span>OpenStreetMap</span>
          {locations.length > 0 && (
            <>
              <span>•</span>
              <span>{locations.length} ubicaciones</span>
            </>
          )}
          {(isLoading || mapLoading) && (
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

export default MapComponent;
