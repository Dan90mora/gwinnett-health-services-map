// Script para migrar CSV a JSON
const fs = require('fs');

// Leer CSV y procesar línea por línea
const csvContent = fs.readFileSync('./public/Gwinnett Health Finder - Sheet1.csv', 'utf8');
const lines = csvContent.split('\n');
const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

console.log('Headers:', headers);

// Funciones de procesamiento
const cleanText = (text) => {
  if (!text) return '';
  return text.toString().trim().replace(/\s+/g, ' ');
};

const extractCityFromAddress = (cityOrAddress) => {
  if (!cityOrAddress) return '';
  
  const cleaned = cleanText(cityOrAddress);
  
  if (cleaned.includes(',')) {
    const parts = cleaned.split(',');
    const cityPart = parts[0].trim();
    if (cityPart.includes(' GA')) {
      return cityPart.replace(' GA', '').trim();
    }
    return cityPart;
  }
  
  const cityPattern = /(Lawrenceville|Duluth|Suwanee|Dacula|Norcross|Tucker|Atlanta|Buford|Sugar Hill)/i;
  const match = cleaned.match(cityPattern);
  
  return match ? match[1] : cleaned;
};

const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.toString().replace(/[^\d\-\(\)\.\s]/g, '').trim();
};

const parseSchedule = (scheduleText) => {
  if (!scheduleText) return 'No especificado';
  
  const text = scheduleText.toLowerCase();
  
  if (text.includes('appointment')) return 'Por cita';
  if (text.includes('24') || text.includes('24/7')) return '24h';
  if (text.includes('8:00') && text.includes('8:00')) return 'morning';
  if (text.includes('9:00') || text.includes('10:00')) return 'morning';
  if (text.includes('12:00') || text.includes('1:00') || text.includes('2:00')) return 'afternoon';
  if (text.includes('6:00') || text.includes('7:00') || text.includes('8:00')) return 'evening';
  
  return 'Horario variable';
};

const parseLanguages = (languageText) => {
  if (!languageText) return ['english'];
  
  const text = languageText.toLowerCase();
  const languages = [];
  
  if (text.includes('english')) languages.push('english');
  if (text.includes('spanish') || text.includes('español')) languages.push('spanish');
  
  return languages.length > 0 ? languages : ['english'];
};

const parseServices = (servicesText) => {
  if (!servicesText) return [];
  
  return servicesText
    .split(',')
    .map(service => cleanText(service))
    .filter(service => service.length > 0);
};

const categorizeServiceType = (servicesText) => {
  if (!servicesText) return 'other';
  
  const text = servicesText.toLowerCase();
  
  if (text.includes('dental') || text.includes('teeth')) return 'dental';
  if (text.includes('vision') || text.includes('eye') || text.includes('optical')) return 'vision';
  if (text.includes('mental') || text.includes('counseling') || text.includes('behavioral')) return 'mental_health';
  if (text.includes('medical') || text.includes('health') || text.includes('clinic')) return 'medical';
  if (text.includes('pharmacy') || text.includes('medication')) return 'pharmacy';
  
  return 'medical';
};

const parsePaymentMethods = (paymentText) => {
  if (!paymentText) return [];
  
  const text = paymentText.toLowerCase();
  const methods = [];
  
  if (text.includes('medicaid')) methods.push('medicaid');
  if (text.includes('medicare')) methods.push('medicare');
  if (text.includes('self pay') || text.includes('cash')) methods.push('cash');
  if (text.includes('insurance')) methods.push('insurance');
  if (text.includes('sliding scale')) methods.push('sliding_scale');
  if (text.includes('peachcare')) methods.push('peachcare');
  if (text.includes('uninsured')) methods.push('uninsured_programs');
  
  return methods;
};

const generateGoogleMapsUrl = (address) => {
  if (!address) return '';
  
  const encodedAddress = encodeURIComponent(cleanText(address));
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
};

// Procesar primera línea para verificar
console.log('Procesando CSV...');
console.log('Total líneas:', lines.length);

// Crear datos de ejemplo para verificar el formato
const sampleData = [
  {
    id: 1,
    name: "Northeast Georgia Health System - Dacula",
    address: "852 Dacula Rd., Dacula, GA, 30019",
    city: "Dacula",
    website: "https://www.nghs.com/",
    phone: "770-848-9380",
    schedule: "morning",
    languages: ["english", "spanish"],
    services: ["Bariatric Weight Loss", "Behavioral Health", "Cancer", "Diabetes"],
    serviceType: "medical",
    paymentMethods: ["medicaid", "medicare", "cash"],
    serviceArea: "",
    requirements: "",
    other: "",
    coordinates: null,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=852%20Dacula%20Rd.%2C%20Dacula%2C%20GA%2C%2030019"
  },
  {
    id: 2,
    name: "Bethel Eyecare",
    address: "2148 Duluth Hwy., #102, Duluth, GA, 30097",
    city: "Duluth",
    website: "https://www.betheleyegroup.com/",
    phone: "770-817-3990",
    schedule: "morning",
    languages: ["english"],
    services: ["Vision care", "Eye exams"],
    serviceType: "vision",
    paymentMethods: ["medicaid", "medicare", "peachcare", "cash"],
    serviceArea: "",
    requirements: "",
    other: "",
    coordinates: null,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=2148%20Duluth%20Hwy.%2C%20%23102%2C%20Duluth%2C%20GA%2C%2030097"
  }
];

// Guardar JSON de ejemplo
fs.writeFileSync('./src/data/gwinnett-health-data.json', JSON.stringify(sampleData, null, 2));
console.log('Archivo JSON de ejemplo creado exitosamente');
