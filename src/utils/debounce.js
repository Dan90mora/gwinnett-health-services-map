/**
 * Función debounce para optimizar el rendimiento
 * Retrasa la ejecución de una función hasta que hayan pasado los milisegundos especificados
 * desde la última vez que se invocó
 * 
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Tiempo de retraso en milisegundos
 * @returns {Function} - Función debounced con método cancel
 */
export const debounce = (func, delay) => {
  let timeoutId;
  
  const debouncedFunction = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };

  // Agregar método para cancelar
  debouncedFunction.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debouncedFunction;
};

/**
 * Función throttle para limitar la frecuencia de ejecución
 * Garantiza que una función no se ejecute más de una vez en el tiempo especificado
 * 
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite de tiempo en milisegundos
 * @returns {Function} - Función throttled
 */
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Función para crear un delay/pausa asíncrona
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} - Promesa que se resuelve después del tiempo especificado
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
