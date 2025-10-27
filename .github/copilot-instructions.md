<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Instrucciones para el proyecto de Mapas con OpenStreetMap

Este es un proyecto React con Vite que utiliza:
- **OpenLayers** para mapas interactivos con OpenStreetMap
- **Tailwind CSS** para estilos
- **PapaParse** para manejo de archivos CSV
- **Sistema de filtros** por ciudad, horario, idioma, tipo de servicio y métodos de pago

## Estructura del proyecto:
- `src/components/`: Componentes React reutilizables
- `src/services/`: Servicios para manejo de datos y APIs
- `src/utils/`: Utilidades y funciones auxiliares
- `src/data/`: Archivos de datos (CSV procesado)

## Consideraciones importantes:
- Usar OpenLayers (biblioteca `ol`) para toda la funcionalidad de mapas
- Implementar filtros reactivos que actualicen los marcadores en tiempo real
- Extraer coordenadas de URLs de Google Maps del CSV
- Crear popups informativos para cada ubicación
- Mantener diseño responsive con Tailwind CSS
