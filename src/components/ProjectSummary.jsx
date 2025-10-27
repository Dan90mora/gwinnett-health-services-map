const ProjectSummary = ({ locations, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalLocations = locations.length;
  const citiesCount = [...new Set(locations.map(loc => loc.city))].length;
  const servicesCount = [...new Set(locations.map(loc => loc.serviceType))].length;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            ¡Proyecto Completado con Éxito!
          </h2>
          <p className="text-gray-600">
            Mapa interactivo de Gwinnett Health Finder
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Estadísticas principales */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{totalLocations}</div>
            <div className="text-sm text-gray-600">Ubicaciones cargadas</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{citiesCount}</div>
            <div className="text-sm text-gray-600">Ciudades cubiertas</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{servicesCount}</div>
            <div className="text-sm text-gray-600">Tipos de servicios</div>
          </div>
        </div>
      </div>

      {/* Características implementadas */}
      <div className="mt-6">
        <h3 className="font-semibold text-gray-800 mb-3">✅ Características Implementadas:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-green-500">✓</span>
            <span>Mapa interactivo con OpenStreetMap</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-green-500">✓</span>
            <span>Procesamiento automático de CSV</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-green-500">✓</span>
            <span>Sistema de filtros avanzado</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-green-500">✓</span>
            <span>Búsqueda en tiempo real</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-green-500">✓</span>
            <span>Marcadores por tipo de servicio</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-green-500">✓</span>
            <span>Popups informativos</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-green-500">✓</span>
            <span>Diseño responsive</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-green-500">✓</span>
            <span>Integración con Google Maps URLs</span>
          </div>
        </div>
      </div>

      {/* Tecnologías utilizadas */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">🛠️ Tecnologías Utilizadas:</h3>
        <div className="flex flex-wrap gap-2">
          {[
            'React + Vite',
            'OpenLayers',
            'OpenStreetMap',
            'Tailwind CSS',
            'PapaParse',
            'Model Context Protocol'
          ].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Mensaje final */}
      <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">
            El mapa está listo para usar con datos reales de Gwinnett Health Finder
          </span>
        </div>
        <p className="text-sm text-green-700 mt-2">
          Puedes filtrar por ciudad, tipo de servicio, idioma, métodos de pago y más. 
          Haz clic en los marcadores para ver información detallada de cada ubicación.
        </p>
      </div>
    </div>
  );
};

export default ProjectSummary;
