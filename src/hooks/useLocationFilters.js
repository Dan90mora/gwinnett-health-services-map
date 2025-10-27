import { useState, useCallback, useMemo } from 'react';
import { FILTER_TYPES, SCHEDULE_OPTIONS } from '../utils/constants';
import { locationHasServiceCategory } from '../utils/serviceUtils';

/**
 * Función auxiliar para analizar horarios de texto y clasificarlos
 */
const analyzeSchedule = (scheduleText) => {
  if (!scheduleText || typeof scheduleText !== 'string') return [];
  
  const schedule = scheduleText.toLowerCase();
  const categories = [];
  
  // Verificar 24/7
  if (schedule.includes('24 hours') || schedule.includes('24/7') || 
      schedule.includes('24 horas') || schedule.includes('7 days')) {
    categories.push(SCHEDULE_OPTIONS.TWENTY_FOUR_SEVEN);
    return categories; // Si es 24/7, no necesita otras categorías
  }
  
  // Verificar solo por cita
  if (schedule.includes('appointment') || schedule.includes('by appointment') ||
      schedule.includes('por cita') || schedule.includes('cita previa')) {
    categories.push(SCHEDULE_OPTIONS.APPOINTMENT);
    return categories; // Si es solo por cita, no necesita horarios específicos
  }
  
  // Verificar fines de semana
  if (schedule.includes('saturday') || schedule.includes('sunday') || 
      schedule.includes('sábado') || schedule.includes('domingo')) {
    categories.push(SCHEDULE_OPTIONS.WEEKENDS);
  }
  
  // Analizar horarios específicos usando regex
  const timePattern = /(\d{1,2}):?(\d{0,2})\s*(am|pm|a\.?m\.?|p\.?m\.?)/gi;
  const times = [];
  let match;
  
  while ((match = timePattern.exec(schedule)) !== null) {
    const hour = parseInt(match[1]);
    const minute = parseInt(match[2] || '0');
    const period = match[3].toLowerCase().replace(/\./g, '');
    
    let hour24 = hour;
    if (period.includes('p') && hour !== 12) hour24 += 12;
    if (period.includes('a') && hour === 12) hour24 = 0;
    
    times.push(hour24 * 60 + minute); // Convertir a minutos desde medianoche
  }
  
  if (times.length >= 2) {
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const durationMinutes = maxTime - minTime;
    
    // Verificar horarios extendidos (más de 12 horas)
    if (durationMinutes > 12 * 60) {
      categories.push(SCHEDULE_OPTIONS.EXTENDED);
    }
    
    // Clasificar por horarios específicos
    const morningStart = 6 * 60; // 6:00 AM
    const afternoonStart = 12 * 60; // 12:00 PM  
    const eveningStart = 18 * 60; // 6:00 PM
    
    if (minTime <= morningStart + 2 * 60) { // Abre antes de 8:00 AM
      categories.push(SCHEDULE_OPTIONS.MORNING);
    }
    
    if (maxTime >= afternoonStart && maxTime <= eveningStart) {
      categories.push(SCHEDULE_OPTIONS.AFTERNOON);
    }
    
    if (maxTime >= eveningStart) {
      categories.push(SCHEDULE_OPTIONS.EVENING);
    }
  }
  
  return categories;
};

/**
 * Hook personalizado para manejar el filtrado de ubicaciones con optimizaciones de rendimiento
 */
export const useLocationFilters = (locations = []) => {
  const [filters, setFilters] = useState({
    [FILTER_TYPES.CITY]: '',
    [FILTER_TYPES.SCHEDULE]: '',
    [FILTER_TYPES.LANGUAGE]: '',
    [FILTER_TYPES.SERVICE_TYPE]: '',
    [FILTER_TYPES.PAYMENT_METHODS]: []
  });

  // Optimización: Memoizar la función de actualización de filtros
  const updateFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  }, []);

  // Optimización: Memoizar la función de limpieza
  const clearFilters = useCallback(() => {
    setFilters({
      [FILTER_TYPES.CITY]: '',
      [FILTER_TYPES.SCHEDULE]: '',
      [FILTER_TYPES.LANGUAGE]: '',
      [FILTER_TYPES.SERVICE_TYPE]: '',
      [FILTER_TYPES.PAYMENT_METHODS]: []
    });
  }, []);

  // Optimización: Crear índices para búsqueda más rápida
  const locationIndices = useMemo(() => {
    if (!locations || locations.length === 0) return {};
    
    return {
      byCity: locations.reduce((acc, location, index) => {
        const city = location.city?.toLowerCase() || '';
        if (!acc[city]) acc[city] = [];
        acc[city].push(index);
        return acc;
      }, {}),
      
      byServiceType: locations.reduce((acc, location, index) => {
        const serviceType = location.serviceType || '';
        if (!acc[serviceType]) acc[serviceType] = [];
        acc[serviceType].push(index);
        return acc;
      }, {}),
      
      byLanguage: locations.reduce((acc, location, index) => {
        const languages = location.languages || [];
        languages.forEach(lang => {
          if (!acc[lang]) acc[lang] = [];
          acc[lang].push(index);
        });
        return acc;
      }, {})
    };
  }, [locations]);

  // Función optimizada para verificar filtros
  const matchesFilters = useCallback((location) => {
    // Filtro por ciudad (optimizado)
    if (filters[FILTER_TYPES.CITY]) {
      const filterCity = filters[FILTER_TYPES.CITY].toLowerCase();
      const locationCity = location.city?.toLowerCase() || '';
      if (locationCity !== filterCity) return false;
    }

    // Filtro por horario (análisis inteligente)
    if (filters[FILTER_TYPES.SCHEDULE]) {
      const scheduleCategories = analyzeSchedule(location.schedule);
      if (!scheduleCategories.includes(filters[FILTER_TYPES.SCHEDULE])) {
        return false;
      }
    }

    // Filtro por idioma (simplificado para todos los idiomas disponibles)
    if (filters[FILTER_TYPES.LANGUAGE]) {
      const locationLanguages = location.languages || [];
      const filterLanguage = filters[FILTER_TYPES.LANGUAGE];
      
      // Verificar si la ubicación tiene el idioma seleccionado
      if (!locationLanguages.includes(filterLanguage)) {
        return false;
      }
    }

    // Filtro por categoría de servicio (análisis inteligente)
    if (filters[FILTER_TYPES.SERVICE_TYPE]) {
      if (!locationHasServiceCategory(location, filters[FILTER_TYPES.SERVICE_TYPE])) {
        return false;
      }
    }

    // Filtro por métodos de pago (lógica AND - todos los métodos seleccionados deben estar presentes)
    if (filters[FILTER_TYPES.PAYMENT_METHODS].length > 0) {
      const locationPaymentMethods = new Set(location.paymentMethods || []);
      const hasAllPaymentMethods = filters[FILTER_TYPES.PAYMENT_METHODS].every(
        method => locationPaymentMethods.has(method)
      );
      
      if (!hasAllPaymentMethods) return false;
    }

    return true;
  }, [filters]);

  // Aplicar filtros con optimización de chunks para listas grandes
  const filteredLocations = useMemo(() => {
    if (!locations || locations.length === 0) return [];
    
    // Para datasets grandes, procesar en chunks para evitar bloquear la UI
    if (locations.length > 1000) {
      const chunkSize = 100;
      const filtered = [];
      
      for (let i = 0; i < locations.length; i += chunkSize) {
        const chunk = locations.slice(i, i + chunkSize);
        filtered.push(...chunk.filter(matchesFilters));
      }
      
      return filtered;
    }
    
    return locations.filter(matchesFilters);
  }, [locations, matchesFilters]);

  // Obtener opciones únicas para filtros dinámicos
  const getUniqueOptions = useCallback((field) => {
    if (!locations || locations.length === 0) return [];
    
    const uniqueValues = [...new Set(
      locations
        .map(location => location[field])
        .filter(value => value != null && value !== '')
    )];
    
    return uniqueValues.sort();
  }, [locations]);

  // Estadísticas de filtros
  const filterStats = useMemo(() => {
    const total = locations.length;
    const filtered = filteredLocations.length;
    const activeFilterCount = Object.values(filters).filter(filter => {
      if (Array.isArray(filter)) return filter.length > 0;
      return filter !== '';
    }).length;

    return {
      total,
      filtered,
      activeFilterCount,
      isFiltering: activeFilterCount > 0
    };
  }, [locations, filteredLocations, filters]);

  return {
    filters,
    filteredLocations,
    updateFilters,
    clearFilters,
    getUniqueOptions,
    filterStats,
    matchesFilters
  };
};
