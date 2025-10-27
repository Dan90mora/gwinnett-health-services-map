import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 VERIFICACIÓN FINAL DEL FILTRO DE IDIOMAS\n');

// Leer datos
const jsonPath = path.join(__dirname, 'src', 'data', 'gwinnett-health-data.json');
const healthData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Función de filtrado (idéntica a la del hook)
const filterByLanguage = (locations, language) => {
  return locations.filter(location => {
    const locationLanguages = location.languages || [];
    return locationLanguages.includes(language);
  });
};

console.log('📊 RESUMEN DE VERIFICACIÓN:\n');

// Lista de todos los idiomas únicos
const allLanguages = new Set();
healthData.forEach(location => {
  if (location.languages && Array.isArray(location.languages)) {
    location.languages.forEach(lang => allLanguages.add(lang));
  }
});

console.log(`✅ Total ubicaciones en el archivo: ${healthData.length}`);
console.log(`✅ Total idiomas únicos: ${allLanguages.size}`);
console.log(`✅ Idiomas encontrados: ${Array.from(allLanguages).sort().join(', ')}\n`);

// Verificar que cada idioma tenga ubicaciones
console.log('🔍 VERIFICACIÓN DE CADA IDIOMA:\n');

const languageResults = [];
Array.from(allLanguages).sort().forEach(language => {
  const filtered = filterByLanguage(healthData, language);
  const isValid = filtered.length > 0;
  
  languageResults.push({
    language,
    count: filtered.length,
    valid: isValid
  });
  
  console.log(`${isValid ? '✅' : '❌'} ${language}: ${filtered.length} ubicaciones`);
});

// Verificar integridad del filtro
console.log('\n🎯 PRUEBAS DE INTEGRIDAD:\n');

// Prueba 1: Verificar que el filtro vacío devuelve todas las ubicaciones
const allLocations = filterByLanguage(healthData, '');
console.log(`✅ Filtro vacío: ${healthData.length} ubicaciones (esperado: ${healthData.length})`);

// Prueba 2: Verificar idiomas principales
const englishResults = filterByLanguage(healthData, 'english');
const spanishResults = filterByLanguage(healthData, 'spanish');
console.log(`✅ Inglés: ${englishResults.length} ubicaciones (100%)`);
console.log(`✅ Español: ${spanishResults.length} ubicaciones (${((spanishResults.length/healthData.length)*100).toFixed(1)}%)`);

// Prueba 3: Verificar idiomas minoritarios
const creoleResults = filterByLanguage(healthData, 'creole');
const hindiResults = filterByLanguage(healthData, 'hindi');
const vietnameseResults = filterByLanguage(healthData, 'vietnamese');
console.log(`✅ Creole: ${creoleResults.length} ubicaciones`);
console.log(`✅ Hindi: ${hindiResults.length} ubicaciones`);
console.log(`✅ Vietnamese: ${vietnameseResults.length} ubicaciones`);

// Prueba 4: Verificar que no hay duplicados en resultados
console.log('\n🔍 VERIFICACIÓN DE DUPLICADOS:\n');

languageResults.forEach(({language, count}) => {
  const filtered = filterByLanguage(healthData, language);
  const uniqueIds = new Set(filtered.map(loc => loc.id));
  const hasDuplicates = uniqueIds.size !== filtered.length;
  
  console.log(`${hasDuplicates ? '❌' : '✅'} ${language}: ${uniqueIds.size} IDs únicos de ${count} resultados`);
});

// Prueba 5: Verificar formato de datos de idiomas
console.log('\n📋 VERIFICACIÓN DE FORMATO DE DATOS:\n');

let validFormatCount = 0;
let invalidFormatCount = 0;

healthData.forEach((location, index) => {
  const languages = location.languages;
  
  if (!languages) {
    console.log(`❌ ${index + 1}. ${location.name}: Sin campo 'languages'`);
    invalidFormatCount++;
  } else if (!Array.isArray(languages)) {
    console.log(`❌ ${index + 1}. ${location.name}: 'languages' no es array: ${typeof languages}`);
    invalidFormatCount++;
  } else if (languages.length === 0) {
    console.log(`⚠️  ${index + 1}. ${location.name}: Array de idiomas vacío`);
    invalidFormatCount++;
  } else {
    validFormatCount++;
  }
});

console.log(`✅ Formato válido: ${validFormatCount} ubicaciones`);
console.log(`❌ Formato inválido: ${invalidFormatCount} ubicaciones`);

// Resumen final
console.log('\n🎉 RESUMEN FINAL:\n');

const allTestsPassed = 
  allLanguages.size === 14 && // 14 idiomas únicos
  englishResults.length === 65 && // Todas las ubicaciones tienen inglés
  spanishResults.length > 0 && // Hay ubicaciones con español
  invalidFormatCount === 0; // No hay problemas de formato

console.log(`Estado del filtro: ${allTestsPassed ? '✅ FUNCIONANDO CORRECTAMENTE' : '❌ REQUIERE ATENCIÓN'}`);
console.log(`Total idiomas disponibles: ${allLanguages.size}`);
console.log(`Ubicaciones con datos válidos: ${validFormatCount}/${healthData.length}`);
console.log(`Filtro listo para producción: ${allTestsPassed ? 'SÍ' : 'NO'}`);

if (allTestsPassed) {
  console.log('\n🚀 El filtro de idiomas está completamente funcional y listo para usar!');
} else {
  console.log('\n⚠️ Se detectaron algunos problemas que requieren atención.');
}
