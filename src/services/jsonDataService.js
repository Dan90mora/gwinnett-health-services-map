/**
 * Servicio para cargar datos de salud de Gwinnett desde archivo JSON
 * Reemplaza csvProcessor.js para mejorar rendimiento
 */

import healthData from '../data/gwinnett-health-data.json';

/**
 * Carga los datos de salud de Gwinnett desde el archivo JSON
 * @returns {Promise<Array>} Array de ubicaciones de salud
 */
export const loadGwinnettHealthData = async () => {
  try {
    // Simular carga async para mantener compatibilidad con la interfaz existente
    return new Promise((resolve) => {
      // Agregar pequeño delay para simular carga de red si es necesario
      setTimeout(() => {
        console.log(`Loaded ${healthData.length} locations from JSON`);
        resolve(healthData);
      }, 10);
    });
  } catch (error) {
    console.error('Error loading JSON data:', error);
    throw new Error('Could not load health data');
  }
};

/**
 * Obtiene estadísticas de los datos cargados
 * @param {Array} locations - Array de ubicaciones
 * @returns {Object} Estadísticas de los datos
 */
export const getDataStats = (locations) => {
  if (!locations || locations.length === 0) return {};
  
  const stats = {
    total: locations.length,
    byCity: {},
    byServiceType: {},
    byLanguage: {},
    byPaymentMethod: {},
    withCoordinates: 0
  };
  
  locations.forEach(location => {
    // Por ciudad
    const city = location.city || 'Not specified';
    stats.byCity[city] = (stats.byCity[city] || 0) + 1;
    
    // Por tipo de servicio
    const serviceType = location.serviceType || 'Not specified';
    stats.byServiceType[serviceType] = (stats.byServiceType[serviceType] || 0) + 1;
    
    // Por idioma
    location.languages.forEach(lang => {
      stats.byLanguage[lang] = (stats.byLanguage[lang] || 0) + 1;
    });
    
    // Por método de pago
    location.paymentMethods.forEach(method => {
      stats.byPaymentMethod[method] = (stats.byPaymentMethod[method] || 0) + 1;
    });
    
    // Con coordenadas
    if (location.coordinates) {
      stats.withCoordinates++;
    }
  });
  
  return stats;
};

/**
 * Filtra ubicaciones por criterios específicos
 * @param {Array} locations - Array de ubicaciones
 * @param {Object} filters - Filtros a aplicar
 * @returns {Array} Ubicaciones filtradas
 */
export const filterLocations = (locations, filters = {}) => {
  if (!locations || locations.length === 0) return [];
  
  return locations.filter(location => {
    // Filtro por ciudad
    if (filters.city && filters.city !== 'all' && location.city !== filters.city) {
      return false;
    }
    
    // Filtro por tipo de servicio
    if (filters.serviceType && filters.serviceType !== 'all' && location.serviceType !== filters.serviceType) {
      return false;
    }
    
    // Filtro por idioma
    if (filters.language && filters.language !== 'all' && !location.languages.includes(filters.language)) {
      return false;
    }
    
    // Filtro por método de pago
    if (filters.paymentMethod && filters.paymentMethod !== 'all' && !location.paymentMethods.includes(filters.paymentMethod)) {
      return false;
    }
    
    // Filtro por horario
    if (filters.schedule && filters.schedule !== 'all' && location.schedule !== filters.schedule) {
      return false;
    }
    
    // Filtro por texto de búsqueda
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const searchableText = [
        location.name,
        location.address,
        location.city,
        ...location.services
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Obtiene las opciones únicas para cada tipo de filtro
 * @param {Array} locations - Array de ubicaciones
 * @returns {Object} Opciones de filtro
 */
export const getFilterOptions = (locations) => {
  if (!locations || locations.length === 0) return {};
  
  const options = {
    cities: new Set(),
    serviceTypes: new Set(),
    languages: new Set(),
    paymentMethods: new Set(),
    schedules: new Set()
  };
  
  locations.forEach(location => {
    if (location.city) options.cities.add(location.city);
    if (location.serviceType) options.serviceTypes.add(location.serviceType);
    if (location.schedule) options.schedules.add(location.schedule);
    
    location.languages.forEach(lang => options.languages.add(lang));
    location.paymentMethods.forEach(method => options.paymentMethods.add(method));
  });
  
  return {
    cities: Array.from(options.cities).sort(),
    serviceTypes: Array.from(options.serviceTypes).sort(),
    languages: Array.from(options.languages).sort(),
    paymentMethods: Array.from(options.paymentMethods).sort(),
    schedules: Array.from(options.schedules).sort()
  };
};

/**
 * Busca ubicaciones por término de búsqueda
 * @param {Array} locations - Array de ubicaciones
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array} Ubicaciones que coinciden con la búsqueda
 */
export const searchLocations = (locations, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') return locations;
  
  const term = searchTerm.toLowerCase().trim();
  
  return locations.filter(location => {
    const searchableFields = [
      location.name,
      location.address,
      location.city,
      location.services.join(' '),
      location.serviceType
    ].join(' ').toLowerCase();
    
    return searchableFields.includes(term);
  });
};

// Exportar datos directamente para casos de uso específicos
export { healthData as rawHealthData };
