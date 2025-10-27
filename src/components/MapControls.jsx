import { useState } from 'react';

const MapControls = ({ onZoomIn, onZoomOut, onResetView, isLoading }) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      {/* Controles de zoom */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <button
          onClick={onZoomIn}
          disabled={isLoading}
          className="block w-10 h-10 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center border-b border-gray-200"
          title="Acercar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button
          onClick={onZoomOut}
          disabled={isLoading}
          className="block w-10 h-10 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          title="Alejar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
      </div>

      {/* Control de vista inicial */}
      <button
        onClick={onResetView}
        disabled={isLoading}
        className="bg-white rounded-lg shadow-lg border border-gray-200 w-10 h-10 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        title="Vista inicial"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      </button>

      {/* Control de ayuda */}
      <div className="relative">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="bg-white rounded-lg shadow-lg border border-gray-200 w-10 h-10 hover:bg-gray-50 transition-colors flex items-center justify-center"
          title="Ayuda"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Panel de ayuda */}
        {showHelp && (
          <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64 z-20">
            <h3 className="font-semibold text-gray-800 mb-2">Controles del Mapa</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Arrastra para mover el mapa</li>
              <li>• Rueda del ratón para zoom</li>
              <li>• Clic en marcadores para info</li>
              <li>• Usa los filtros para buscar</li>
            </ul>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-3 text-xs text-blue-600 hover:text-blue-800"
            >
              Cerrar ayuda
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapControls;
