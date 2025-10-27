import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏥 Analizando servicios disponibles en el archivo JSON...\n');

// Leer el archivo JSON
const jsonPath = path.join(__dirname, 'src', 'data', 'gwinnett-health-data.json');
const healthData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

console.log(`📊 Total ubicaciones: ${healthData.length}\n`);

// Extraer todos los servicios únicos
const allServices = new Set();
const serviceStats = {};
let locationsWithServices = 0;
let locationsWithoutServices = 0;

healthData.forEach((location, index) => {
  if (location.services && Array.isArray(location.services) && location.services.length > 0) {
    locationsWithServices++;
    location.services.forEach(service => {
      if (service && typeof service === 'string' && service.trim() !== '') {
        // Limpiar el servicio (remover puntos finales y espacios extra)
        const cleanService = service.trim().replace(/\.$/, '');
        allServices.add(cleanService);
        serviceStats[cleanService] = (serviceStats[cleanService] || 0) + 1;
      }
    });
  } else {
    locationsWithoutServices++;
    console.log(`⚠️  ${index + 1}. ${location.name} - Sin servicios definidos`);
  }
});

console.log(`\n📈 Estadísticas:`);
console.log(`✅ Ubicaciones con servicios: ${locationsWithServices}`);
console.log(`❌ Ubicaciones sin servicios: ${locationsWithoutServices}`);
console.log(`🏥 Total servicios únicos encontrados: ${allServices.size}\n`);

console.log('📋 Lista de servicios disponibles (ordenados por frecuencia):');
const sortedServices = Object.entries(serviceStats)
  .sort(([,a], [,b]) => b - a)
  .map(([service, count]) => ({ service, count }));

sortedServices.forEach((item, index) => {
  const percentage = ((item.count / healthData.length) * 100).toFixed(1);
  console.log(`${index + 1}. "${item.service}" - ${item.count} ubicaciones (${percentage}%)`);
});

console.log('\n🎯 Opciones sugeridas para el filtro (top 20):');
sortedServices.slice(0, 20).forEach(item => {
  console.log(`{ value: '${item.service.toLowerCase().replace(/[^a-z0-9]/g, '_')}', label: '${item.service} (${item.count})' },`);
});

// Analizar categorías de servicios
console.log('\n🔍 Análisis de categorías de servicios:');

const categories = {
  'Dental': [],
  'Vision/Eye': [],
  'Mental Health': [],
  'Emergency/Urgent': [],
  'Primary Care': [],
  'Specialized': [],
  'Laboratory/Imaging': [],
  'Other': []
};

sortedServices.forEach(({service, count}) => {
  const serviceLower = service.toLowerCase();
  
  if (serviceLower.includes('dental') || serviceLower.includes('tooth') || serviceLower.includes('oral')) {
    categories['Dental'].push({service, count});
  } else if (serviceLower.includes('eye') || serviceLower.includes('vision') || serviceLower.includes('optical')) {
    categories['Vision/Eye'].push({service, count});
  } else if (serviceLower.includes('mental') || serviceLower.includes('behavioral') || serviceLower.includes('counseling') || serviceLower.includes('therapy')) {
    categories['Mental Health'].push({service, count});
  } else if (serviceLower.includes('emergency') || serviceLower.includes('urgent') || serviceLower.includes('trauma')) {
    categories['Emergency/Urgent'].push({service, count});
  } else if (serviceLower.includes('primary') || serviceLower.includes('family') || serviceLower.includes('pediatric')) {
    categories['Primary Care'].push({service, count});
  } else if (serviceLower.includes('imaging') || serviceLower.includes('radiology') || serviceLower.includes('laboratory') || serviceLower.includes('lab')) {
    categories['Laboratory/Imaging'].push({service, count});
  } else if (serviceLower.includes('cancer') || serviceLower.includes('heart') || serviceLower.includes('orthopedic') || serviceLower.includes('neuroscience')) {
    categories['Specialized'].push({service, count});
  } else {
    categories['Other'].push({service, count});
  }
});

Object.entries(categories).forEach(([category, services]) => {
  if (services.length > 0) {
    console.log(`\n${category}: ${services.length} servicios`);
    services.slice(0, 5).forEach(item => {
      console.log(`  - ${item.service} (${item.count})`);
    });
    if (services.length > 5) {
      console.log(`  ... y ${services.length - 5} más`);
    }
  }
});

// Verificar ubicaciones con múltiples servicios
console.log('\n🌟 Ubicaciones con más servicios:');
const locationsWithMostServices = healthData
  .filter(location => location.services && location.services.length > 0)
  .sort((a, b) => (b.services?.length || 0) - (a.services?.length || 0))
  .slice(0, 5);

locationsWithMostServices.forEach((location, index) => {
  console.log(`${index + 1}. ${location.name}: ${location.services.length} servicios`);
  if (location.services.length <= 5) {
    console.log(`   Servicios: ${location.services.join(', ')}`);
  } else {
    console.log(`   Primeros 3: ${location.services.slice(0, 3).join(', ')}... y ${location.services.length - 3} más`);
  }
});

// Exportar para uso en el código
const serviceOptions = sortedServices.map(item => ({
  value: item.service.toLowerCase().replace(/[^a-z0-9]/g, '_'),
  label: `${item.service} (${item.count})`,
  originalName: item.service,
  count: item.count
}));

console.log('\n💾 Guardando opciones de servicios para el código...');
const outputPath = path.join(__dirname, 'extracted-service-options.json');
fs.writeFileSync(outputPath, JSON.stringify({
  services: Array.from(allServices).sort(),
  serviceOptions: serviceOptions,
  statistics: serviceStats,
  categories: categories,
  total: healthData.length,
  withServices: locationsWithServices,
  withoutServices: locationsWithoutServices
}, null, 2));

console.log(`📁 Archivo guardado: ${outputPath}`);
