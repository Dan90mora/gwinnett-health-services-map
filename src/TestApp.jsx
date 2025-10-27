import { useState, useEffect } from 'react'
import SimpleMapComponent from './components/SimpleMapComponent'
import MapComponent from './components/MapComponent'
import './App.css'

function TestApp() {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Prueba de Mapas - Diagnóstico
        </h1>
        
        <div className="mb-4">
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showOriginal ? 'Mostrar Mapa Simple' : 'Mostrar Mapa Original'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            {showOriginal ? 'Mapa Original (MapComponent)' : 'Mapa Simple de Prueba'}
          </h2>
          
          {showOriginal ? (
            <MapComponent 
              locations={[]} 
              isLoading={false}
              onLocationSelect={() => {}}
            />
          ) : (
            <SimpleMapComponent locations={[]} />
          )}
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800">Información de Diagnóstico:</h3>
          <ul className="mt-2 text-sm text-yellow-700">
            <li>• OpenLayers CSS debería estar cargado</li>
            <li>• El contenedor del mapa tiene dimensiones fijas</li>
            <li>• Se muestran marcadores de prueba en Atlanta</li>
            <li>• Verifica la consola del navegador para errores</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TestApp
