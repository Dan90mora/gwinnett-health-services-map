console.log('=== DIAGNÓSTICO DE COORDENADAS SUWANEE ===');

// Simular el proceso que hace MapComponent
const cityCoordinates = {
  'Lawrenceville': [-84.0016, 33.9562],
  'Duluth': [-84.1447, 34.0028],
  'Suwanee': [-84.0713, 34.0518],
  'Dacula': [-83.9079, 34.0042]
};

// Las 4 ubicaciones de Suwanee
const suwaneeLocations = [
  {
    id: 5,
    name: "EyeBelieve Eyecare & Optical",
    address: "1295 Old Peachtree Rd. NW #160, Suwanee, GA, 30024",
    city: "Suwanee",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=1295%20Old%20Peachtree%20Rd.%20NW%20%23160%2C%20Suwanee%2C%20GA%2C%2030024"
  },
  {
    id: 6,
    name: "Suwanee Family Dentistry",
    address: "2566 Lawrenceville-Suwanee Rd, Suwanee, GA, 30024",
    city: "Suwanee",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=2566%20Lawrenceville-Suwanee%20Rd%2C%20Suwanee%2C%20GA%2C%2030024"
  },
  {
    id: 7,
    name: "U & M Family Eyecare",
    address: "2014 Lawrenceville-Suwanee Rd, Suwanee, GA, 30024",
    city: "Suwanee",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=2014%20Lawrenceville-Suwanee%20Rd%2C%20Suwanee%2C%20GA%2C%2030024"
  },
  {
    id: 8,
    name: "Autumn Leaves Sugarloaf-Assisted Living",
    address: "1475 Satellite Blvd., Suwanee, GA, 30024",
    city: "Suwanee",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=1475%20Satellite%20Blvd.%2C%20Suwanee%2C%20GA%2C%2030024"
  }
];

console.log(`Total ubicaciones: ${suwaneeLocations.length}`);
console.log('');

// Probar el proceso que hace MapComponent
suwaneeLocations.forEach((location, index) => {
  console.log(`${index + 1}. ${location.name}`);
  
  // Paso 1: Intentar extraer coordenadas de Google Maps URL
  let coordinates = null;
  // Las URLs son de tipo search, no contienen coordenadas explícitas
  
  // Paso 2: Si no hay coordenadas, usar geocoding por ciudad
  if (!coordinates && location.address) {
    // Buscar coordenadas por ciudad
    for (const [cityName, coords] of Object.entries(cityCoordinates)) {
      if (location.city && location.city.toLowerCase().includes(cityName.toLowerCase())) {
        coordinates = coords;
        break;
      }
      if (location.address && location.address.toLowerCase().includes(cityName.toLowerCase())) {
        coordinates = coords;
        break;
      }
    }
  }
  
  console.log(`   Coordenadas: ${coordinates ? `[${coordinates[0]}, ${coordinates[1]}]` : 'null'}`);
  console.log(`   ✅ Debería crear marcador: ${coordinates ? 'SÍ' : 'NO'}`);
  console.log('');
});

console.log('=== CONCLUSIÓN ===');
console.log('Todas las ubicaciones de Suwanee deberían tener coordenadas y crear marcadores.');
console.log('Si solo aparecen 2 marcadores, el problema puede estar en:');
console.log('1. El filtrado de ubicaciones');
console.log('2. La lógica de procesamiento en MapComponent');
console.log('3. Coordenadas duplicadas que se superponen');
