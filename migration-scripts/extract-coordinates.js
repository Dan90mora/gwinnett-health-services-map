import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para extraer coordenadas de URLs de Google Maps
function extractCoordinatesFromGoogleMapsUrl(url) {
    if (!url) return null;
    
    try {
        // Patrón para URLs de Google Maps con coordenadas explícitas
        const coordRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = url.match(coordRegex);
        
        if (match) {
            const lat = parseFloat(match[1]);
            const lng = parseFloat(match[2]);
            return [lng, lat]; // OpenLayers usa [longitude, latitude]
        }
        
        // Si no hay coordenadas explícitas, necesitaremos geocodificar la dirección
        return null;
    } catch (error) {
        console.error('Error procesando URL:', url, error);
        return null;
    }
}

// Función principal para extraer y actualizar coordenadas
async function extractAllCoordinates() {
    try {
        // Leer el archivo de datos
        const dataPath = path.join(__dirname, 'src', 'data', 'gwinnett-health-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const locations = JSON.parse(rawData);
        
        console.log('🔄 Iniciando extracción de coordenadas...\n');
        
        let updatedCount = 0;
        let totalWithoutCoords = 0;
        
        // Procesar cada ubicación sin coordenadas
        for (let i = 0; i < locations.length; i++) {
            const location = locations[i];
            
            // Solo procesar ubicaciones sin coordenadas
            if (!location.coordinates) {
                totalWithoutCoords++;
                
                // Intentar extraer de URL de Google Maps si existe
                let coords = null;
                
                // Buscar en varias propiedades que podrían contener URLs
                const urlFields = ['website', 'googleMapsUrl', 'url'];
                for (const field of urlFields) {
                    if (location[field] && location[field].includes('google.com/maps')) {
                        coords = extractCoordinatesFromGoogleMapsUrl(location[field]);
                        if (coords) break;
                    }
                }
                
                // Si no encontramos coordenadas en URLs existentes, crear URL de búsqueda y mostrar
                if (!coords && location.address) {
                    const searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
                    console.log(`📍 ${location.name}`);
                    console.log(`   📧 ${location.address}`);
                    console.log(`   🌐 ${searchUrl}`);
                    console.log(`   ⚠️  Necesita coordenadas manuales\n`);
                } else if (coords) {
                    locations[i].coordinates = coords;
                    updatedCount++;
                    console.log(`✅ ${location.name}: [${coords[0]}, ${coords[1]}]`);
                }
            }
        }
        
        // Guardar cambios si hay actualizaciones
        if (updatedCount > 0) {
            fs.writeFileSync(dataPath, JSON.stringify(locations, null, 2));
            console.log(`\n🎉 Actualizadas ${updatedCount} ubicaciones con coordenadas.`);
        }
        
        console.log(`\n📊 RESUMEN:`);
        console.log(`   Total procesadas: ${totalWithoutCoords}`);
        console.log(`   Actualizadas automáticamente: ${updatedCount}`);
        console.log(`   Requieren coordenadas manuales: ${totalWithoutCoords - updatedCount}`);
        
        return locations;
        
    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    extractAllCoordinates()
        .then(() => console.log('\n✅ Proceso completado'))
        .catch(err => console.error('\n❌ Error en el proceso:', err));
}

export { extractAllCoordinates, extractCoordinatesFromGoogleMapsUrl };
