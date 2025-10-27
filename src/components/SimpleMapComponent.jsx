import { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import 'ol/ol.css';

const SimpleMapComponent = ({ locations = [] }) => {
  const mapRef = useRef();
  const mapInstanceRef = useRef();
  const [isMapReady, setIsMapReady] = useState(false);
  const [error, setError] = useState(null);

  // Inicializar mapa básico
  useEffect(() => {
    try {
      console.log('Iniciando creación del mapa simple...');
      
      if (!mapRef.current) {
        console.error('mapRef.current no está disponible');
        setError('Contenedor del mapa no disponible');
        return;
      }

      console.log('Contenedor del mapa disponible:', mapRef.current);

      // Crear capa vectorial para marcadores
      const vectorSource = new VectorSource();
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({ color: '#ff0000' }),
            stroke: new Stroke({ color: '#ffffff', width: 2 })
          })
        })
      });

      console.log('Capa vectorial creada');

      // Crear mapa
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          vectorLayer
        ],
        view: new View({
          center: fromLonLat([-84.3880, 33.7490]), // Atlanta, Georgia
          zoom: 11
        })
      });

      console.log('Mapa creado exitosamente');

      mapInstanceRef.current = map;
      setIsMapReady(true);

      // Agregar algunos marcadores de prueba
      const testFeatures = [
        new Feature({
          geometry: new Point(fromLonLat([-84.3880, 33.7490])) // Atlanta
        }),
        new Feature({
          geometry: new Point(fromLonLat([-84.2700, 33.8480])) // Decatur
        }),
        new Feature({
          geometry: new Point(fromLonLat([-84.1500, 33.9000])) // Lawrenceville
        })
      ];

      vectorSource.addFeatures(testFeatures);
      console.log('Marcadores de prueba agregados:', testFeatures.length);

      // Cleanup
      return () => {
        console.log('Limpiando mapa simple...');
        if (map) {
          map.setTarget(null);
        }
      };
    } catch (err) {
      console.error('Error al crear el mapa:', err);
      setError(err.message);
    }
  }, []);

  return (
    <div className="w-full">
      <div 
        ref={mapRef} 
        className="w-full border border-gray-300 rounded-lg"
        style={{ 
          height: '400px',
          minHeight: '400px',
          backgroundColor: '#f0f0f0'
        }}
      />
      <div className="mt-2 text-sm text-gray-600">
        {error ? (
          <span className="text-red-600">❌ Error: {error}</span>
        ) : isMapReady ? (
          <span className="text-green-600">✅ Mapa cargado exitosamente</span>
        ) : (
          <span className="text-orange-600">⏳ Cargando mapa...</span>
        )}
      </div>
      
      {/* Información de debug */}
      <div className="mt-2 text-xs text-gray-500">
        <div>OpenLayers disponible: {typeof Map !== 'undefined' ? '✅' : '❌'}</div>
        <div>Contenedor disponible: {mapRef.current ? '✅' : '❌'}</div>
      </div>
    </div>
  );
};

export default SimpleMapComponent;
