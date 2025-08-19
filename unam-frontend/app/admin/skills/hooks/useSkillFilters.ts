'use client';

import { useState, useCallback } from 'react';
import { SkillColumnVisibility } from '@/types';

export interface UseSkillFiltersProps {
  initialSearch?: string;
  initialActiveFilter?: boolean;
  initialPageSize?: number;
  initialColumnVisibility?: Partial<SkillColumnVisibility>;
}

export interface UseSkillFiltersReturn {
  // Estados de filtros
  search: string;
  activeFilter: boolean | undefined;
  pageSize: number;
  currentPage: number;
  
  // Visibilidad de columnas
  columnVisibility: SkillColumnVisibility;
  
  // Funciones de actualización
  setSearch: (search: string) => void;
  setActiveFilter: (active: boolean | undefined) => void;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
  setColumnVisibility: (visibility: Partial<SkillColumnVisibility>) => void;
  toggleColumnVisibility: (column: keyof SkillColumnVisibility) => void;
  
  // Funciones de utilidad
  resetFilters: () => void;
  resetPagination: () => void;
  
  // Getters computados
  hasActiveFilters: boolean;
  visibleColumnsCount: number;
}

const defaultColumnVisibility: SkillColumnVisibility = {
  name: true,
  description: true,
  color: false,
  isActive: true,
  createdAt: false,
  updatedAt: false,
  actions: true,
};

export function useSkillFilters({
  initialSearch = '',
  initialActiveFilter = undefined,
  initialPageSize = 5,
  initialColumnVisibility = {}
}: UseSkillFiltersProps = {}): UseSkillFiltersReturn {
  
  // Estados de filtros
  const [search, setSearchState] = useState(initialSearch);
  const [activeFilter, setActiveFilterState] = useState<boolean | undefined>(initialActiveFilter);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [currentPage, setCurrentPageState] = useState(1);
  
  // Estado de visibilidad de columnas
  const [columnVisibility, setColumnVisibilityState] = useState<SkillColumnVisibility>(() => {
    const merged = { ...defaultColumnVisibility };
    Object.keys(initialColumnVisibility).forEach(key => {
      const typedKey = key as keyof SkillColumnVisibility;
      if (initialColumnVisibility[typedKey] !== undefined) {
        merged[typedKey] = initialColumnVisibility[typedKey] as boolean;
      }
    });
    return merged;
  });

  // Funciones de actualización con reset de paginación cuando es necesario
  const setSearch = useCallback((newSearch: string) => {
    setSearchState(newSearch);
    setCurrentPageState(1); // Reset pagination when searching
  }, []);

  const setActiveFilter = useCallback((active: boolean | undefined) => {
    setActiveFilterState(active);
    setCurrentPageState(1); // Reset pagination when filtering
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPageState(1); // Reset pagination when changing page size
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    setCurrentPageState(page);
  }, []);

  const setColumnVisibility = useCallback((visibility: Partial<SkillColumnVisibility>) => {
    setColumnVisibilityState(prev => {
      const updated = { ...prev };
      Object.keys(visibility).forEach(key => {
        const typedKey = key as keyof SkillColumnVisibility;
        if (visibility[typedKey] !== undefined) {
          updated[typedKey] = visibility[typedKey] as boolean;
        }
      });
      return updated;
    });
  }, []);

  const toggleColumnVisibility = useCallback((column: keyof SkillColumnVisibility) => {
    setColumnVisibilityState(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setSearchState(initialSearch);
    setActiveFilterState(initialActiveFilter);
    setCurrentPageState(1);
  }, [initialSearch, initialActiveFilter]);

  const resetPagination = useCallback(() => {
    setCurrentPageState(1);
  }, []);

  // Getters computados
  const hasActiveFilters = search !== initialSearch || activeFilter !== initialActiveFilter;
  
  const visibleColumnsCount = Object.values(columnVisibility).filter(Boolean).length;

  return {
    // Estados
    search,
    activeFilter,
    pageSize,
    currentPage,
    columnVisibility,
    
    // Funciones de actualización
    setSearch,
    setActiveFilter,
    setPageSize,
    setCurrentPage,
    setColumnVisibility,
    toggleColumnVisibility,
    
    // Funciones de utilidad
    resetFilters,
    resetPagination,
    
    // Getters computados
    hasActiveFilters,
    visibleColumnsCount
  };
}

export default useSkillFilters;