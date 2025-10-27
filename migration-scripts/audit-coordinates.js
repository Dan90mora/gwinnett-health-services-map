// Auditoría completa de coordenadas por ciudad
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar datos del JSON
const jsonPath = path.join(__dirname, 'src/data/gwinnett-health-data.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('=== AUDITORÍA COMPLETA DE COORDENADAS ===\n');

// Análisis por ciudad
const cities = [...new Set(data.map(loc => loc.city))].sort();

cities.forEach(city => {
  const cityLocations = data.filter(loc => loc.city === city);
  const withCoords = cityLocations.filter(loc => loc.coordinates && loc.coordinates !== null);
  const withoutCoords = cityLocations.filter(loc => !loc.coordinates || loc.coordinates === null);
  
  console.log(`📍 ${city.toUpperCase()}:`);
  console.log(`   Total: ${cityLocations.length} ubicaciones`);
  console.log(`   ✅ Con coordenadas: ${withCoords.length}`);
  console.log(`   ❌ Sin coordenadas: ${withoutCoords.length}`);
  
  if (withoutCoords.length > 0) {
    console.log(`\n   🔍 UBICACIONES SIN COORDENADAS:`);
    withoutCoords.forEach((loc, i) => {
      console.log(`      ${i+1}. ${loc.name}`);
      console.log(`         📧 ${loc.address}`);
      console.log(`         🌐 ${loc.googleMapsUrl || 'No URL'}`);
    });
  }
  console.log('');
});

// Resumen global
const totalLocations = data.length;
const totalWithCoords = data.filter(loc => loc.coordinates && loc.coordinates !== null).length;
const totalWithoutCoords = totalLocations - totalWithCoords;

console.log('=== RESUMEN GLOBAL ===');
console.log(`📊 Total de ubicaciones: ${totalLocations}`);
console.log(`✅ Con coordenadas: ${totalWithCoords} (${Math.round(totalWithCoords/totalLocations*100)}%)`);
console.log(`❌ Sin coordenadas: ${totalWithoutCoords} (${Math.round(totalWithoutCoords/totalLocations*100)}%)`);

console.log('\n=== PRIORIDADES DE CORRECCIÓN ===');
cities.forEach(city => {
  const cityLocations = data.filter(loc => loc.city === city);
  const withoutCoords = cityLocations.filter(loc => !loc.coordinates || loc.coordinates === null).length;
  
  if (withoutCoords > 0) {
    console.log(`🚩 ${city}: ${withoutCoords} ubicaciones necesitan coordenadas`);
  }
});
