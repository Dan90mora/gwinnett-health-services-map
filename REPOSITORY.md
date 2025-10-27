# 🗂️ Gwinnett Health Services Map - Repository Information

## 📋 Repository Structure

This repository contains a React + Vite application for displaying health services in Gwinnett County with an interactive map interface.

## 🌿 Branch Strategy

- **`master`** - Production-ready code
- **`development`** - Integration branch for new features
- **`features`** - Branch for developing new features

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📦 Key Components

- **MapComponent** - Main interactive map using OpenLayers
- **QuickSearch** - Intelligent search with auto-filter activation
- **FilterPanel** - Advanced filtering interface
- **LocationList** - Sidebar with location details

## 🔧 Development Workflow

1. Create feature branches from `development`
2. Make changes and test locally
3. Submit pull request to `development`
4. Merge to `master` when ready for production

## 📊 Data Sources

- Health service data in `src/data/gwinnett-health-data.json`
- Original CSV in `public/Gwinnett Health Finder - Sheet1.csv`

## 🛠️ Built With

- React 19
- Vite 7
- OpenLayers 10.6.1
- Tailwind CSS 4
- PapaParse

---

*Created: $(date +'%B %Y')*
*Last Updated: $(date +'%B %d, %Y')*
