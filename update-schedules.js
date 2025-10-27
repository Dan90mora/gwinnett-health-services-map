import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🕐 Iniciando actualización de horarios...\n');

// Leer el archivo CSV
const csvPath = path.join(__dirname, 'public', 'Gwinnett Health Finder - Sheet1.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Leer el archivo JSON
const jsonPath = path.join(__dirname, 'src', 'data', 'gwinnett-health-data.json');
const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
const healthData = JSON.parse(jsonContent);

// Procesar CSV de manera más robusta
const csvLocations = [];
let currentRecord = [];
let insideQuotes = false;
let currentField = '';

for (let i = 0; i < csvContent.length; i++) {
  const char = csvContent[i];
  
  if (char === '"') {
    insideQuotes = !insideQuotes;
  } else if (char === ',' && !insideQuotes) {
    currentRecord.push(currentField.trim());
    currentField = '';
  } else if (char === '\n' && !insideQuotes) {
    currentRecord.push(currentField.trim());
    
    // Si es una línea completa (12 campos) y no es el header
    if (currentRecord.length === 12 && currentRecord[0] !== 'City') {
      const location = {
        city: currentRecord[0] || '',
        name: currentRecord[1] || '',
        address: currentRecord[2] || '',
        website: currentRecord[3] || '',
        phone: currentRecord[4] || '',
        schedule: currentRecord[5] || ''
      };
      
      if (location.name && location.schedule) {
        csvLocations.push(location);
      }
    }
    
    currentRecord = [];
    currentField = '';
  } else {
    currentField += char;
  }
}

// Procesar último registro si no termina con \n
if (currentRecord.length > 0) {
  currentRecord.push(currentField.trim());
  if (currentRecord.length === 12 && currentRecord[0] !== 'City') {
    const location = {
      city: currentRecord[0] || '',
      name: currentRecord[1] || '',
      address: currentRecord[2] || '',
      website: currentRecord[3] || '',
      phone: currentRecord[4] || '',
      schedule: currentRecord[5] || ''
    };
    
    if (location.name && location.schedule) {
      csvLocations.push(location);
    }
  }
}

console.log(`📊 CSV procesado: ${csvLocations.length} ubicaciones encontradas`);
console.log(`📊 JSON actual: ${healthData.length} ubicaciones\n`);

// Función para normalizar nombres para comparación
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, ' ')    // Normalizar espacios
    .trim();
}

// Función para normalizar direcciones para comparación
function normalizeAddress(address) {
  return address
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, ' ')    // Normalizar espacios
    .replace(/\b(street|st|avenue|ave|road|rd|drive|dr|boulevard|blvd)\b/g, '') // Remover abreviaciones de calles
    .trim();
}

// Actualizar horarios
let updatedCount = 0;
let notFoundCount = 0;

healthData.forEach((jsonLocation, index) => {
  // Buscar en CSV por nombre
  let csvMatch = csvLocations.find(csvLoc => {
    const jsonName = normalizeName(jsonLocation.name);
    const csvName = normalizeName(csvLoc.name);
    return jsonName === csvName;
  });
  
  // Si no encuentra por nombre, buscar por dirección
  if (!csvMatch) {
    csvMatch = csvLocations.find(csvLoc => {
      const jsonAddr = normalizeAddress(jsonLocation.address || '');
      const csvAddr = normalizeAddress(csvLoc.address || '');
      return jsonAddr && csvAddr && jsonAddr.includes(csvAddr.substring(0, 20));
    });
  }
  
  if (csvMatch && csvMatch.schedule) {
    const oldSchedule = jsonLocation.schedule;
    jsonLocation.schedule = csvMatch.schedule;
    console.log(`✅ ${index + 1}. ${jsonLocation.name}`);
    console.log(`   Antes: "${oldSchedule}"`);
    console.log(`   Después: "${csvMatch.schedule.substring(0, 100)}..."`);
    console.log('');
    updatedCount++;
  } else {
    console.log(`❌ ${index + 1}. ${jsonLocation.name} - No se encontró en CSV`);
    notFoundCount++;
  }
});

// Guardar el archivo JSON actualizado
fs.writeFileSync(jsonPath, JSON.stringify(healthData, null, 2), 'utf-8');

console.log('\n🎉 Actualización completada!');
console.log(`✅ Ubicaciones actualizadas: ${updatedCount}`);
console.log(`❌ Ubicaciones no encontradas: ${notFoundCount}`);
console.log(`📁 Archivo guardado: ${jsonPath}`);
