import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar el estado y configuración del mapa
 */
export const useMapConfiguration = () => {
  const [mapConfig, setMapConfig] = useState({
    center: [-84.3880, 33.7490], // Atlanta, Georgia [lng, lat]
    zoom: 11,
    minZoom: 3,
    maxZoom: 19
  });

  const [mapState, setMapState] = useState({
    isLoading: true,
    error: null,
    locationCount: 0
  });

  // Actualizar configuración del mapa
  const updateMapConfig = useCallback((newConfig) => {
    setMapConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  // Actualizar estado del mapa
  const updateMapState = useCallback((newState) => {
    setMapState(prev => ({ ...prev, ...newState }));
  }, []);

  // Restablecer vista inicial
  const resetToDefaultView = useCallback(() => {
    return {
      center: [-84.3880, 33.7490],
      zoom: 11,
      duration: 500
    };
  }, []);

  return {
    mapConfig,
    mapState,
    updateMapConfig,
    updateMapState,
    resetToDefaultView
  };
};
