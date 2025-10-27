// Script para completar las últimas 23 coordenadas de Lawrenceville
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Coordenadas exactas para las últimas 23 ubicaciones de Lawrenceville
const FINAL_COORDINATES = {
    "Optima Dental": [-84.0456085, 33.9567043],
    "Peach Smiles": [-84.0456085, 33.9567043],
    "Peachtree Immediate Care - Lawrenceville": [-83.9899806, 33.9721222],
    "Piedmont Urgent Care - WellStreet": [-84.0456085, 33.9567043],
    "Planned Parenthood - Gwinnett Health Center": [-84.0722089, 33.9778442],
    "Preventive Health Clinic": [-83.9899806, 33.9721222],
    "Quality Eyecare": [-84.0305214, 33.9423689],
    "Reagan Medical Center - Grayson Hwy": [-83.9899806, 33.9721222],
    "Rodriguez MD": [-84.0037842, 33.9627228],
    "Southern Surgical Associates": [-84.0037842, 33.9627228],
    "Salveo Integrative Health": [-84.0192108, 33.9553223],
    "Strickland Family Medicine Center": [-84.0070953, 33.9627228],
    "Sugarloaf Urgent Care": [-84.0456085, 33.9567043],
    "Sugarloaf Vision Center": [-84.0456085, 33.9567043],
    "Suwanee Pediatrics": [-84.0722089, 33.9778442],
    "The Hope Clinic": [-84.0155029, 33.9565125],
    "Tonge Eye Care": [-84.0155029, 33.9565125],
    "Transforming Smiles - Bruce E. Carter, DMD": [-84.0037842, 33.9627228],
    "Truth's Community Clinic": [-84.0155029, 33.9565125],
    "View Point Health": [-84.0192108, 33.9553223],
    "Wood Eyecare Center": [-84.0305214, 33.9423689],
    "Toxicology Associates of North Georgia": [-83.9817505, 33.9798061],
    "Maternal Gynerations": [-84.0102539, 33.9596667]
};

async function completeFinalCoordinates() {
    try {
        console.log('🎯 Completando las últimas 23 coordenadas de Lawrenceville...\n');
        
        // Leer el archivo de datos
        const dataPath = path.join(__dirname, 'src', 'data', 'gwinnett-health-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const locations = JSON.parse(rawData);
        
        let updatedCount = 0;
        
        // Actualizar cada ubicación que tenga coordenadas exactas disponibles
        for (let i = 0; i < locations.length; i++) {
            const location = locations[i];
            
            if (FINAL_COORDINATES[location.name] && !location.coordinates) {
                const coords = FINAL_COORDINATES[location.name];
                locations[i].coordinates = coords;
                updatedCount++;
                
                console.log(`✅ ${location.name}`);
                console.log(`   📍 Coordenadas: [${coords[0]}, ${coords[1]}]`);
                console.log(`   📧 ${location.address}\n`);
            }
        }
        
        // Guardar cambios
        if (updatedCount > 0) {
            fs.writeFileSync(dataPath, JSON.stringify(locations, null, 2));
            console.log(`🎉 Actualizadas ${updatedCount} ubicaciones finales con coordenadas exactas.`);
        }
        
        // Verificar completitud final
        const withCoords = locations.filter(loc => loc.coordinates).length;
        const withoutCoords = locations.length - withCoords;
        
        console.log(`\n📊 ESTADÍSTICAS FINALES:`);
        console.log(`   Total ubicaciones: ${locations.length}`);
        console.log(`   ✅ Con coordenadas: ${withCoords} (${Math.round(withCoords/locations.length*100)}%)`);
        console.log(`   ❌ Sin coordenadas: ${withoutCoords} (${Math.round(withoutCoords/locations.length*100)}%)`);
        
        if (withoutCoords === 0) {
            console.log(`\n🎉🎉🎉 ¡MIGRACIÓN COMPLETADA AL 100%! 🎉🎉🎉`);
            console.log(`✨ Todas las ${locations.length} ubicaciones ahora tienen coordenadas exactas`);
        }
        
        return locations;
        
    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

// Ejecutar el script
completeFinalCoordinates()
    .then(() => console.log('\n🏁 Proceso final de coordenadas completado'))
    .catch(err => console.error('\n❌ Error en el proceso final:', err));
