# Gwinnett Health Services Map

Interactive React application that displays health service locations in Gwinnett County using OpenStreetMap and OpenLayers, with intelligent search and filtering capabilities.

## 🌟 Features

- 🗺️ **Interactive Map** with OpenStreetMap and OpenLayers
- 🔍 **Advanced Filtering System** by:
  - City (Lawrenceville, Suwanee, Duluth, Dacula)
  - Schedule (Morning, Afternoon, Evening, Weekends, 24/7, etc.)
  - Language (English, Spanish, French, Hindi, and 11+ more languages)
  - Service Type (Dental, Vision, Mental Health, Primary Care, etc.)
  - Payment Methods (Cash, Medicaid, Medicare, Insurance, etc.)
- 🎯 **Intelligent Search** - Type keywords to automatically activate relevant filters
- 📱 **Responsive Design** with Tailwind CSS
- 📊 **Real-time Data Processing** from CSV sources
- 🎨 **Modern UI** with Google Maps-inspired interface

## 🧠 Smart Search Examples

The search bar understands natural language and automatically activates filters:

- Type **"dental"** → Activates dental services filter
- Type **"spanish"** → Activates Spanish language filter  
- Type **"morning"** → Activates morning hours filter
- Type **"medicaid"** → Activates Medicaid payment filter
- Type **"lawrenceville"** → Activates Lawrenceville city filter
  - Tipo de servicio
  - Métodos de pago
- 📍 **Marcadores informativos** con popups detallados
- 📱 **Diseño responsive** con Tailwind CSS
- 📊 **Carga de datos** desde archivos CSV

## Tecnologías utilizadas

- **React** - Framework de interfaz de usuario
- **Vite** - Herramienta de construcción y desarrollo
- **OpenLayers** - Biblioteca de mapas web
- **Tailwind CSS** - Framework de CSS
- **PapaParse** - Parser de archivos CSV
- **OpenStreetMap** - Proveedor de mapas

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Construcción

```bash
npm run build

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
