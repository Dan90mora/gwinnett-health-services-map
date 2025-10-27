// Script de prueba para verificar pines del mapa con coordenadas exactas
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar datos del JSON
const jsonPath = path.join(__dirname, 'src/data/gwinnett-health-data.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('🗺️  VERIFICACIÓN DE PINES DEL MAPA CON COORDENADAS EXACTAS\n');

// Función para validar coordenadas
function validateCoordinates(coords) {
  if (!Array.isArray(coords) || coords.length !== 2) return false;
  const [lng, lat] = coords;
  return !isNaN(lng) && !isNaN(lat) && lng !== 0 && lat !== 0 && 
         lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
}

// Análisis por ciudad
const cities = ['Dacula', 'Duluth', 'Lawrenceville', 'Suwanee'];
let totalValidPins = 0;
let totalLocations = 0;

cities.forEach(city => {
  const cityLocations = data.filter(loc => loc.city === city);
  const validPins = cityLocations.filter(loc => validateCoordinates(loc.coordinates));
  
  console.log(`📍 ${city.toUpperCase()}:`);
  console.log(`   Total ubicaciones: ${cityLocations.length}`);
  console.log(`   Pines válidos: ${validPins.length}`);
  console.log(`   Cobertura: ${Math.round((validPins.length / cityLocations.length) * 100)}%`);
  
  if (validPins.length > 0) {
    console.log(`   📌 Coordenadas de pines:`);
    validPins.forEach((loc, index) => {
      const [lng, lat] = loc.coordinates;
      console.log(`      ${index + 1}. ${loc.name}`);
      console.log(`         📍 [${lng}, ${lat}]`);
      console.log(`         📧 ${loc.address}`);
    });
  }
  
  console.log('');
  totalValidPins += validPins.length;
  totalLocations += cityLocations.length;
});

// Resumen global
console.log('🎯 RESUMEN GLOBAL DE PINES:');
console.log(`   Total ubicaciones: ${totalLocations}`);
console.log(`   Pines válidos para mostrar: ${totalValidPins}`);
console.log(`   Cobertura global: ${Math.round((totalValidPins / totalLocations) * 100)}%`);

// Verificar coordenadas únicas (sin superposiciones)
const coordsSet = new Set();
const duplicates = [];

data.forEach(loc => {
  if (validateCoordinates(loc.coordinates)) {
    const coordString = `${loc.coordinates[0]},${loc.coordinates[1]}`;
    if (coordsSet.has(coordString)) {
      duplicates.push(coordString);
    } else {
      coordsSet.add(coordString);
    }
  }
});

console.log('\n🔍 ANÁLISIS DE SUPERPOSICIÓN:');
console.log(`   Coordenadas únicas: ${coordsSet.size}`);
console.log(`   Posibles superposiciones: ${duplicates.length}`);

if (duplicates.length > 0) {
  console.log(`   ⚠️  Coordenadas duplicadas: ${duplicates.join(', ')}`);
} else {
  console.log(`   ✅ No hay superposiciones - todos los pines son únicos`);
}

// Análisis de distribución geográfica
console.log('\n🌍 DISTRIBUCIÓN GEOGRÁFICA:');
const bounds = {
  minLng: Math.min(...data.filter(loc => validateCoordinates(loc.coordinates)).map(loc => loc.coordinates[0])),
  maxLng: Math.max(...data.filter(loc => validateCoordinates(loc.coordinates)).map(loc => loc.coordinates[0])),
  minLat: Math.min(...data.filter(loc => validateCoordinates(loc.coordinates)).map(loc => loc.coordinates[1])),
  maxLat: Math.max(...data.filter(loc => validateCoordinates(loc.coordinates)).map(loc => loc.coordinates[1]))
};

console.log(`   Longitud: ${bounds.minLng.toFixed(6)} a ${bounds.maxLng.toFixed(6)}`);
console.log(`   Latitud: ${bounds.minLat.toFixed(6)} a ${bounds.maxLat.toFixed(6)}`);
console.log(`   Centro sugerido: [${((bounds.minLng + bounds.maxLng) / 2).toFixed(6)}, ${((bounds.minLat + bounds.maxLat) / 2).toFixed(6)}]`);

// Estado final
if (totalValidPins === totalLocations) {
  console.log('\n🎉 ¡EXCELENTE! Todos los pines pueden mostrarse correctamente');
  console.log('✅ La migración de coordenadas está completa y funcional');
} else {
  console.log(`\n⚠️  ${totalLocations - totalValidPins} ubicaciones sin coordenadas válidas`);
  console.log('❌ Algunas ubicaciones no se mostrarán en el mapa');
}

console.log('\n🗺️  Verificación de pines completada');
