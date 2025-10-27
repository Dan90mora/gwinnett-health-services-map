import { useState, useEffect, useRef } from 'react';
import { FILTER_TYPES, LANGUAGE_FILTER_OPTIONS, SERVICE_FILTER_OPTIONS, PAYMENT_METHOD_OPTIONS, SCHEDULE_OPTIONS } from '../utils/constants';

const FilterPanel = ({ onFiltersChange, isLoading, locationCount = 0, onClearFilters }) => {
  const [activeFilters, setActiveFilters] = useState({
    [FILTER_TYPES.CITY]: '',
    [FILTER_TYPES.SCHEDULE]: '',
    [FILTER_TYPES.LANGUAGE]: '',
    [FILTER_TYPES.SERVICE_TYPE]: '',
    [FILTER_TYPES.PAYMENT_METHODS]: []
  });

  const [openDropdown, setOpenDropdown] = useState(null);

  // Función para limpiar todos los filtros (expuesta al componente padre)
  const clearAllFilters = () => {
    const clearedFilters = {
      [FILTER_TYPES.CITY]: '',
      [FILTER_TYPES.SCHEDULE]: '',
      [FILTER_TYPES.LANGUAGE]: '',
      [FILTER_TYPES.SERVICE_TYPE]: '',
      [FILTER_TYPES.PAYMENT_METHODS]: []
    };
    
    setActiveFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setOpenDropdown(null);
  };

  // Exponer la función clearAllFilters al componente padre
  useEffect(() => {
    if (onClearFilters) {
      onClearFilters.current = clearAllFilters;
    }
  }, [onClearFilters]);

  // Manejar cambios en los filtros
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...activeFilters,
      [filterType]: value
    };
    
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
    setOpenDropdown(null); // Cerrar dropdown después de seleccionar
  };

  // Función para calcular el ancho óptimo basado en la opción más larga
  const calculateOptimalWidth = (options) => {
    if (!options || options.length === 0) return 224; // 56 * 4 = 224px (min-w-56)
    
    // Encontrar la opción con el texto más largo
    const longestOption = options.reduce((longest, option) => {
      return option.label.length > longest.label.length ? option : longest;
    }, options[0]);
    
    // Calcular ancho aproximado: caracteres * 8px + padding + iconos
    const textWidth = longestOption.label.length * 8;
    const paddingAndExtras = 60; // padding, iconos, márgenes
    const calculatedWidth = textWidth + paddingAndExtras;
    
    // Asegurar un ancho mínimo y máximo razonable
    const minWidth = 180;
    const maxWidth = 400;
    
    return Math.max(minWidth, Math.min(maxWidth, calculatedWidth));
  };

  // Componente de filtro individual tipo chip
  const FilterChip = ({ title, value, options, type, filterKey }) => {
    const isActive = Array.isArray(value) ? value.length > 0 : value !== '';
    const isOpen = openDropdown === filterKey;
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState({ left: '0', right: 'auto' });
    
    // Calcular ancho óptimo para este dropdown específico
    const optimalWidth = calculateOptimalWidth(options);
    
    const displayValue = Array.isArray(value) 
      ? value.length > 0 ? `${value.length} seleccionado${value.length > 1 ? 's' : ''}` : title
      : value ? options.find(opt => opt.value === value)?.label || title : title;

    // Ajustar posición del dropdown cuando se abre
    useEffect(() => {
      if (isOpen && buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const dropdownWidth = Math.max(optimalWidth, 200);
        
        // Si el dropdown se saldría por la derecha, alinearlo a la derecha del botón
        if (buttonRect.left + dropdownWidth > viewportWidth - 20) {
          setDropdownPosition({ left: 'auto', right: '0' });
        } else {
          setDropdownPosition({ left: '0', right: 'auto' });
        }
      }
    }, [isOpen, optimalWidth]);

    // Definir los íconos según el filterKey
    const getIconUrl = (filterKey) => {
      const iconMap = {
        [FILTER_TYPES.CITY]: 'https://gwinnettcoalition.org/wp-content/uploads/2025/10/location-pin.png',
        [FILTER_TYPES.SCHEDULE]: 'https://gwinnettcoalition.org/wp-content/uploads/2025/10/24-hours-support.png',
        [FILTER_TYPES.LANGUAGE]: 'https://gwinnettcoalition.org/wp-content/uploads/2025/10/language.png',
        [FILTER_TYPES.SERVICE_TYPE]: 'https://gwinnettcoalition.org/wp-content/uploads/2025/10/service.png',
        [FILTER_TYPES.PAYMENT_METHODS]: 'https://gwinnettcoalition.org/wp-content/uploads/2025/10/pay.png'
      };
      return iconMap[filterKey];
    };

    return (
      <div className="relative w-full">
        <button
          ref={buttonRef}
          onClick={() => setOpenDropdown(isOpen ? null : filterKey)}
          disabled={isLoading}
          className={`
            w-full flex items-center justify-center rounded-full border font-medium transition-all h-[35px] bg-white
            ${isActive 
              ? 'text-blue-500 border-blue-500' 
              : 'text-gray-700 border-gray-300'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          style={{
            padding: '5px 8px',
            fontSize: '13px',
            boxShadow: '0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
            gap: '6px'
          }}
        >
          <img 
            src={getIconUrl(filterKey)} 
            alt={title}
            style={{
              height: '16px',
              width: 'auto',
              flexShrink: 0
            }}
          />
          <span className="truncate" style={{ fontSize: '13px' }}>{displayValue}</span>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div 
            ref={dropdownRef}
            className="absolute top-full mt-2 z-30 max-h-64 overflow-auto"
            style={{ 
              width: `${Math.max(optimalWidth, 200)}px`,
              minWidth: '200px',
              borderRadius: '20px',
              background: '#fff',
              boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
              padding: '10px',
              left: dropdownPosition.left,
              right: dropdownPosition.right
            }}
          >            {type === 'checkbox' ? (
              <div>
                {options.map((option, index) => (
                  <label 
                    key={option.value}
                    className="flex items-center gap-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                    style={{ 
                      fontSize: '14px',
                      borderRadius: '0',
                      outline: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      background: '#fff'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(option.value)}
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? [...value, option.value]
                          : value.filter(v => v !== option.value);
                        handleFilterChange(filterKey, newValue);
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      style={{ outline: 'none' }}
                    />
                    <span className="text-gray-700" style={{ fontSize: '14px' }}>{option.label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div>
                {options.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(filterKey, option.value)}
                    className={`
                      block w-full text-left py-2 hover:bg-gray-50 transition-colors
                      ${value === option.value ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}
                    `}
                    style={{ 
                      fontSize: '14px',
                      borderRadius: '0',
                      outline: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      background: '#fff'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Contenedor responsive para los filtros */}
      <div className="flex flex-wrap md:flex-nowrap w-full gap-[10px] h-[35px] md:h-[35px]">
        {/* Filtro por Ciudad */}
        <div className="flex-1 min-w-[120px] md:flex-none md:w-[calc(20%-8px)]">
          <FilterChip
            title="City"
            value={activeFilters[FILTER_TYPES.CITY]}
            options={[
              { value: '', label: 'All cities' },
              { value: 'Lawrenceville', label: 'Lawrenceville (57)' },
              { value: 'Suwanee', label: 'Suwanee (4)' },
              { value: 'Duluth', label: 'Duluth (3)' },
              { value: 'Dacula', label: 'Dacula (1)' }
            ]}
            type="select"
            filterKey={FILTER_TYPES.CITY}
          />
        </div>

        {/* Filtro por Horario */}
        <div className="flex-1 min-w-[120px] md:flex-none md:w-[calc(20%-8px)]">
          <FilterChip
            title="Schedule"
            value={activeFilters[FILTER_TYPES.SCHEDULE]}
            options={[
              { value: '', label: 'Any schedule' },
              { value: SCHEDULE_OPTIONS.MORNING, label: 'Morning hours (6AM - 12PM)' },
              { value: SCHEDULE_OPTIONS.AFTERNOON, label: 'Afternoon hours (12PM - 6PM)' },
              { value: SCHEDULE_OPTIONS.EVENING, label: 'Evening hours (6PM - 10PM)' },
              { value: SCHEDULE_OPTIONS.EXTENDED, label: 'Extended hours (12+ hours)' },
              { value: SCHEDULE_OPTIONS.WEEKENDS, label: 'Available weekends' },
              { value: SCHEDULE_OPTIONS.APPOINTMENT, label: 'By appointment only' },
              { value: SCHEDULE_OPTIONS.TWENTY_FOUR_SEVEN, label: '24 hours / 7 days' }
            ]}
            type="select"
            filterKey={FILTER_TYPES.SCHEDULE}
          />
        </div>

        {/* Filtro por Idioma */}
        <div className="flex-1 min-w-[120px] md:flex-none md:w-[calc(20%-8px)]">
          <FilterChip
            title="Language"
            value={activeFilters[FILTER_TYPES.LANGUAGE]}
            options={LANGUAGE_FILTER_OPTIONS}
            type="select"
            filterKey={FILTER_TYPES.LANGUAGE}
          />
        </div>

        {/* Filtro por Tipo de Servicio */}
        <div className="flex-1 min-w-[120px] md:flex-none md:w-[calc(20%-8px)]">
          <FilterChip
            title="Service"
            value={activeFilters[FILTER_TYPES.SERVICE_TYPE]}
            options={SERVICE_FILTER_OPTIONS}
            type="select"
            filterKey={FILTER_TYPES.SERVICE_TYPE}
          />
        </div>

        {/* Filtro por Métodos de Pago */}
        <div className="flex-1 min-w-[120px] md:flex-none md:w-[calc(20%-8px)]">
          <FilterChip
            title="Payment"
            value={activeFilters[FILTER_TYPES.PAYMENT_METHODS]}
            options={PAYMENT_METHOD_OPTIONS.slice(1)} // Omitir la opción "cualquier método"
            type="checkbox"
            filterKey={FILTER_TYPES.PAYMENT_METHODS}
          />
        </div>
      </div>

      {/* Cerrar dropdowns al hacer clic fuera */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
};
                export default FilterPanel;
