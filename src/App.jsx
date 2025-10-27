import { useState, useEffect, useRef } from 'react'
import MapComponent from './components/MapComponent'
import FilterPanel from './components/FilterPanel'
import FilterResults from './components/FilterResults'
import QuickSearch from './components/QuickSearch'
import LocationList from './components/LocationList'
import DataStats from './components/DataStats'
import ProjectSummary from './components/ProjectSummary'
import { useLocationFilters } from './hooks/useLocationFilters'
import { loadGwinnettHealthData } from './services/jsonDataService'
import './App.css'

function App() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [showNoResultsModal, setShowNoResultsModal] = useState(false);

  // Referencia para poder limpiar los filtros del FilterPanel desde FilterResults
  const filterPanelRef = useRef(null);

  // Hook personalizado para manejar filtros
  const {
    filters,
    filteredLocations,
    updateFilters,
    clearFilters,
    filterStats
  } = useLocationFilters(locations);

  // Función combinada para limpiar tanto filtros como búsqueda
  const clearAllFiltersAndSearch = () => {
    // Limpiar filtros en el hook
    clearFilters();
    // Limpiar término de búsqueda
    setSearchTerm('');
    // Limpiar filtros en el FilterPanel
    if (filterPanelRef.current) {
      filterPanelRef.current();
    }
  };

  // Filtrar ubicaciones por término de búsqueda
  const searchFilteredLocations = filteredLocations.filter(location => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      location.name?.toLowerCase().includes(searchLower) ||
      location.address?.toLowerCase().includes(searchLower) ||
      location.city?.toLowerCase().includes(searchLower) ||
      location.serviceType?.toLowerCase().includes(searchLower) ||
      location.description?.toLowerCase().includes(searchLower)
    );
  });

  // Detectar cuando hay filtros activos pero sin resultados
  useEffect(() => {
    const hasActiveFilters = filterStats.isFiltering || searchTerm;
    const hasNoResults = searchFilteredLocations.length === 0;
    
    if (hasActiveFilters && hasNoResults && !isLoading && locations.length > 0) {
      setShowNoResultsModal(true);
    } else {
      setShowNoResultsModal(false);
    }
  }, [searchFilteredLocations.length, filterStats.isFiltering, searchTerm, isLoading, locations.length]);

  // Cargar ubicaciones al montar el componente
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Loading Gwinnett Health Finder data...');
        const data = await loadGwinnettHealthData();
        console.log(`Loaded ${data.length} locations from CSV`);
        
        setLocations(data);
      } catch (err) {
        setError('Error loading locations from CSV: ' + err.message);
        console.error('Error loading CSV data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, []);

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header tipo Google Maps */}
      <div className="bg-white border-b border-gray-200 z-20 relative">
        <div className="flex items-center justify-between p-4">
          {/* Logo y título */}
          {/*<div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">Gwinnett Health Services</h1>
            </div>
          </div>*/}

          {/* Indicador de ubicaciones */}
          {/*<div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{searchFilteredLocations.length} locations</span>
                </>
              )}
            </div>


          </div>*/}
        </div>

        {/* Error display */}
        {error && (
          <div className="mx-4 mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-800 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal - Mapa de ancho completo */}
      <div className="flex-1 relative overflow-hidden">
        {/* QuickSearch superpuesto */}
        <div className="absolute z-10" style={{ top: '12px', left: '12px', width: '30%' }}>
          <div className="max-w-2xl space-y-2">
            <QuickSearch
              onSearch={setSearchTerm}
              isLoading={isLoading}
              placeholder="Search health services in Gwinnett County..."
              locations={searchFilteredLocations}
              onLocationSelect={(location) => setSelectedLocationId(location.id)}
              selectedLocationId={selectedLocationId}
              onFiltersChange={updateFilters}
            />
            
            {/* Filtros activos como chips */}
            {(Object.values(filters).some(filter => Array.isArray(filter) ? filter.length > 0 : filter !== '') || searchTerm) && (
              <FilterResults
                filters={filters}
                searchTerm={searchTerm}
                filterStats={filterStats}
                onClearFilters={clearAllFiltersAndSearch}
                onRemoveFilter={updateFilters}
                onClearSearch={() => setSearchTerm('')}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>

        {/* FilterPanel superpuesto a la derecha */}
        <div className="absolute top-4 z-10" style={{ right: '12px', top: '12px', width: '35%' }}>
          <FilterPanel
            onFiltersChange={updateFilters}
            isLoading={isLoading}
            locationCount={locations.length}
            onClearFilters={filterPanelRef}
          />
        </div>
        
        {/* MapComponent ocupa todo el ancho de la pantalla */}
        <MapComponent
          locations={searchFilteredLocations}
          selectedLocationId={selectedLocationId}
          onLocationSelect={setSelectedLocationId}
          isLoading={isLoading}
        />
      </div>

      {/* Popup para notificar cuando no hay resultados */}
      {showNoResultsModal && (
        <div 
          className="fixed animate-in fade-in duration-200"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(2px)',
            zIndex: 9999, // Por encima de todo
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            className="m-6 animate-in zoom-in-95 duration-200"
            style={{
              width: '80%',
              background: '#fff',
              borderRadius: '20px',
              padding: '50px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              transform: 'translateZ(0)'
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 
                className="font-semibold text-gray-900"
                style={{
                  fontSize: '30px',
                  textAlign: 'center',
                  margin: 'auto'
                }}
              >
                No results
              </h3>
            </div>
            
            <p 
              className="text-gray-600 mb-8 leading-relaxed"
              style={{
                fontSize: '20px',
                textAlign: 'center'
              }}
            >
              No locations found that meet all the selected filter criteria. 
              Try adjusting or clearing some filters to get more results.
            </p>
            
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowNoResultsModal(false);
                  clearAllFiltersAndSearch();
                }}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Clear all filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
