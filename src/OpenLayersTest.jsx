import { useEffect, useRef, useState } from 'react';

function OpenLayersTest() {
  const mapRef = useRef();
  const [status, setStatus] = useState('Inicializando...');
  const [error, setError] = useState(null);
  const [olModules, setOlModules] = useState({});

  useEffect(() => {
    const initMap = async () => {
      try {
        setStatus('Importando OpenLayers...');
        
        // Importar módulos de OpenLayers
        const { Map, View } = await import('ol');
        const TileLayer = (await import('ol/layer/Tile')).default;
        const OSM = (await import('ol/source/OSM')).default;
        const { fromLonLat } = await import('ol/proj');
        
        // Importar CSS
        await import('ol/ol.css');
        
        setOlModules({ Map, View, TileLayer, OSM, fromLonLat });
        setStatus('OpenLayers importado exitosamente');
        
        setStatus('Verificando contenedor...');
        
        if (!mapRef.current) {
          throw new Error('Contenedor del mapa no disponible');
        }
        
        setStatus('Creando mapa...');
        
        const map = new Map({
          target: mapRef.current,
          layers: [
            new TileLayer({
              source: new OSM()
            })
          ],
          view: new View({
            center: fromLonLat([-84.3880, 33.7490]),
            zoom: 11
          })
        });
        
        setStatus('¡Mapa creado exitosamente!');
        console.log('OpenLayers map creado:', map);
        
        return () => {
          if (map) {
            map.setTarget(null);
          }
        };
        
      } catch (err) {
        console.error('Error en initMap:', err);
        setError(err.message);
        setStatus('Error al crear el mapa');
      }
    };

    initMap();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        🧪 Prueba de OpenLayers
      </h1>
      
      {/* Estado */}
      <div className={`p-4 rounded-lg mb-4 ${error ? 'bg-red-100 border-red-300' : 'bg-blue-100 border-blue-300'} border`}>
        <p className={error ? 'text-red-800' : 'text-blue-800'}>
          <strong>Estado:</strong> {status}
        </p>
        {error && (
          <p className="text-red-600 mt-2">
            <strong>Error:</strong> {error}
          </p>
        )}
      </div>

      {/* Contenedor del mapa */}
      <div 
        ref={mapRef}
        className="w-full border-2 border-green-500 rounded-lg"
        style={{ 
          height: '400px',
          backgroundColor: '#f9f9f9'
        }}
      />

      {/* Información técnica */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm">
        <h3 className="font-bold mb-2">Información Técnica:</h3>
        <ul className="space-y-1">
          <li>• Map disponible: {olModules.Map ? '✅' : '❌'}</li>
          <li>• View disponible: {olModules.View ? '✅' : '❌'}</li>
          <li>• TileLayer disponible: {olModules.TileLayer ? '✅' : '❌'}</li>
          <li>• OSM disponible: {olModules.OSM ? '✅' : '❌'}</li>
          <li>• fromLonLat disponible: {olModules.fromLonLat ? '✅' : '❌'}</li>
          <li>• Contenedor ref: {mapRef.current ? '✅' : '❌'}</li>
        </ul>
      </div>
    </div>
  );
}

export default OpenLayersTest;
