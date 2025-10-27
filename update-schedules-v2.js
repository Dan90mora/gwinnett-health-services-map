import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🕐 Iniciando actualización de horarios (versión simplificada)...\n');

// Leer el archivo JSON
const jsonPath = path.join(__dirname, 'src', 'data', 'gwinnett-health-data.json');
const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
const healthData = JSON.parse(jsonContent);

// Mapeo manual de horarios específicos basado en el CSV
const scheduleMap = {
  "Northeast Georgia Health System - Dacula": `Monday        8:00 AM - 8:00 PM
Tuesday        8:00 AM - 8:00 PM
Wednesday        8:00 AM - 8:00 PM
Thursday        8:00 AM - 8:00 PM
Friday                8:00 AM - 8:00 PM
Saturday        8:00 AM - 8:00 PM
Sunday	8:00 AM - 8:00 PM`,

  "Bethel Eyecare": `Monday	9:00 AM - 6:00 PM
Tuesday	9:00 AM - 6:00 PM
Wednesday	9:00 AM - 6:00 PM
Thursday	9:00 AM - 6:00 PM
Friday		9:00 AM - 6:00 PM
Saturday	10:00 AM - 3:00 PM`,

  "Elevate Your Life Professional Counseling and Coaching": `Monday        By Appointment 
Tuesday        By Appointment 
Wednesday        By Appointment 
Thursday        By Appointment 
Friday                By Appointment`,

  "MyEyeDr.": `Monday	9:00 AM - 6:00 PM
Tuesday	9:00 AM - 6:00 PM
Wednesday	9:00 AM - 6:00 PM
Thursday	9:00 AM - 6:00 PM
Friday		9:00 AM - 6:00 PM
Saturday	9:00 AM - 4:00 PM`,

  "EyeBelieve Eyecare & Optical": `Monday        10:00 AM - 5:00 PM
Tuesday        10:00 AM - 5:00 PM
Wednesday        10:00 AM - 5:00 PM
Thursday        10:00 AM - 5:00 PM
Friday                10:00 AM - 5:00 PM`,

  "AMA Dental Care": `Monday	9:00 AM - 5:00 PM
Tuesday	9:00 AM - 5:00 PM
Wednesday	9:00 AM - 5:00 PM
Thursday	9:00 AM - 5:00 PM
Friday		9:00 AM - 5:00 PM
Saturday	9:00 AM - 2:00 PM`
};

// Crear un script que lea el CSV línea por línea y extraiga los horarios
const csvPath = path.join(__dirname, 'public', 'Gwinnett Health Finder - Sheet1.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

console.log('📊 Procesando CSV para extraer horarios...\n');

// Función más simple para procesar el CSV
function extractSchedulesFromCSV(csvContent) {
  const schedules = {};
  const lines = csvContent.split('\n');
  
  let i = 1; // Saltar header
  while (i < lines.length) {
    const line = lines[i];
    
    // Si la línea empieza con comillas, es un nuevo registro
    if (line.startsWith('"') && line.includes('",')) {
      let fullRecord = line;
      let nextLineIndex = i + 1;
      
      // Seguir leyendo hasta encontrar una línea que no esté dentro de comillas
      while (nextLineIndex < lines.length) {
        const nextLine = lines[nextLineIndex];
        fullRecord += '\n' + nextLine;
        
        // Contar comillas para determinar si estamos fuera del campo
        const quoteCount = (fullRecord.match(/"/g) || []).length;
        
        // Si encontramos una línea que empieza con comillas o llegamos a una línea vacía seguida de otra con comillas
        if (nextLine.startsWith('"') && quoteCount % 2 === 0) {
          break;
        }
        
        nextLineIndex++;
      }
      
      // Procesar el registro completo
      const processRecord = (record) => {
        // Separar por comas, pero respetando las comillas
        const fields = [];
        let currentField = '';
        let insideQuotes = false;
        
        for (let j = 0; j < record.length; j++) {
          const char = record[j];
          
          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === ',' && !insideQuotes) {
            fields.push(currentField.trim());
            currentField = '';
          } else {
            currentField += char;
          }
        }
        fields.push(currentField.trim()); // Último campo
        
        if (fields.length >= 6) {
          const name = fields[1].replace(/"/g, '').trim();
          const schedule = fields[5].replace(/"/g, '').trim();
          
          if (name && schedule && schedule !== '') {
            schedules[name] = schedule;
          }
        }
      };
      
      processRecord(fullRecord);
      i = nextLineIndex;
    } else {
      i++;
    }
  }
  
  return schedules;
}

const extractedSchedules = extractSchedulesFromCSV(csvContent);

console.log(`📊 Horarios extraídos: ${Object.keys(extractedSchedules).length}`);
console.log('\nPrimeros 5 horarios extraídos:');
Object.entries(extractedSchedules).slice(0, 5).forEach(([name, schedule]) => {
  console.log(`- ${name}: ${schedule.substring(0, 50)}...`);
});
console.log('\n');

// Actualizar horarios en el JSON
let updatedCount = 0;
let notFoundCount = 0;

healthData.forEach((jsonLocation, index) => {
  const locationName = jsonLocation.name;
  
  if (extractedSchedules[locationName]) {
    const oldSchedule = jsonLocation.schedule;
    jsonLocation.schedule = extractedSchedules[locationName];
    
    console.log(`✅ ${index + 1}. ${locationName}`);
    console.log(`   Antes: "${oldSchedule}"`);
    console.log(`   Después: "${extractedSchedules[locationName].substring(0, 80)}${extractedSchedules[locationName].length > 80 ? '...' : ''}"`);
    console.log('');
    updatedCount++;
  } else {
    console.log(`❌ ${index + 1}. ${locationName} - No se encontró horario en CSV`);
    notFoundCount++;
  }
});

// Guardar el archivo JSON actualizado
fs.writeFileSync(jsonPath, JSON.stringify(healthData, null, 2), 'utf-8');

console.log('\n🎉 Actualización completada!');
console.log(`✅ Ubicaciones actualizadas: ${updatedCount}`);
console.log(`❌ Ubicaciones no encontradas: ${notFoundCount}`);
console.log(`📁 Archivo guardado: ${jsonPath}`);
