import Papa from 'papaparse';
import { extractCoordinatesFromGoogleMaps } from '../utils/mapUtils';

/**
 * Servicio para procesar el archivo CSV de Gwinnett Health Finder
 */

/**
 * Lee y procesa el archivo CSV de Gwinnett Health Finder
 * @returns {Promise<Array>} Array de ubicaciones procesadas
 */
export const loadGwinnettHealthData = async () => {
  try {
    // Importar el archivo CSV usando fetch
    const response = await fetch('/Gwinnett Health Finder - Sheet1.csv');
    if (!response.ok) {
      throw new Error(`Error cargando CSV: ${response.status}`);
    }
    
    const csvData = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => {
          // Limpiar y normalizar nombres de columnas
          return header.trim().toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
        },
        complete: (results) => {
          try {
            const processedLocations = results.data
              .map((row, index) => processLocationRow(row, index))
              .filter(location => location !== null);

            console.log(`Procesadas ${processedLocations.length} ubicaciones de ${results.data.length} filas`);
            resolve(processedLocations);
          } catch (error) {
            console.error('Error procesando datos CSV:', error);
            reject(error);
          }
        },
        error: (error) => {
          console.error('Error parseando CSV:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error cargando archivo CSV:', error);
    throw error;
  }
};

/**
 * Procesa una fila individual del CSV
 * @param {Object} row - Fila del CSV
 * @param {number} index - Índice de la fila
 * @returns {Object|null} Ubicación procesada o null si es inválida
 */
const processLocationRow = (row, index) => {
  try {
    // Verificar que la fila tenga datos mínimos requeridos
    if (!row.name || !row.address) {
      return null;
    }

    // Extraer y limpiar datos básicos
    const location = {
      id: index + 1,
      name: cleanText(row.name),
      address: cleanText(row.address),
      city: extractCityFromAddress(row.city || row.address),
      website: row.website || '',
      phone: cleanPhoneNumber(row.number),
      
      // Procesar horarios
      schedule: parseSchedule(row.operating_days_hours),
      
      // Procesar idiomas
      languages: parseLanguages(row.languages),
      
      // Procesar servicios
      services: parseServices(row.services_provided),
      serviceType: categorizeServiceType(row.services_provided),
      
      // Procesar métodos de pago
      paymentMethods: parsePaymentMethods(row.payments_accepted),
      
      // Información adicional
      serviceArea: cleanText(row.service_area),
      requirements: cleanText(row.requirements),
      other: cleanText(row.other),
      
      // Coordenadas (se extraerán más adelante si no están disponibles)
      coordinates: null,
      googleMapsUrl: generateGoogleMapsUrl(row.address)
    };

    return location;
  } catch (error) {
    console.warn(`Error procesando fila ${index}:`, error);
    return null;
  }
};

/**
 * Limpia texto eliminando espacios extra y caracteres especiales
 */
const cleanText = (text) => {
  if (!text) return '';
  return text.toString().trim().replace(/\s+/g, ' ');
};

/**
 * Extrae la ciudad de la dirección
 */
const extractCityFromAddress = (cityOrAddress) => {
  if (!cityOrAddress) return '';
  
  const cleaned = cleanText(cityOrAddress);
  
  // Si ya es solo una ciudad
  if (cleaned.includes(',')) {
    const parts = cleaned.split(',');
    const cityPart = parts[0].trim();
    if (cityPart.includes(' GA')) {
      return cityPart.replace(' GA', '').trim();
    }
    return cityPart;
  }
  
  // Buscar patrones de ciudad en la dirección
  const cityPattern = /(Lawrenceville|Duluth|Suwanee|Dacula|Norcross|Tucker|Atlanta|Buford|Sugar Hill)/i;
  const match = cleaned.match(cityPattern);
  
  return match ? match[1] : cleaned;
};

/**
 * Limpia números de teléfono
 */
const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.toString().replace(/[^\d-().\s]/g, '').trim();
};

/**
 * Parsea horarios de operación
 */
const parseSchedule = (scheduleText) => {
  if (!scheduleText) return 'No especificado';
  
  const text = scheduleText.toLowerCase();
  
  if (text.includes('appointment')) return 'Por cita';
  if (text.includes('24') || text.includes('24/7')) return '24h';
  if (text.includes('8:00') && text.includes('8:00')) return 'morning';
  if (text.includes('9:00') || text.includes('10:00')) return 'morning';
  if (text.includes('12:00') || text.includes('1:00') || text.includes('2:00')) return 'afternoon';
  if (text.includes('6:00') || text.includes('7:00') || text.includes('8:00')) return 'evening';
  
  return 'Horario variable';
};

/**
 * Parsea idiomas disponibles
 */
const parseLanguages = (languageText) => {
  if (!languageText) return ['english'];
  
  const text = languageText.toLowerCase();
  const languages = [];
  
  if (text.includes('english')) languages.push('english');
  if (text.includes('spanish') || text.includes('español')) languages.push('spanish');
  
  return languages.length > 0 ? languages : ['english'];
};

/**
 * Parsea servicios proporcionados
 */
const parseServices = (servicesText) => {
  if (!servicesText) return [];
  
  return servicesText
    .split(',')
    .map(service => cleanText(service))
    .filter(service => service.length > 0);
};

/**
 * Categoriza el tipo de servicio principal
 */
const categorizeServiceType = (servicesText) => {
  if (!servicesText) return 'other';
  
  const text = servicesText.toLowerCase();
  
  if (text.includes('dental') || text.includes('teeth')) return 'dental';
  if (text.includes('vision') || text.includes('eye') || text.includes('optical')) return 'vision';
  if (text.includes('mental') || text.includes('counseling') || text.includes('behavioral')) return 'mental_health';
  if (text.includes('medical') || text.includes('health') || text.includes('clinic')) return 'medical';
  if (text.includes('pharmacy') || text.includes('medication')) return 'pharmacy';
  
  return 'medical'; // Por defecto
};

/**
 * Parsea métodos de pago
 */
const parsePaymentMethods = (paymentText) => {
  if (!paymentText) return [];
  
  const text = paymentText.toLowerCase();
  const methods = [];
  
  if (text.includes('medicaid')) methods.push('medicaid');
  if (text.includes('medicare')) methods.push('medicare');
  if (text.includes('self pay') || text.includes('cash')) methods.push('cash');
  if (text.includes('insurance')) methods.push('insurance');
  if (text.includes('sliding scale')) methods.push('sliding_scale');
  if (text.includes('peachcare')) methods.push('peachcare');
  if (text.includes('uninsured')) methods.push('uninsured_programs');
  
  return methods;
};

/**
 * Genera URL de Google Maps para una dirección
 */
const generateGoogleMapsUrl = (address) => {
  if (!address) return '';
  
  const encodedAddress = encodeURIComponent(cleanText(address));
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
};

/**
 * Estadísticas del procesamiento de datos
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
    const city = location.city || 'No especificado';
    stats.byCity[city] = (stats.byCity[city] || 0) + 1;
    
    // Por tipo de servicio
    const serviceType = location.serviceType || 'No especificado';
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
