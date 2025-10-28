import { useState, useCallback, useEffect } from 'react';
import { debounce } from '../utils/debounce';
import LocationList from './LocationList';
import { 
  FILTER_TYPES, 
  LANGUAGE_FILTER_OPTIONS, 
  SERVICE_FILTER_OPTIONS, 
  PAYMENT_METHOD_OPTIONS, 
  SCHEDULE_OPTIONS 
} from '../utils/constants';

const QuickSearch = ({ 
  onSearch, 
  placeholder = "Search health services in Gwinnett County...", 
  isLoading = false,
  locations = [],
  onLocationSelect,
  selectedLocationId = null,
  onFiltersChange = null // Nueva prop para activar filtros
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showLocationList, setShowLocationList] = useState(false);

  // Diccionario de términos de búsqueda que pueden activar filtros automáticamente
  const searchToFilterMap = {
    // Ciudades
    'lawrenceville': { type: FILTER_TYPES.CITY, value: 'Lawrenceville' },
    'suwanee': { type: FILTER_TYPES.CITY, value: 'Suwanee' },
    'duluth': { type: FILTER_TYPES.CITY, value: 'Duluth' },
    'dacula': { type: FILTER_TYPES.CITY, value: 'Dacula' },

    // Horarios - múltiples variantes para cada opción
    'morning': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.MORNING },
    'morning hours': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.MORNING },
    'am': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.MORNING },
    'afternoon': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.AFTERNOON },
    'afternoon hours': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.AFTERNOON },
    'pm': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.AFTERNOON },
    'evening': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.EVENING },
    'evening hours': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.EVENING },
    'night': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.EVENING },
    'extended': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.EXTENDED },
    'extended hours': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.EXTENDED },
    'weekend': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.WEEKENDS },
    'weekends': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.WEEKENDS },
    'saturday': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.WEEKENDS },
    'sunday': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.WEEKENDS },
    'appointment': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.APPOINTMENT },
    'appointment only': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.APPOINTMENT },
    'by appointment': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.APPOINTMENT },
    '24 hours': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.TWENTY_FOUR_SEVEN },
    '24/7': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.TWENTY_FOUR_SEVEN },
    '24 7': { type: FILTER_TYPES.SCHEDULE, value: SCHEDULE_OPTIONS.TWENTY_FOUR_SEVEN },

    // Idiomas
    'english': { type: FILTER_TYPES.LANGUAGE, value: 'english' },
    'spanish': { type: FILTER_TYPES.LANGUAGE, value: 'spanish' },
    'español': { type: FILTER_TYPES.LANGUAGE, value: 'spanish' },
    'creole': { type: FILTER_TYPES.LANGUAGE, value: 'creole' },
    'french': { type: FILTER_TYPES.LANGUAGE, value: 'french' },
    'français': { type: FILTER_TYPES.LANGUAGE, value: 'french' },
    'hindi': { type: FILTER_TYPES.LANGUAGE, value: 'hindi' },
    'vietnamese': { type: FILTER_TYPES.LANGUAGE, value: 'vietnamese' },
    'farsi': { type: FILTER_TYPES.LANGUAGE, value: 'farsi' },
    'gujarati': { type: FILTER_TYPES.LANGUAGE, value: 'gujarati' },
    'hebrew': { type: FILTER_TYPES.LANGUAGE, value: 'hebrew' },
    'portuguese': { type: FILTER_TYPES.LANGUAGE, value: 'portuguese' },
    'português': { type: FILTER_TYPES.LANGUAGE, value: 'portuguese' },
    'punjabi': { type: FILTER_TYPES.LANGUAGE, value: 'punjabi' },
    'russian': { type: FILTER_TYPES.LANGUAGE, value: 'russian' },
    'turkish': { type: FILTER_TYPES.LANGUAGE, value: 'turkish' },
    'urdu': { type: FILTER_TYPES.LANGUAGE, value: 'urdu' },

    // Servicios
    'vision': { type: FILTER_TYPES.SERVICE_TYPE, value: 'cuidado_visual' },
    'vision care': { type: FILTER_TYPES.SERVICE_TYPE, value: 'cuidado_visual' },
    'eye': { type: FILTER_TYPES.SERVICE_TYPE, value: 'cuidado_visual' },
    'eyes': { type: FILTER_TYPES.SERVICE_TYPE, value: 'cuidado_visual' },
    'laboratory': { type: FILTER_TYPES.SERVICE_TYPE, value: 'laboratorio_y_diagnostico' },
    'lab': { type: FILTER_TYPES.SERVICE_TYPE, value: 'laboratorio_y_diagnostico' },
    'diagnostic': { type: FILTER_TYPES.SERVICE_TYPE, value: 'laboratorio_y_diagnostico' },
    'diagnostics': { type: FILTER_TYPES.SERVICE_TYPE, value: 'laboratorio_y_diagnostico' },
    'women': { type: FILTER_TYPES.SERVICE_TYPE, value: 'salud_de_la_mujer' },
    'womens': { type: FILTER_TYPES.SERVICE_TYPE, value: 'salud_de_la_mujer' },
    'women health': { type: FILTER_TYPES.SERVICE_TYPE, value: 'salud_de_la_mujer' },
    'womens health': { type: FILTER_TYPES.SERVICE_TYPE, value: 'salud_de_la_mujer' },
    'mental': { type: FILTER_TYPES.SERVICE_TYPE, value: 'salud_mental' },
    'mental health': { type: FILTER_TYPES.SERVICE_TYPE, value: 'salud_mental' },
    'psychology': { type: FILTER_TYPES.SERVICE_TYPE, value: 'salud_mental' },
    'therapy': { type: FILTER_TYPES.SERVICE_TYPE, value: 'salud_mental' },
    'dental': { type: FILTER_TYPES.SERVICE_TYPE, value: 'servicios_dentales' },
    'dentist': { type: FILTER_TYPES.SERVICE_TYPE, value: 'servicios_dentales' },
    'teeth': { type: FILTER_TYPES.SERVICE_TYPE, value: 'servicios_dentales' },
    'tooth': { type: FILTER_TYPES.SERVICE_TYPE, value: 'servicios_dentales' },
    'pediatric': { type: FILTER_TYPES.SERVICE_TYPE, value: 'pediatria' },
    'pediatrics': { type: FILTER_TYPES.SERVICE_TYPE, value: 'pediatria' },
    'children': { type: FILTER_TYPES.SERVICE_TYPE, value: 'pediatria' },
    'kids': { type: FILTER_TYPES.SERVICE_TYPE, value: 'pediatria' },
    'primary': { type: FILTER_TYPES.SERVICE_TYPE, value: 'atencion_primaria' },
    'primary care': { type: FILTER_TYPES.SERVICE_TYPE, value: 'atencion_primaria' },
    'specialized': { type: FILTER_TYPES.SERVICE_TYPE, value: 'servicios_especializados' },
    'specialist': { type: FILTER_TYPES.SERVICE_TYPE, value: 'servicios_especializados' },
    'emergency': { type: FILTER_TYPES.SERVICE_TYPE, value: 'servicios_de_emergencia' },
    'urgent': { type: FILTER_TYPES.SERVICE_TYPE, value: 'servicios_de_emergencia' },
    'immunization': { type: FILTER_TYPES.SERVICE_TYPE, value: 'inmunizaciones_y_vacunas' },
    'immunizations': { type: FILTER_TYPES.SERVICE_TYPE, value: 'inmunizaciones_y_vacunas' },
    'vaccine': { type: FILTER_TYPES.SERVICE_TYPE, value: 'inmunizaciones_y_vacunas' },
    'vaccines': { type: FILTER_TYPES.SERVICE_TYPE, value: 'inmunizaciones_y_vacunas' },
    'vaccination': { type: FILTER_TYPES.SERVICE_TYPE, value: 'inmunizaciones_y_vacunas' },
    'pharmacy': { type: FILTER_TYPES.SERVICE_TYPE, value: 'farmacia' },
    'medication': { type: FILTER_TYPES.SERVICE_TYPE, value: 'farmacia' },
    'medicine': { type: FILTER_TYPES.SERVICE_TYPE, value: 'farmacia' },
    'prescription': { type: FILTER_TYPES.SERVICE_TYPE, value: 'farmacia' },

    // Métodos de pago
    'cash': { type: FILTER_TYPES.PAYMENT_METHODS, value: 'cash' },
    'efectivo': { type: FILTER_TYPES.PAYMENT_METHODS, value: 'cash' },
    'medicaid': { type: FILTER_TYPES.PAYMENT_METHODS, value: 'medicaid' },
    'medicare': { type: FILTER_TYPES.PAYMENT_METHODS, value: 'medicare' },
    'uninsured': { type: FILTER_TYPES.PAYMENT_METHODS, value: 'uninsured_programs' },
    'uninsured programs': { type: FILTER_TYPES.PAYMENT_METHODS, value: 'uninsured_programs' },
    'sliding scale': { type: FILTER_TYPES.PAYMENT_METHODS, value: 'sliding_scale' },
    'sliding': { type: FILTER_TYPES.PAYMENT_METHODS, value: 'sliding_scale' },
    'peachcare': { type: FILTER_TYPES.PAYMENT_METHODS, value: 'peachcare' },
    'insurance': { type: FILTER_TYPES.PAYMENT_METHODS, value: 'insurance' },
    'seguro': { type: FILTER_TYPES.PAYMENT_METHODS, value: 'insurance' }
  };

  // Función para activar un filtro específico
  const activateFilter = useCallback((filterType, value) => {
    if (!onFiltersChange) return;

    const newFilters = {
      [FILTER_TYPES.CITY]: '',
      [FILTER_TYPES.SCHEDULE]: '',
      [FILTER_TYPES.LANGUAGE]: '',
      [FILTER_TYPES.SERVICE_TYPE]: '',
      [FILTER_TYPES.PAYMENT_METHODS]: []
    };

    if (filterType === FILTER_TYPES.PAYMENT_METHODS) {
      newFilters[filterType] = [value];
    } else {
      newFilters[filterType] = value;
    }

    onFiltersChange(newFilters);
  }, [onFiltersChange]);

  // Función para analizar el término de búsqueda y activar filtros si corresponde
  const analyzeSearchAndActivateFilters = useCallback((searchText) => {
    if (!searchText || !onFiltersChange) return false;

    const normalizedSearch = searchText.toLowerCase().trim();
    
    // Buscar coincidencias exactas primero
    if (searchToFilterMap[normalizedSearch]) {
      const filterMatch = searchToFilterMap[normalizedSearch];
      activateFilter(filterMatch.type, filterMatch.value);
      return true;
    }

    // Buscar coincidencias parciales para términos compuestos
    for (const [term, filterData] of Object.entries(searchToFilterMap)) {
      if (normalizedSearch.includes(term) || term.includes(normalizedSearch)) {
        activateFilter(filterData.type, filterData.value);
        return true;
      }
    }

    return false;
  }, [activateFilter, onFiltersChange]);

  // Optimización: Debounce para búsqueda en tiempo real
  const debouncedSearch = useCallback(
    debounce((term) => {
      // Primero intentar activar filtros basados en el término
      const filterActivated = analyzeSearchAndActivateFilters(term);
      
      // Si no se activó ningún filtro, proceder con búsqueda de texto normal
      if (!filterActivated) {
        onSearch(term);
      } else {
        // Si se activó un filtro, limpiar el término de búsqueda
        onSearch('');
        // Limpiar el campo de búsqueda después de un pequeño delay
        setTimeout(() => {
          setSearchTerm('');
        }, 100);
      }
    }, 300),
    [onSearch, analyzeSearchAndActivateFilters]
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleLocationListToggle = () => {
    setShowLocationList(!showLocationList);
  };

  const handleLocationSelect = (location) => {
    if (onLocationSelect) {
      onLocationSelect(location);
    }
    setShowLocationList(false);
  };

  const handleNavigateToSelected = () => {
    const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
    if (selectedLocation && onLocationSelect) {
      onLocationSelect(selectedLocation);
    }
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      debouncedSearch.cancel?.(); // Limpiar timeout pendiente si existe
    };
  }, [debouncedSearch]);

  return (
    <>
      <div className="relative w-full">
        <div 
          className="relative transition-all duration-200 rounded-full"
          style={{ 
            background: '#fff',
            boxShadow: '0 1px 2px rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)'
          }}
        >
          <div className="flex items-center">
            {/* Sección 1: Botón para mostrar LocationList */}
            <button
              onClick={handleLocationListToggle}
              className="flex items-center justify-center p-3 bg-white hover:bg-white rounded-l-full transition-colors focus:outline-none"
              type="button"
            >
              <img 
                src="https://gwinnettcoalition.org/wp-content/uploads/2025/10/interface.png"
                alt="Location list"
                style={{
                  height: '18px',
                  width: 'auto'
                }}
              />
            </button>

            {/* Sección 2: Input de búsqueda */}
            <div className="flex-1 flex items-center bg-white">
              {/* Icono de carga */}
              <div className="pl-3 pr-2 flex items-center bg-white">
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                )}
              </div>

              {/* Input de búsqueda */}
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder={placeholder}
                disabled={isLoading}
                className="flex-1 py-3 bg-white outline-none text-gray-700 placeholder-gray-500 disabled:cursor-not-allowed"
                style={{ border: 'none' }}
              />

              {/* Botón limpiar */}
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="mr-2 p-1 bg-white hover:bg-white rounded-full transition-colors"
                  type="button"
                >
                  <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Sección 3: Botón para dirigir a ubicación seleccionada */}
            <button
              onClick={handleNavigateToSelected}
              disabled={!selectedLocationId || isLoading}
              className="flex items-center justify-center p-3 bg-white hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-r-full transition-colors"
              type="button"
            >
              <img 
                src="https://gwinnettcoalition.org/wp-content/uploads/2025/10/search.png"
                alt="Go to location"
                style={{
                  height: '18px',
                  width: 'auto'
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Menu lateral de LocationList */}
      <>
        {/* Overlay para cerrar el menú */}
        {showLocationList && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowLocationList(false)}
          />
        )}
        
        {/* Panel lateral */}
        <div 
          className={`fixed w-80 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
            showLocationList ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ 
            background: '#fff', 
            top: '0px', // Donde comienza el mapa
            height: 'calc(100vh - 0px)', // Misma altura que el área del mapa (flex-1)
            left: showLocationList ? '0' : '-320px' // Completamente oculto cuando no está activo
          }}
        >
            <div className="h-full flex flex-col">
              {/* Header del panel */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Location List</h2>
                <button
                  onClick={() => setShowLocationList(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                >
                  <img 
                    src="https://gwinnettcoalition.org/wp-content/uploads/2025/10/close.png"
                    alt="Close list"
                    style={{
                      height: '18px',
                      width: 'auto'
                    }}
                  />
                </button>
              </div>
              
              {/* Contenido del LocationList */}
              <div className="flex-1 overflow-hidden">
                <LocationList
                  locations={locations}
                  onLocationSelect={handleLocationSelect}
                  selectedLocationId={selectedLocationId}
                  isLoading={isLoading}
                  onClose={() => setShowLocationList(false)}
                />
              </div>
            </div>
        </div>
      </>
    </>
  );
};

export default QuickSearch;
