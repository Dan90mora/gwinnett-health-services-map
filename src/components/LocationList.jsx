import { useState, useMemo } from 'react';

const LocationList = ({ locations, onLocationSelect, selectedLocationId = null, isLoading = false, onClose = null }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Menos elementos por página para mejor UX

  // Optimización: Paginación para manejar listas grandes
  const paginatedLocations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return locations.slice(startIndex, endIndex);
  }, [locations, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(locations.length / itemsPerPage);

  // Función para obtener el ícono del tipo de servicio
  const getServiceIcon = (serviceType) => {
    const iconMap = {
      'medical': '🏥',
      'dental': '🦷',
      'vision': '👁️',
      'mental_health': '🧠',
      'pharmacy': '💊',
      'other': '📋'
    };
    return iconMap[serviceType] || '🏥';
  };

  // Función para formatear la dirección
  const formatAddress = (address) => {
    if (!address) return 'Address not available';
    return address.length > 50 ? address.substring(0, 50) + '...' : address;
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: '#fff', fontSize: '14px', lineHeight: '17px' }}>
      {/* Header fijo */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200" style={{ background: '#fff' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800" style={{ fontSize: '14px', lineHeight: '17px', margin: '0' }}>
            Locations
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {locations.length}
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close panel"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {locations.length > 0 && (
          <div className="mt-2 text-sm text-gray-600" style={{ fontSize: '14px', lineHeight: '17px', margin: '8px 0 0 0' }}>
            Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, locations.length)} of {locations.length}
          </div>
        )}
      </div>

      {/* Lista scrollable */}
      <div className="flex-1 overflow-y-auto">
        {locations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h4 className="text-lg font-medium text-gray-600 mb-2" style={{ fontSize: '14px', lineHeight: '17px', margin: '0 0 8px 0' }}>No locations found</h4>
            <p className="text-gray-500 text-sm" style={{ fontSize: '14px', lineHeight: '17px', margin: '0' }}>Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {paginatedLocations.map((location, index) => (
              <div
                key={location.id || index}
                onClick={() => onLocationSelect && onLocationSelect(location)}
                className={`
                  p-4 rounded-lg border transition-all duration-200 cursor-pointer
                  ${selectedLocationId === location.id 
                    ? 'bg-blue-50 border-blue-200 shadow-md' 
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Ícono del servicio */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center text-lg">
                    {getServiceIcon(location.serviceType)}
                  </div>

                  {/* Información principal */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1 truncate">
                      {location.name || 'Nombre no disponible'}
                    </h4>
                    
                    <p className="text-xs text-gray-600 leading-relaxed" style={{ margin: '0', lineHeight: '17px' }}>
                      {formatAddress(location.address)}
                    </p>

                    {/* Detalles adicionales */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {location.city && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                           {location.city}
                        </span>
                      )}
                      
                      {location.languages && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                           {location.languages.includes('Spanish') ? 'ES' : 'EN'}
                        </span>
                      )}
                    </div>

                    {/* Horarios */}
                    {location.operatingHours && (
                      <p className="text-xs text-gray-500 truncate" style={{ margin: '0', lineHeight: '17px' }}>
                         {location.operatingHours.substring(0, 30)}...
                      </p>
                    )}

                    {/* Métodos de pago */}
                    {location.paymentsAccepted && location.paymentsAccepted.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {location.paymentsAccepted.slice(0, 2).map((payment, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                             {payment}
                          </span>
                        ))}
                        {location.paymentsAccepted.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{location.paymentsAccepted.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Indicador de selección */}
                  {selectedLocationId === location.id && (
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paginación fija en la parte inferior */}
      {totalPages > 1 && (
        <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200" style={{ background: '#fff' }}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <span className="text-sm text-gray-600" style={{ fontSize: '14px', lineHeight: '17px' }}>
              {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationList;
