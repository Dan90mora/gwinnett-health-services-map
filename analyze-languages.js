import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🗣️ Analizando idiomas disponibles en el archivo JSON...\n');

// Leer el archivo JSON
const jsonPath = path.join(__dirname, 'src', 'data', 'gwinnett-health-data.json');
const healthData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

console.log(`📊 Total ubicaciones: ${healthData.length}\n`);

// Extraer todos los idiomas únicos
const allLanguages = new Set();
const languageStats = {};
let locationsWithLanguages = 0;
let locationsWithoutLanguages = 0;

healthData.forEach((location, index) => {
  if (location.languages && Array.isArray(location.languages) && location.languages.length > 0) {
    locationsWithLanguages++;
    location.languages.forEach(language => {
      if (language && typeof language === 'string' && language.trim() !== '') {
        const cleanLanguage = language.trim().toLowerCase();
        allLanguages.add(cleanLanguage);
        languageStats[cleanLanguage] = (languageStats[cleanLanguage] || 0) + 1;
      }
    });
  } else {
    locationsWithoutLanguages++;
    console.log(`⚠️  ${index + 1}. ${location.name} - Sin idiomas definidos`);
  }
});

console.log(`\n📈 Estadísticas:`);
console.log(`✅ Ubicaciones con idiomas: ${locationsWithLanguages}`);
console.log(`❌ Ubicaciones sin idiomas: ${locationsWithoutLanguages}`);
console.log(`🗣️ Total idiomas únicos encontrados: ${allLanguages.size}\n`);

console.log('📋 Lista de idiomas disponibles:');
const sortedLanguages = Array.from(allLanguages).sort();
sortedLanguages.forEach((language, index) => {
  const count = languageStats[language];
  const percentage = ((count / healthData.length) * 100).toFixed(1);
  console.log(`${index + 1}. "${language}" - ${count} ubicaciones (${percentage}%)`);
});

console.log('\n🎯 Opciones sugeridas para el filtro:');
sortedLanguages.forEach(language => {
  // Capitalizar primera letra para mostrar en la UI
  const displayName = language.charAt(0).toUpperCase() + language.slice(1);
  console.log(`{ value: '${language}', label: '${displayName}' },`);
});

// Verificar si hay patrones o problemas en los datos
console.log('\n🔍 Análisis adicional:');

// Buscar combinaciones de idiomas más comunes
const languageCombinations = {};
healthData.forEach(location => {
  if (location.languages && Array.isArray(location.languages) && location.languages.length > 0) {
    const combo = location.languages.map(lang => lang.trim().toLowerCase()).sort().join(' + ');
    languageCombinations[combo] = (languageCombinations[combo] || 0) + 1;
  }
});

console.log('\nCombinaciones de idiomas más comunes:');
Object.entries(languageCombinations)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .forEach(([combo, count]) => {
    console.log(`"${combo}": ${count} ubicaciones`);
  });

// Exportar para uso en el código
const languageOptions = sortedLanguages.map(language => ({
  value: language,
  label: language.charAt(0).toUpperCase() + language.slice(1)
}));

console.log('\n💾 Guardando opciones de idiomas para el código...');
const outputPath = path.join(__dirname, 'extracted-language-options.json');
fs.writeFileSync(outputPath, JSON.stringify({
  languages: sortedLanguages,
  languageOptions: languageOptions,
  statistics: languageStats,
  total: healthData.length,
  withLanguages: locationsWithLanguages,
  withoutLanguages: locationsWithoutLanguages
}, null, 2));

console.log(`📁 Archivo guardado: ${outputPath}`);
