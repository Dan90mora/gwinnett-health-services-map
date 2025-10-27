import React from 'react';

function MinimalTest() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        🗺️ Prueba Mínima de Mapa
      </h1>
      
      {/* Verificar si Tailwind funciona */}
      <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6">
        <p className="text-blue-800">
          ✅ Si ves este cuadro azul, Tailwind CSS funciona correctamente
        </p>
      </div>

      {/* Contenedor simple del mapa */}
      <div 
        id="map-container"
        className="w-full border-2 border-red-500 rounded-lg bg-gray-100"
        style={{ height: '300px' }}
      >
        <div className="flex items-center justify-center h-full text-gray-600">
          <div className="text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <div>Contenedor del mapa</div>
            <div className="text-sm">300px de altura</div>
          </div>
        </div>
      </div>

      {/* Información de debug */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">Información de Debug:</h3>
        <ul className="text-sm space-y-1">
          <li>• Tailwind CSS: {typeof document !== 'undefined' ? '✅ Cargado' : '❌ No disponible'}</li>
          <li>• React: {React.version ? `✅ v${React.version}` : '❌ No disponible'}</li>
          <li>• Contenedor visible: ✅ Border rojo visible</li>
        </ul>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          Si ves este contenido correctamente formateado con Tailwind, 
          entonces el problema específico está en OpenLayers, no en la configuración básica.
        </p>
      </div>
    </div>
  );
}

export default MinimalTest;
