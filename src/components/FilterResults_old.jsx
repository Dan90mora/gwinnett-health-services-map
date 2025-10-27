const FilterResults = ({ filterStats, onClearFilters, isLoading }) => {
  const { total, filtered, activeFilterCount, isFiltering } = filterStats;

  if (!isFiltering) {
    return null; // No mostrar nada si no hay filtros activos
  }

  return (
    <div className="flex items-center justify-between text-sm text-gray-600 py-2">
      <div className="flex items-center gap-2">
        {filtered > 0 ? (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        
        <span>
          {filtered === 0 ? (
            'No se encontraron ubicaciones con estos filtros'
          ) : (
            `${filtered} de ${total} ubicaciones`
          )}
        </span>

        {activeFilterCount > 0 && (
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
            {activeFilterCount} filtro{activeFilterCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={onClearFilters}
          disabled={isLoading}
          className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 transition-colors"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  export default FilterResults;
