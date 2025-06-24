import { useState, useEffect } from "react";

/**
 * Hook personalizado para debounced values
 * Útil para búsquedas en tiempo real sin realizar demasiadas requests
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook personalizado para búsquedas con debounce
 * Incluye estado de loading para mostrar indicadores
 */
export function useDebouncedSearch(
  searchTerm: string,
  delay: number = 500
): {
  debouncedSearchTerm: string;
  isSearching: boolean;
} {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }

    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, delay);

    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [searchTerm, delay, debouncedSearchTerm]);

  return {
    debouncedSearchTerm,
    isSearching: searchTerm !== debouncedSearchTerm,
  };
}
