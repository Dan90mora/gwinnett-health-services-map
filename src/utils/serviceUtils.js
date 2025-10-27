import { SERVICE_CATEGORIES } from './constants.js';

/**
 * Función para categorizar un servicio basado en palabras clave
 * @param {string} service - El nombre del servicio
 * @returns {string} - La categoría del servicio
 */
export const categorizeService = (service) => {
  if (!service || typeof service !== 'string') return SERVICE_CATEGORIES.OTHER;
  
  const serviceLower = service.toLowerCase();
  
  // Atención Primaria
  const primaryCareKeywords = ['primary care', 'family care', 'family medicine', 'general practice', 'adult medicine', 'annual examination', 'wellness', 'preventive', 'preventative'];
  if (primaryCareKeywords.some(keyword => serviceLower.includes(keyword))) {
    return SERVICE_CATEGORIES.PRIMARY_CARE;
  }
  
  // Servicios Dentales
  const dentalKeywords = ['dental', 'tooth', 'oral', 'dentistry', 'cosmetic dentistry', 'oral surgery'];
  if (dentalKeywords.some(keyword => serviceLower.includes(keyword))) {
    return SERVICE_CATEGORIES.DENTAL;
  }
  
  // Cuidado Visual
  const visionKeywords = ['vision', 'eye', 'optical', 'exam'];
  if (visionKeywords.some(keyword => serviceLower.includes(keyword))) {
    return SERVICE_CATEGORIES.VISION;
  }
  
  // Salud Mental
  const mentalHealthKeywords = ['mental health', 'behavioral health', 'counseling', 'therapy', 'psychiatric', 'depression', 'anxiety', 'substance abuse'];
  if (mentalHealthKeywords.some(keyword => serviceLower.includes(keyword))) {
    return SERVICE_CATEGORIES.MENTAL_HEALTH;
  }
  
  // Servicios de Emergencia
  const emergencyKeywords = ['emergency', 'urgent care', 'trauma', 'urgent'];
  if (emergencyKeywords.some(keyword => serviceLower.includes(keyword))) {
    return SERVICE_CATEGORIES.EMERGENCY;
  }
  
  // Salud de la Mujer
  const womenHealthKeywords = ['women', 'gynecology', 'obstetric', 'pregnancy', 'prenatal', 'mammogram', 'breast', 'reproductive'];
  if (womenHealthKeywords.some(keyword => serviceLower.includes(keyword))) {
    return SERVICE_CATEGORIES.WOMEN_HEALTH;
  }
  
  // Pediatría
  const pediatricsKeywords = ['pediatric', 'child', 'children', 'infant', 'newborn', 'teen', 'adolescent'];
  if (pediatricsKeywords.some(keyword => serviceLower.includes(keyword))) {
    return SERVICE_CATEGORIES.PEDIATRICS;
  }
  
  // Laboratorio y Diagnóstico
  const labKeywords = ['lab', 'laboratory', 'testing', 'diagnostic', 'radiology', 'imaging', 'x-ray', 'ultrasound'];
  if (labKeywords.some(keyword => serviceLower.includes(keyword))) {
    return SERVICE_CATEGORIES.LAB_DIAGNOSTIC;
  }
  
  // Servicios Especializados
  const specializedKeywords = ['cardiology', 'cardiac', 'orthopedic', 'cancer', 'oncology', 'neurology', 'dermatology', 'surgery'];
  if (specializedKeywords.some(keyword => serviceLower.includes(keyword))) {
    return SERVICE_CATEGORIES.SPECIALIZED;
  }
  
  // Inmunizaciones y Vacunas
  const immunizationKeywords = ['immunization', 'vaccination', 'vaccine', 'covid'];
  if (immunizationKeywords.some(keyword => serviceLower.includes(keyword))) {
    return SERVICE_CATEGORIES.IMMUNIZATIONS;
  }
  
  // Farmacia
  const pharmacyKeywords = ['pharmacy', 'medication', 'prescription'];
  if (pharmacyKeywords.some(keyword => serviceLower.includes(keyword))) {
    return SERVICE_CATEGORIES.PHARMACY;
  }
  
  // Si no coincide con ninguna categoría
  return SERVICE_CATEGORIES.OTHER;
};

/**
 * Función para verificar si una ubicación pertenece a una categoría de servicio
 * @param {Object} location - La ubicación a verificar
 * @param {string} targetCategory - La categoría objetivo
 * @returns {boolean} - True si la ubicación tiene servicios de esa categoría
 */
export const locationHasServiceCategory = (location, targetCategory) => {
  if (!location.services || !Array.isArray(location.services)) {
    return false;
  }
  
  return location.services.some(service => {
    const cleanService = service.trim().replace(/\.$/, '');
    const category = categorizeService(cleanService);
    return category === targetCategory;
  });
};
