// Datos de ejemplo para testing - Será reemplazado por datos del CSV
export const mockLocations = [
  {
    id: 1,
    name: "Centro Médico Hispano",
    address: "123 Main St, Atlanta, GA 30309",
    city: "atlanta",
    googleMapsUrl: "https://maps.google.com/maps?q=33.7490,-84.3880",
    schedule: "morning",
    languages: ["spanish", "english"],
    serviceType: "medical",
    paymentMethods: ["cash", "credit_card", "insurance"],
    phone: "(404) 555-0123",
    description: "Centro médico especializado en atención bilingüe"
  },
  {
    id: 2,
    name: "Consultoría Legal González",
    address: "456 Oak Ave, Lawrenceville, GA 30046",
    city: "lawrenceville",
    googleMapsUrl: "https://maps.google.com/maps?q=33.9562,-84.0016",
    schedule: "afternoon",
    languages: ["spanish"],
    serviceType: "legal",
    paymentMethods: ["cash", "credit_card"],
    phone: "(770) 555-0456",
    description: "Servicios legales en español para la comunidad hispana"
  },
  {
    id: 3,
    name: "Financial Services Plus",
    address: "789 Pine St, Duluth, GA 30096",
    city: "duluth",
    googleMapsUrl: "https://maps.google.com/maps?q=34.0028,-84.1447",
    schedule: "24h",
    languages: ["english"],
    serviceType: "financial",
    paymentMethods: ["credit_card", "debit_card"],
    phone: "(678) 555-0789",
    description: "Servicios financieros y asesoría económica"
  },
  {
    id: 4,
    name: "Escuela Bilingüe Esperanza",
    address: "321 Elm St, Norcross, GA 30071",
    city: "norcross",
    googleMapsUrl: "https://maps.google.com/maps?q=33.9412,-84.2135",
    schedule: "morning",
    languages: ["spanish", "english"],
    serviceType: "educational",
    paymentMethods: ["cash", "credit_card", "medicaid"],
    phone: "(770) 555-0321",
    description: "Educación bilingüe para niños y adultos"
  },
  {
    id: 5,
    name: "Centro Social La Comunidad",
    address: "654 Maple Dr, Tucker, GA 30084",
    city: "tucker",
    googleMapsUrl: "https://maps.google.com/maps?q=33.8515,-84.2197",
    schedule: "evening",
    languages: ["spanish"],
    serviceType: "social",
    paymentMethods: ["cash", "medicare", "medicaid"],
    phone: "(404) 555-0654",
    description: "Servicios sociales y apoyo comunitario"
  },
  {
    id: 6,
    name: "Clínica Familiar Atlanta",
    address: "987 Cedar Ln, Atlanta, GA 30318",
    city: "atlanta",
    googleMapsUrl: "https://maps.google.com/maps?q=33.7849,-84.4020",
    schedule: "afternoon",
    languages: ["spanish", "english"],
    serviceType: "medical",
    paymentMethods: ["insurance", "medicaid", "medicare", "cash"],
    phone: "(404) 555-0987",
    description: "Atención médica familiar con personal bilingüe"
  }
];

/**
 * Simula una llamada API para obtener ubicaciones
 * @returns {Promise<Array>} Promise que resuelve con array de ubicaciones
 */
export const fetchLocations = async () => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockLocations;
};

/**
 * Simula procesamiento de archivo CSV
 * @param {File} csvFile - Archivo CSV
 * @returns {Promise<Array>} Promise que resuelve con ubicaciones procesadas
 */
export const processCsvFile = async (csvFile) => {
  // Esta función será implementada cuando tengas el CSV real
  console.log('Procesando archivo CSV:', csvFile.name);
  
  // Por ahora retorna datos mock
  await new Promise(resolve => setTimeout(resolve, 2000));
  return mockLocations;
};

/**
 * Obtiene opciones únicas para un campo específico de las ubicaciones
 * @param {Array} locations - Array de ubicaciones
 * @param {string} field - Campo a extraer opciones
 * @returns {Array} Array de opciones únicas
 */
export const getUniqueFieldValues = (locations, field) => {
  if (!locations || !Array.isArray(locations)) return [];
  
  const values = locations
    .map(location => location[field])
    .filter(value => value != null && value !== '')
    .reduce((unique, value) => {
      if (Array.isArray(value)) {
        value.forEach(v => {
          if (!unique.includes(v)) unique.push(v);
        });
      } else if (!unique.includes(value)) {
        unique.push(value);
      }
      return unique;
    }, []);
    
  return values.sort();
};
