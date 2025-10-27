import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏥 Creando categorías principales de servicios...\n');

// Leer el archivo JSON de servicios extraídos
const extractedPath = path.join(__dirname, 'extracted-service-options.json');
const extractedData = JSON.parse(fs.readFileSync(extractedPath, 'utf-8'));

// Leer el archivo JSON original para obtener los datos completos
const jsonPath = path.join(__dirname, 'src', 'data', 'gwinnett-health-data.json');
const healthData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

console.log(`📊 Total servicios únicos: ${extractedData.services.length}`);
console.log(`📊 Total ubicaciones: ${healthData.length}\n`);

// Definir categorías principales más específicas para servicios de salud
const serviceCategories = {
  'Atención Primaria': {
    keywords: ['primary care', 'family care', 'family medicine', 'general practice', 'adult medicine', 'annual examination', 'wellness', 'preventive', 'preventative'],
    services: new Set(),
    count: 0
  },
  'Servicios Dentales': {
    keywords: ['dental', 'tooth', 'oral', 'dentistry', 'cosmetic dentistry', 'oral surgery'],
    services: new Set(),
    count: 0
  },
  'Cuidado Visual': {
    keywords: ['vision', 'eye', 'optical', 'exam'],
    services: new Set(),
    count: 0
  },
  'Salud Mental': {
    keywords: ['mental health', 'behavioral health', 'counseling', 'therapy', 'psychiatric', 'depression', 'anxiety', 'substance abuse'],
    services: new Set(),
    count: 0
  },
  'Servicios de Emergencia': {
    keywords: ['emergency', 'urgent care', 'trauma', 'urgent'],
    services: new Set(),
    count: 0
  },
  'Salud de la Mujer': {
    keywords: ['women', 'gynecology', 'obstetric', 'pregnancy', 'prenatal', 'mammogram', 'breast', 'reproductive'],
    services: new Set(),
    count: 0
  },
  'Pediatría': {
    keywords: ['pediatric', 'child', 'children', 'infant', 'newborn', 'teen', 'adolescent'],
    services: new Set(),
    count: 0
  },
  'Laboratorio y Diagnóstico': {
    keywords: ['lab', 'laboratory', 'testing', 'diagnostic', 'radiology', 'imaging', 'x-ray', 'ultrasound'],
    services: new Set(),
    count: 0
  },
  'Servicios Especializados': {
    keywords: ['cardiology', 'cardiac', 'orthopedic', 'cancer', 'oncology', 'neurology', 'dermatology', 'surgery'],
    services: new Set(),
    count: 0
  },
  'Inmunizaciones y Vacunas': {
    keywords: ['immunization', 'vaccination', 'vaccine', 'covid'],
    services: new Set(),
    count: 0
  },
  'Farmacia': {
    keywords: ['pharmacy', 'medication', 'prescription'],
    services: new Set(),
    count: 0
  },
  'Otros Servicios': {
    keywords: [],
    services: new Set(),
    count: 0
  }
};

// Función para categorizar un servicio
const categorizeService = (service) => {
  const serviceLower = service.toLowerCase();
  
  for (const [categoryName, category] of Object.entries(serviceCategories)) {
    if (categoryName === 'Otros Servicios') continue; // Procesar al final
    
    for (const keyword of category.keywords) {
      if (serviceLower.includes(keyword)) {
        return categoryName;
      }
    }
  }
  
  return 'Otros Servicios';
};

// Categorizar todos los servicios
console.log('📋 Categorizando servicios...\n');

Object.entries(extractedData.statistics).forEach(([service, count]) => {
  const category = categorizeService(service);
  serviceCategories[category].services.add(service);
  serviceCategories[category].count += count;
});

// Mostrar resultados por categoría
console.log('📊 CATEGORÍAS DE SERVICIOS:\n');

Object.entries(serviceCategories)
  .sort(([,a], [,b]) => b.count - a.count)
  .forEach(([categoryName, category]) => {
    if (category.services.size > 0) {
      console.log(`🏥 ${categoryName}: ${category.count} ubicaciones (${category.services.size} servicios únicos)`);
      
      // Mostrar los servicios más comunes de cada categoría
      const topServices = Array.from(category.services)
        .map(service => ({ service, count: extractedData.statistics[service] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      topServices.forEach(item => {
        console.log(`   • ${item.service} (${item.count})`);
      });
      
      if (category.services.size > 5) {
        console.log(`   ... y ${category.services.size - 5} servicios más`);
      }
      console.log('');
    }
  });

// Crear opciones simplificadas para el filtro
console.log('🎯 OPCIONES PARA EL FILTRO DE SERVICIOS:\n');

const filterOptions = [];

Object.entries(serviceCategories)
  .sort(([,a], [,b]) => b.count - a.count)
  .forEach(([categoryName, category]) => {
    if (category.services.size > 0) {
      const value = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      filterOptions.push({
        value: value,
        label: `${categoryName} (${category.count})`,
        category: categoryName,
        count: category.count,
        services: Array.from(category.services)
      });
      
      console.log(`{ value: '${value}', label: '${categoryName} (${category.count})' },`);
    }
  });

// Función para filtrar ubicaciones por categoría
const filterLocationsByCategory = (locations, targetCategory) => {
  return locations.filter(location => {
    if (!location.services || !Array.isArray(location.services)) return false;
    
    return location.services.some(service => {
      const cleanService = service.trim().replace(/\.$/, '');
      const category = categorizeService(cleanService);
      return category === targetCategory;
    });
  });
};

console.log('\n🧪 VERIFICACIÓN DE FILTRADO:\n');

// Probar algunas categorías
const testCategories = ['Servicios Dentales', 'Cuidado Visual', 'Salud Mental', 'Servicios de Emergencia'];

testCategories.forEach(category => {
  const filtered = filterLocationsByCategory(healthData, category);
  console.log(`✅ ${category}: ${filtered.length} ubicaciones`);
  
  if (filtered.length > 0 && filtered.length <= 3) {
    filtered.forEach(location => {
      console.log(`   • ${location.name} (${location.city})`);
    });
  } else if (filtered.length > 3) {
    filtered.slice(0, 3).forEach(location => {
      console.log(`   • ${location.name} (${location.city})`);
    });
    console.log(`   ... y ${filtered.length - 3} más`);
  }
  console.log('');
});

// Guardar las categorías para usar en el código
const output = {
  categories: serviceCategories,
  filterOptions: filterOptions,
  categorizeService: categorizeService.toString(),
  totalServices: extractedData.services.length,
  totalLocations: healthData.length
};

const outputPath = path.join(__dirname, 'service-categories.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`💾 Categorías guardadas en: ${outputPath}`);
