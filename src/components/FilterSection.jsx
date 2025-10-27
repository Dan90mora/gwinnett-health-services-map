const FilterSection = ({ title, type, value, onChange, options, disabled = false }) => {
  
  // Manejar cambios en checkboxes múltiples
  const handleCheckboxChange = (optionValue, checked) => {
    const currentValues = Array.isArray(value) ? value : [];
    let newValues;
    
    if (checked) {
      newValues = [...currentValues, optionValue];
    } else {
      newValues = currentValues.filter(v => v !== optionValue);
    }
    
    onChange(newValues);
  };

  // Renderizar select dropdown
  const renderSelect = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {title}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  // Renderizar grupo de checkboxes
  const renderCheckboxGroup = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {title}
      </label>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {options.map(option => {
          const isChecked = Array.isArray(value) && value.includes(option.value);
          
          return (
            <label
              key={option.value}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                disabled={disabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-sm text-gray-700 select-none">
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
      
      {/* Contador de seleccionados */}
      {Array.isArray(value) && value.length > 0 && (
        <div className="text-xs text-blue-600 mt-1">
          {value.length} seleccionado{value.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );

  // Renderizar input de búsqueda
  const renderSearchInput = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {title}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={`Buscar ${title.toLowerCase()}...`}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  );

  // Renderizar según el tipo
  switch (type) {
    case 'select':
      return renderSelect();
    case 'checkbox':
      return renderCheckboxGroup();
    case 'search':
      return renderSearchInput();
    default:
      return renderSelect();
  }
};

export default FilterSection;
