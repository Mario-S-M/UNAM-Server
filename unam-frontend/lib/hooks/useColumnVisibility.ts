import { useState, useCallback } from 'react';
import type { ColumnVisibility } from '@/types';

interface UseColumnVisibilityOptions<T extends ColumnVisibility> {
  initialVisibility: T;
  storageKey?: string;
}

interface UseColumnVisibilityReturn<T extends ColumnVisibility> {
  columnVisibility: T;
  toggleColumn: (column: keyof T) => void;
  showColumn: (column: keyof T) => void;
  hideColumn: (column: keyof T) => void;
  resetToDefault: () => void;
  setColumnVisibility: (visibility: T) => void;
  getVisibleColumns: () => (keyof T)[];
  getHiddenColumns: () => (keyof T)[];
  isColumnVisible: (column: keyof T) => boolean;
}

export function useColumnVisibility<T extends ColumnVisibility>({
  initialVisibility,
  storageKey
}: UseColumnVisibilityOptions<T>): UseColumnVisibilityReturn<T> {
  // Load from localStorage if storageKey is provided
  const getInitialState = (): T => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Merge with initial visibility to ensure all columns are present
          return { ...initialVisibility, ...parsed };
        }
      } catch (error) {
        console.warn('Error loading column visibility from localStorage:', error);
      }
    }
    return initialVisibility;
  };

  const [columnVisibility, setColumnVisibilityState] = useState<T>(getInitialState);

  // Save to localStorage when visibility changes
  const saveToStorage = useCallback((visibility: T) => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(visibility));
      } catch (error) {
        console.warn('Error saving column visibility to localStorage:', error);
      }
    }
  }, [storageKey]);

  const setColumnVisibility = useCallback((visibility: T) => {
    setColumnVisibilityState(visibility);
    saveToStorage(visibility);
  }, [saveToStorage]);

  const toggleColumn = useCallback((column: keyof T) => {
    const newVisibility = {
      ...columnVisibility,
      [column]: !columnVisibility[column]
    } as T;
    setColumnVisibility(newVisibility);
  }, [columnVisibility, setColumnVisibility]);

  const showColumn = useCallback((column: keyof T) => {
    if (!columnVisibility[column]) {
      const newVisibility = {
        ...columnVisibility,
        [column]: true
      } as T;
      setColumnVisibility(newVisibility);
    }
  }, [columnVisibility, setColumnVisibility]);

  const hideColumn = useCallback((column: keyof T) => {
    if (columnVisibility[column]) {
      const newVisibility = {
        ...columnVisibility,
        [column]: false
      } as T;
      setColumnVisibility(newVisibility);
    }
  }, [columnVisibility, setColumnVisibility]);

  const resetToDefault = useCallback(() => {
    setColumnVisibility(initialVisibility);
  }, [initialVisibility, setColumnVisibility]);

  const getVisibleColumns = useCallback((): (keyof T)[] => {
    return Object.keys(columnVisibility).filter(
      key => columnVisibility[key as keyof T]
    ) as (keyof T)[];
  }, [columnVisibility]);

  const getHiddenColumns = useCallback((): (keyof T)[] => {
    return Object.keys(columnVisibility).filter(
      key => !columnVisibility[key as keyof T]
    ) as (keyof T)[];
  }, [columnVisibility]);

  const isColumnVisible = useCallback((column: keyof T): boolean => {
    return Boolean(columnVisibility[column]);
  }, [columnVisibility]);

  return {
    columnVisibility,
    toggleColumn,
    showColumn,
    hideColumn,
    resetToDefault,
    setColumnVisibility,
    getVisibleColumns,
    getHiddenColumns,
    isColumnVisible
  };
}

export default useColumnVisibility;