import { FILTER_TYPES, LANGUAGE_FILTER_OPTIONS, SERVICE_FILTER_OPTIONS, PAYMENT_METHOD_OPTIONS, SCHEDULE_OPTIONS } from '../utils/constants';

const FilterResults = ({ filters, searchTerm, filterStats, onClearFilters, onRemoveFilter, onClearSearch, isLoading }) => {
  const { total, filtered, activeFilterCount, isFiltering } = filterStats;

  // Función para obtener el label de un valor de filtro
  const getFilterLabel = (filterType, value) => {
    switch (filterType) {
      case FILTER_TYPES.CITY:
        return value;
      case FILTER_TYPES.SCHEDULE:
        const scheduleOptions = [
          { value: '', label: 'Any schedule' },
          { value: SCHEDULE_OPTIONS.MORNING, label: 'Morning hours' },
          { value: SCHEDULE_OPTIONS.AFTERNOON, label: 'Afternoon hours' },
          { value: SCHEDULE_OPTIONS.EVENING, label: 'Evening hours' },
          { value: SCHEDULE_OPTIONS.EXTENDED, label: 'Extended hours' },
          { value: SCHEDULE_OPTIONS.WEEKENDS, label: 'Weekends' },
          { value: SCHEDULE_OPTIONS.APPOINTMENT, label: 'By appointment' },
          { value: SCHEDULE_OPTIONS.TWENTY_FOUR_SEVEN, label: '24 hours / 7 days' }
        ];
        return scheduleOptions.find(opt => opt.value === value)?.label || value;
      case FILTER_TYPES.LANGUAGE:
        return LANGUAGE_FILTER_OPTIONS.find(opt => opt.value === value)?.label || value;
      case FILTER_TYPES.SERVICE_TYPE:
        return SERVICE_FILTER_OPTIONS.find(opt => opt.value === value)?.label || value;
      default:
        return value;
    }
  };

  // Función para obtener el icono de un tipo de filtro
  const getFilterIcon = (filterType) => {
    const iconMap = {
      [FILTER_TYPES.CITY]: 'https://gwinnettcoalition.org/wp-content/uploads/2025/10/location-pin.png',
      [FILTER_TYPES.SCHEDULE]: 'https://gwinnettcoalition.org/wp-content/uploads/2025/10/24-hours-support.png',
      [FILTER_TYPES.LANGUAGE]: 'https://gwinnettcoalition.org/wp-content/uploads/2025/10/language.png',
      [FILTER_TYPES.SERVICE_TYPE]: 'https://gwinnettcoalition.org/wp-content/uploads/2025/10/service.png',
      [FILTER_TYPES.PAYMENT_METHODS]: 'https://gwinnettcoalition.org/wp-content/uploads/2025/10/pay.png'
    };
    return iconMap[filterType];
  };

  // Función para remover un filtro específico
  const removeFilter = (filterType, value = null) => {
    const newFilters = { ...filters };
    
    if (Array.isArray(newFilters[filterType])) {
      // Para arrays (como payment methods), remover solo el valor específico
      if (value !== null) {
        newFilters[filterType] = newFilters[filterType].filter(v => v !== value);
      } else {
        newFilters[filterType] = [];
      }
    } else {
      // Para valores simples, limpiar el filtro
      newFilters[filterType] = '';
    }
    
    onRemoveFilter(newFilters);
  };

  // Componente de chip individual
  const FilterChip = ({ filterType, value, label, onRemove, chipIndex }) => {
    const truncatedLabel = label.length > 16 ? label.substring(0, 16) + '...' : label;
    
    return (
      <div 
        className="relative flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-sm group"
        title={label} // Tooltip nativo del navegador
        style={{ fontSize: '14px' }}
        data-chip-index={chipIndex}
      >
        <img 
          src={getFilterIcon(filterType)} 
          alt=""
          style={{
            height: '14px',
            width: 'auto',
            flexShrink: 0
          }}
        />
        <span className="text-blue-700 font-medium" style={{ fontSize: '14px' }}>
          {truncatedLabel}
        </span>
        
        {/* Tooltip personalizado para texto completo */}
        {label.length > 16 && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {label}
          </div>
        )}
      </div>
    );
  };

  // Generar chips para cada filtro activo
  const filterChips = [];

  // Chip para término de búsqueda
  if (searchTerm) {
    const truncatedSearch = searchTerm.length > 16 ? searchTerm.substring(0, 16) + '...' : searchTerm;
    
    filterChips.push(
      <div 
        key="search" 
        className="relative flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full text-sm group"
        title={`Búsqueda: "${searchTerm}"`}
        style={{ fontSize: '14px' }}
        data-chip-index={filterChips.length}
      >
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-green-700 font-medium" style={{ fontSize: '14px' }}>
          "{truncatedSearch}"
        </span>
        
        {/* Tooltip personalizado para búsquedas largas */}
        {searchTerm.length > 16 && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            Búsqueda: "{searchTerm}"
          </div>
        )}
      </div>
    );
  }

  // Chips para filtros simples
  Object.entries(filters).forEach(([filterType, value]) => {
    if (filterType === FILTER_TYPES.PAYMENT_METHODS) {
      // Manejar arrays (métodos de pago)
      if (Array.isArray(value) && value.length > 0) {
        value.forEach(paymentMethod => {
          const methodLabel = PAYMENT_METHOD_OPTIONS.find(opt => opt.value === paymentMethod)?.label || paymentMethod;
          filterChips.push(
            <FilterChip
              key={`${filterType}-${paymentMethod}`}
              filterType={filterType}
              value={paymentMethod}
              label={methodLabel}
              onRemove={() => removeFilter(filterType, paymentMethod)}
              chipIndex={filterChips.length}
            />
          );
        });
      }
    } else if (value && value !== '') {
      // Manejar filtros simples
      filterChips.push(
        <FilterChip
          key={filterType}
          filterType={filterType}
          value={value}
          label={getFilterLabel(filterType, value)}
          onRemove={() => removeFilter(filterType)}
          chipIndex={filterChips.length}
        />
      );
    }
  });

  if (filterChips.length === 0 && !searchTerm) {
    return null;
  }

  return (
    <div 
      className="w-full transition-all duration-200 relative"
      style={{ 
        background: '#fff',
        boxShadow: '0 1px 2px rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)',
        padding: '10px',
        borderRadius: '20px',
        maxHeight: '300px', // Altura máxima para evitar desbordamiento
        overflow: 'hidden' // Contener todo dentro
      }}
    >
      <div 
        className="flex flex-col" 
        style={{ 
          gap: '10px',
          maxHeight: '250px', // Espacio para el contenido menos padding
          overflowY: 'auto' // Scroll vertical si es necesario
        }}
      >
        {/* Cada chip de filtro en su propia fila con botón × alineado */}
        {filterChips.map((chip, index) => {
          // Determinar qué función de eliminación usar para este chip
          let removeFunction = null;
          
          if (searchTerm && index === 0) {
            // Si hay searchTerm, el primer chip es siempre la búsqueda
            removeFunction = onClearSearch;
          } else {
            // Para filtros regulares, encontrar la función correspondiente
            let filterIndex = searchTerm ? index - 1 : index;
            let currentFilterIndex = 0;
            
            for (const [filterType, value] of Object.entries(filters)) {
              if (filterType === FILTER_TYPES.PAYMENT_METHODS) {
                if (Array.isArray(value) && value.length > 0) {
                  for (const paymentMethod of value) {
                    if (currentFilterIndex === filterIndex) {
                      removeFunction = () => removeFilter(filterType, paymentMethod);
                      break;
                    }
                    currentFilterIndex++;
                  }
                }
              } else if (value && value !== '') {
                if (currentFilterIndex === filterIndex) {
                  removeFunction = () => removeFilter(filterType);
                  break;
                }
                currentFilterIndex++;
              }
              if (removeFunction) break;
            }
          }
          
          return (
            <div key={index} className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {chip}
              </div>
              {/* Botón × alineado en la misma fila */}
              {removeFunction && (
                <button
                  onClick={removeFunction}
                  disabled={isLoading}
                  className="bg-white rounded-full shadow-sm hover:shadow-md transition-all text-blue-500 hover:text-blue-700 disabled:opacity-50 ml-2 flex-shrink-0"
                  style={{ 
                    fontSize: '16px', 
                    lineHeight: '1',
                    padding: '4px',
                    minWidth: '24px',
                    height: '24px'
                  }}
                  title={searchTerm && index === 0 ? "Eliminar búsqueda" : "Eliminar filtro"}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Botón limpiar todo - Como pestaña que sobresale en esquina superior derecha */}
      {(activeFilterCount > 0 || searchTerm) && (
        <button
          onClick={() => {
            onClearFilters();
            if (searchTerm) onClearSearch();
          }}
          disabled={isLoading}
          className="absolute flex items-center gap-1 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 transition-all disabled:opacity-50"
          style={{ 
            fontSize: '10px',
            top: '-5px', // Sobresale hacia arriba
            right: '-5px', // Sobresale hacia la derecha
            backgroundColor: '#fff',
            border: 'none',
            borderRadius: '12px 12px 0 12px', // Esquinas redondeadas excepto la inferior izquierda
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            zIndex: 60 // Por encima de todo
          }}          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear all
          </button>
      )}
    </div>
  );
};

export default FilterResults;
