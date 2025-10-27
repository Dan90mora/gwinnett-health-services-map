import fs from 'fs';
import path from 'path';

// Leer el archivo JSON
const dataPath = path.join(process.cwd(), 'src', 'data', 'gwinnett-health-data.json');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const locations = JSON.parse(rawData);

console.log('🔍 ANALIZANDO MÉTODOS DE PAGO EN GWINNETT HEALTH DATA');
console.log('================================================\n');

// Set para almacenar métodos de pago únicos
const paymentMethodsSet = new Set();
const paymentMethodCounts = {};

// Estadísticas
let locationsWithPayments = 0;
let locationsWithoutPayments = 0;

// Analizar cada localidad
locations.forEach((location, index) => {
  if (location.paymentMethods && Array.isArray(location.paymentMethods) && location.paymentMethods.length > 0) {
    locationsWithPayments++;
    
    location.paymentMethods.forEach(method => {
      if (method && method.trim()) {
        const cleanMethod = method.trim().toLowerCase();
        paymentMethodsSet.add(cleanMethod);
        
        // Contar ocurrencias
        if (!paymentMethodCounts[cleanMethod]) {
          paymentMethodCounts[cleanMethod] = 0;
        }
        paymentMethodCounts[cleanMethod]++;
      }
    });
  } else {
    locationsWithoutPayments++;
    console.log(`⚠️  Sin métodos de pago: ${location.name} (ID: ${location.id})`);
  }
});

console.log('\n📊 ESTADÍSTICAS GENERALES:');
console.log(`Total de localidades: ${locations.length}`);
console.log(`Con métodos de pago: ${locationsWithPayments}`);
console.log(`Sin métodos de pago: ${locationsWithoutPayments}`);

console.log('\n💳 MÉTODOS DE PAGO ENCONTRADOS:');
console.log('================================');

// Convertir a array y ordenar por frecuencia
const sortedPaymentMethods = Object.entries(paymentMethodCounts)
  .sort(([,a], [,b]) => b - a);

sortedPaymentMethods.forEach(([method, count], index) => {
  console.log(`${index + 1}. "${method}" - ${count} localidades`);
});

console.log('\n🔧 ARRAY PARA CONSTANTS.JS:');
console.log('===========================');
const paymentMethodsArray = sortedPaymentMethods.map(([method]) => method);
console.log('export const PAYMENT_METHOD_OPTIONS = [');
console.log('  { value: "any", label: "Cualquier método de pago", count: ' + locationsWithPayments + ' },');
paymentMethodsArray.forEach(method => {
  const displayName = method
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  console.log(`  { value: "${method}", label: "${displayName}", count: ${paymentMethodCounts[method]} },`);
});
console.log('];');

console.log('\n📋 EJEMPLOS DE DATOS:');
console.log('====================');
// Mostrar algunos ejemplos
locations.slice(0, 5).forEach(location => {
  if (location.paymentMethods && location.paymentMethods.length > 0) {
    console.log(`${location.name}:`);
    console.log(`  Métodos: [${location.paymentMethods.join(', ')}]`);
  }
});

// Guardar resultados en JSON
const results = {
  totalLocations: locations.length,
  locationsWithPayments,
  locationsWithoutPayments,
  uniquePaymentMethods: paymentMethodsArray.length,
  paymentMethods: sortedPaymentMethods.map(([method, count]) => ({
    method,
    count,
    displayName: method
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }))
};

fs.writeFileSync('payment-methods-analysis.json', JSON.stringify(results, null, 2));
console.log('\n✅ Análisis guardado en: payment-methods-analysis.json');
