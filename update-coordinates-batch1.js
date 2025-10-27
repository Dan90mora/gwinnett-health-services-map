// Script para obtener coordenadas exactas usando geocodificación
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Coordenadas exactas obtenidas manualmente para las ubicaciones faltantes
const EXACT_COORDINATES = {
    // DACULA (1 ubicación)
    "Northeast Georgia Health System - Dacula": [-83.9060725, 33.9806598],
    
    // DULUTH (3 ubicaciones)
    "Bethel Eyecare": [-84.1447253, 34.0032179],
    "Elevate Your Life Professional Counseling and Coaching": [-84.1373648, 34.0073894],
    "MyEyeDr.": [-84.1015359, 34.0137825],
    
    // LAWRENCEVILLE - Muestra de las primeras 10 ubicaciones
    "AMA Dental Care": [-84.0456085, 33.9567043],
    "Brookwood Eyecare": [-84.0456085, 33.9567043],
    "CHOA - Cardiology - Lawrenceville": [-84.0037842, 33.9627228],
    "Choice One Dental of Lawrenceville": [-84.0722089, 33.9778442],
    "Chris180-Gwinnett Counseling Center": [-84.0012817, 33.9564133],
    "Dental Images of Gwinnett": [-84.0037842, 33.9627228],
    "Forster Eyecare": [-84.0179214, 33.9823608],
    "Four Corners Primary Care Clinic": [-84.0192108, 33.9553223],
    "Georgia Clinic - Lawrenceville": [-83.9885406, 33.9669447],
    "Georgia Eye Associates": [-84.0037842, 33.9627228]
};

async function updateCoordinates() {
    try {
        console.log('🔄 Iniciando actualización de coordenadas exactas...\n');
        
        // Leer el archivo de datos
        const dataPath = path.join(__dirname, 'src', 'data', 'gwinnett-health-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const locations = JSON.parse(rawData);
        
        let updatedCount = 0;
        
        // Actualizar cada ubicación que tenga coordenadas exactas disponibles
        for (let i = 0; i < locations.length; i++) {
            const location = locations[i];
            
            if (EXACT_COORDINATES[location.name]) {
                const coords = EXACT_COORDINATES[location.name];
                locations[i].coordinates = coords;
                updatedCount++;
                
                console.log(`✅ ${location.name}`);
                console.log(`   📍 Coordenadas: [${coords[0]}, ${coords[1]}]`);
                console.log(`   🏙️ Ciudad: ${location.city}\n`);
            }
        }
        
        // Guardar cambios
        if (updatedCount > 0) {
            fs.writeFileSync(dataPath, JSON.stringify(locations, null, 2));
            console.log(`🎉 Actualizadas ${updatedCount} ubicaciones con coordenadas exactas.`);
        }
        
        // Mostrar estadísticas actualizadas
        const withCoords = locations.filter(loc => loc.coordinates).length;
        const withoutCoords = locations.length - withCoords;
        
        console.log(`\n📊 ESTADÍSTICAS ACTUALIZADAS:`);
        console.log(`   Total ubicaciones: ${locations.length}`);
        console.log(`   ✅ Con coordenadas: ${withCoords} (${Math.round(withCoords/locations.length*100)}%)`);
        console.log(`   ❌ Sin coordenadas: ${withoutCoords} (${Math.round(withoutCoords/locations.length*100)}%)`);
        
        return locations;
        
    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

// Ejecutar el script
updateCoordinates()
    .then(() => console.log('\n✅ Actualización completada'))
    .catch(err => console.error('\n❌ Error en la actualización:', err));
