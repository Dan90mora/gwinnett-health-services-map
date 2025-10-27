const DataStats = ({ locations, filteredLocations, isLoading }) => {
  if (isLoading || !locations || locations.length === 0) {
    return null;
  }

  // Calcular estadísticas
  const totalLocations = locations.length;
  const filteredCount = filteredLocations.length;
  
  const cityStats = locations.reduce((acc, location) => {
    const city = location.city || 'No especificado';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  const serviceStats = locations.reduce((acc, location) => {
    const service = location.serviceType || 'No especificado';
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {});

  const languageStats = locations.reduce((acc, location) => {
    const languages = location.languages || [];
    if (languages.includes('spanish') && languages.includes('english')) {
      acc['Bilingüe'] = (acc['Bilingüe'] || 0) + 1;
    } else if (languages.includes('spanish')) {
      acc['Solo Español'] = (acc['Solo Español'] || 0) + 1;
    } else if (languages.includes('english')) {
      acc['Solo Inglés'] = (acc['Solo Inglés'] || 0) + 1;
    } else {
      acc['No especificado'] = (acc['No especificado'] || 0) + 1;
    }
    return acc;
  }, {});

  const topCities = Object.entries(cityStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const topServices = Object.entries(serviceStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const getServiceIcon = (serviceType) => {
    const icons = {
      medical: '🏥',
      dental: '🦷',
      vision: '👁️',
      mental_health: '🧠',
      pharmacy: '💊',
      other: '📋'
    };
    return icons[serviceType] || '📍';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Estadísticas de Datos
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Resumen general */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Resumen General</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total ubicaciones:</span>
              <span className="font-semibold text-blue-700">{totalLocations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Actualmente visibles:</span>
              <span className="font-semibold text-green-700">{filteredCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Filtradas:</span>
              <span className="font-semibold text-orange-700">{totalLocations - filteredCount}</span>
            </div>
          </div>
        </div>

        {/* Ciudades principales */}
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">Ciudades Principales</h4>
          <div className="space-y-2">
            {topCities.map(([city, count]) => (
              <div key={city} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 capitalize">{city}</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-semibold text-green-700">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Servicios principales */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-medium text-purple-800 mb-2">Servicios Principales</h4>
          <div className="space-y-2">
            {topServices.map(([service, count]) => (
              <div key={service} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 capitalize flex items-center gap-1">
                  <span>{getServiceIcon(service)}</span>
                  {service}
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="font-semibold text-purple-700">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribución de idiomas */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 mb-3">Distribución de Idiomas</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(languageStats).map(([language, count]) => (
            <div key={language} className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-gray-800">{count}</div>
              <div className="text-xs text-gray-600">{language}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Los datos se actualizan automáticamente según los filtros aplicados. 
          Las estadísticas reflejan la base completa de datos cargada.
        </p>
      </div>
    </div>
  );
};

export default DataStats;
