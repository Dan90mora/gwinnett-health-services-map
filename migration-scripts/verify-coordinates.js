// Script de verificación de coordenadas actualizadas
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar datos del JSON
const jsonPath = path.join(__dirname, 'src/data/gwinnett-health-data.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('=== VERIFICACIÓN DE COORDENADAS ACTUALIZADAS ===\n');

// Filtrar ubicaciones de Suwanee
const suwaneeLocations = data.filter(location => location.city === 'Suwanee');

console.log(`📊 Total de ubicaciones de Suwanee: ${suwaneeLocations.length}\n`);

suwaneeLocations.forEach((location, index) => {
  console.log(`${index + 1}. ${location.name}`);
  console.log(`   📍 Coordenadas: ${location.coordinates ? `[${location.coordinates[0]}, ${location.coordinates[1]}]` : 'null'}`);
  console.log(`   📍 Status: ${location.coordinates ? '✅ TIENE COORDENADAS EXACTAS' : '❌ SIN COORDENADAS'}`);
  console.log(`   📍 Dirección: ${location.address}`);
  console.log('');
});

// Verificar coordenadas únicas
const coordinatesSet = new Set();
const duplicateCoords = [];

suwaneeLocations.forEach(location => {
  if (location.coordinates) {
    const coordString = `${location.coordinates[0]},${location.coordinates[1]}`;
    if (coordinatesSet.has(coordString)) {
      duplicateCoords.push(coordString);
    } else {
      coordinatesSet.add(coordString);
    }
  }
});

console.log('=== ANÁLISIS DE DUPLICADOS ===');
console.log(`Coordenadas únicas: ${coordinatesSet.size}`);
console.log(`Coordenadas duplicadas: ${duplicateCoords.length > 0 ? duplicateCoords.join(', ') : 'Ninguna'}`);
console.log('');

// Resumen por ciudad
console.log('=== RESUMEN POR CIUDAD ===');
const cities = [...new Set(data.map(loc => loc.city))].sort();
cities.forEach(city => {
  const cityLocations = data.filter(loc => loc.city === city);
  const withCoordinates = cityLocations.filter(loc => loc.coordinates).length;
  console.log(`${city}: ${withCoordinates}/${cityLocations.length} ubicaciones con coordenadas`);
});

console.log('\n✅ Verificación completada');
