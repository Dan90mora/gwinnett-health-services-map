// Configuración por defecto del mapa
export const DEFAULT_MAP_CONFIG = {
  // Atlanta, Georgia como centro por defecto
  center: [-84.3880, 33.7490], // [longitude, latitude]
  zoom: 11,
  minZoom: 3,
  maxZoom: 19
};

// Configuración de controles
export const MAP_CONTROLS_CONFIG = {
  fullScreen: true,
  scaleLine: true,
  zoom: true,
  attribution: true
};

// Configuración de estilos de marcadores
export const MARKER_STYLES = {
  default: '#FF4444',
  selected: '#FF8800',
  filtered: '#44FF44',
  inactive: '#CCCCCC'
};

// Configuración de popups
export const POPUP_CONFIG = {
  positioning: 'bottom-center',
  stopEvent: false,
  offset: [0, -10]
};

// Tipos de filtros disponibles
export const FILTER_TYPES = {
  CITY: 'city',
  SCHEDULE: 'schedule', 
  LANGUAGE: 'language',
  SERVICE_TYPE: 'serviceType',
  PAYMENT_METHODS: 'paymentMethods'
};

// Opciones de idioma (extraídas del archivo JSON real)
export const LANGUAGE_OPTIONS = {
  CREOLE: 'creole',
  ENGLISH: 'english',
  FARSI: 'farsi',
  FRENCH: 'french',
  GUJARATI: 'gujarati',
  HEBREW: 'hebrew',
  HINDI: 'hindi',
  PORTUGUESE: 'portuguese',
  PUNJABI: 'punjabi',
  RUSSIAN: 'russian',
  SPANISH: 'spanish',
  TURKISH: 'turkish',
  URDU: 'urdu',
  VIETNAMESE: 'vietnamese'
};

// Lista de opciones para el filtro de idiomas ordenada por frecuencia
export const LANGUAGE_FILTER_OPTIONS = [
  { value: '', label: 'Any language' },
  { value: LANGUAGE_OPTIONS.ENGLISH, label: 'English (65 locations)' },
  { value: LANGUAGE_OPTIONS.SPANISH, label: 'Español (34 locations)' },
  { value: LANGUAGE_OPTIONS.CREOLE, label: 'Creole (6 locations)' },
  { value: LANGUAGE_OPTIONS.FRENCH, label: 'Français (5 locations)' },
  { value: LANGUAGE_OPTIONS.HINDI, label: 'Hindi (4 locations)' },
  { value: LANGUAGE_OPTIONS.VIETNAMESE, label: 'Tiếng Việt (3 locations)' },
  { value: LANGUAGE_OPTIONS.FARSI, label: 'فارسی (2 locations)' },
  { value: LANGUAGE_OPTIONS.GUJARATI, label: 'Gujarati (1 location)' },
  { value: LANGUAGE_OPTIONS.HEBREW, label: 'עברית (1 location)' },
  { value: LANGUAGE_OPTIONS.PORTUGUESE, label: 'Português (1 location)' },
  { value: LANGUAGE_OPTIONS.PUNJABI, label: 'ਪੰਜਾਬੀ (1 location)' },
  { value: LANGUAGE_OPTIONS.RUSSIAN, label: 'Русский (1 location)' },
  { value: LANGUAGE_OPTIONS.TURKISH, label: 'Türkçe (1 location)' },
  { value: LANGUAGE_OPTIONS.URDU, label: 'اردو (1 location)' }
];

// Categorías de servicios (extraídas del archivo JSON real)
export const SERVICE_CATEGORIES = {
  PRIMARY_CARE: 'atencion_primaria',
  DENTAL: 'servicios_dentales', 
  VISION: 'cuidado_visual',
  MENTAL_HEALTH: 'salud_mental',
  EMERGENCY: 'servicios_de_emergencia',
  WOMEN_HEALTH: 'salud_de_la_mujer',
  PEDIATRICS: 'pediatria',
  LAB_DIAGNOSTIC: 'laboratorio_y_diagnostico',
  SPECIALIZED: 'servicios_especializados',
  IMMUNIZATIONS: 'inmunizaciones_y_vacunas',
  PHARMACY: 'farmacia',
  OTHER: 'otros_servicios'
};

// Lista de opciones para el filtro de servicios ordenada por frecuencia
export const SERVICE_FILTER_OPTIONS = [
  { value: '', label: 'All services' },
  { value: SERVICE_CATEGORIES.VISION, label: 'Vision Care (35 locations)' },
  { value: SERVICE_CATEGORIES.LAB_DIAGNOSTIC, label: 'Laboratory & Diagnostics (32 locations)' },
  { value: SERVICE_CATEGORIES.WOMEN_HEALTH, label: 'Women\'s Health (27 locations)' },
  { value: SERVICE_CATEGORIES.MENTAL_HEALTH, label: 'Mental Health (25 locations)' },
  { value: SERVICE_CATEGORIES.DENTAL, label: 'Dental Services (21 locations)' },
  { value: SERVICE_CATEGORIES.PEDIATRICS, label: 'Pediatrics (21 locations)' },
  { value: SERVICE_CATEGORIES.PRIMARY_CARE, label: 'Primary Care (14 locations)' },
  { value: SERVICE_CATEGORIES.SPECIALIZED, label: 'Specialized Services (12 locations)' },
  { value: SERVICE_CATEGORIES.EMERGENCY, label: 'Emergency Services (10 locations)' },
  { value: SERVICE_CATEGORIES.IMMUNIZATIONS, label: 'Immunizations & Vaccines (8 locations)' },
  { value: SERVICE_CATEGORIES.PHARMACY, label: 'Pharmacy (8 locations)' },
  { value: SERVICE_CATEGORIES.OTHER, label: 'Other Services (146 locations)' }
];

// Métodos de pago encontrados en el archivo JSON
export const PAYMENT_METHODS = {
  CASH: 'cash',
  MEDICAID: 'medicaid',
  MEDICARE: 'medicare',
  UNINSURED_PROGRAMS: 'uninsured_programs',
  SLIDING_SCALE: 'sliding_scale',
  PEACHCARE: 'peachcare',
  INSURANCE: 'insurance'
};

// Lista de opciones para el filtro de métodos de pago ordenada por frecuencia
export const PAYMENT_METHOD_OPTIONS = [
  { value: '', label: 'Any payment method' },
  { value: PAYMENT_METHODS.CASH, label: 'Cash (49 locations)' },
  { value: PAYMENT_METHODS.MEDICAID, label: 'Medicaid (32 locations)' },
  { value: PAYMENT_METHODS.MEDICARE, label: 'Medicare (30 locations)' },
  { value: PAYMENT_METHODS.UNINSURED_PROGRAMS, label: 'Uninsured Programs (18 locations)' },
  { value: PAYMENT_METHODS.SLIDING_SCALE, label: 'Sliding Scale (13 locations)' },
  { value: PAYMENT_METHODS.PEACHCARE, label: 'PeachCare (12 locations)' },
  { value: PAYMENT_METHODS.INSURANCE, label: 'Insurance (1 location)' }
];

// Opciones de horarios para el filtro
export const SCHEDULE_OPTIONS = {
  MORNING: 'morning', // 6:00 AM - 12:00 PM
  AFTERNOON: 'afternoon', // 12:00 PM - 6:00 PM
  EVENING: 'evening', // 6:00 PM - 10:00 PM
  EXTENDED: 'extended', // Horarios extendidos (más de 12 horas)
  WEEKENDS: 'weekends', // Incluye sábados y/o domingos
  APPOINTMENT: 'appointment', // Solo por cita
  TWENTY_FOUR_SEVEN: '24_7' // 24 horas / 7 días
};

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  duration: 300,
  easing: 'ease-out'
};
