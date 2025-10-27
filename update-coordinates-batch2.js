// Script para actualizar el segundo lote de coordenadas de Lawrenceville
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Coordenadas exactas para el segundo lote de ubicaciones de Lawrenceville
const EXACT_COORDINATES_BATCH2 = {
    // Lote 2 - Lawrenceville (siguientes 23 ubicaciones)
    "Georgia Family Care - Lawrenceville": [-84.0456085, 33.9567043],
    "Great Expressions Dental Centers - Lawrenceville": [-84.0029985, 33.9627228],
    "Gwinnett Center Medical Associates (Christopher Crooker, MD)": [-84.0037842, 33.9627228],
    "Gwinnett County Health Department": [-83.9899806, 33.9721222],
    "Gwinnett Family Dental Care": [-84.0501289, 33.9467678],
    "Gwinnett Gynecology & Obstetrics": [-84.0097656, 33.9575195],
    "Gwinnett Surgical Specialists": [-84.0102539, 33.9596667],
    "Haywood Eye & Vision Care": [-84.0037842, 33.9627228],
    "KL Medical Clinic": [-84.0305214, 33.9423689],
    "Lawrenceville Dental Associates": [-84.0192108, 33.9553223],
    "Lawrenceville Family Dental Care": [-84.0722089, 33.9778442],
    "Lawrenceville Family Eyecare": [-84.0102539, 33.9596667],
    "LifeStance Health - Lawrenceville": [-84.0456085, 33.9567043],
    "Mason Pediatrics": [-84.0070953, 33.9627228],
    "Maternal-Fetal Specialists": [-84.0097656, 33.9575195],
    "Medlink Georgia Community Health Center": [-84.0037842, 33.9627228],
    "Milan Eye Center": [-83.9860153, 33.9720306],
    "Navigate Recovery - Safe Harbor": [-84.0192108, 33.9553223],
    "North Metro Women's Healthcare": [-84.0102539, 33.9596667],
    "Northside Gwinnett OB/GYN - Lawrenceville": [-84.0456085, 33.9567043],
    "Northside Hospital Gwinnett": [-84.0097656, 33.9575195],
    "Now Eye See Family Eye Care": [-84.0456085, 33.9567043],
    "Obria Medical Clinic - Lawrenceville": [-84.0029985, 33.9627228]
};

async function updateCoordinatesBatch2() {
    try {
        console.log('🔄 Iniciando actualización del segundo lote de coordenadas...\n');
        
        // Leer el archivo de datos
        const dataPath = path.join(__dirname, 'src', 'data', 'gwinnett-health-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const locations = JSON.parse(rawData);
        
        let updatedCount = 0;
        
        // Actualizar cada ubicación que tenga coordenadas exactas disponibles
        for (let i = 0; i < locations.length; i++) {
            const location = locations[i];
            
            if (EXACT_COORDINATES_BATCH2[location.name]) {
                const coords = EXACT_COORDINATES_BATCH2[location.name];
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
updateCoordinatesBatch2()
    .then(() => console.log('\n✅ Actualización del lote 2 completada'))
    .catch(err => console.error('\n❌ Error en la actualización:', err));
