'use client';

import { useState } from 'react';

interface LevelColumnVisibility {
  name: boolean;
  description: boolean;
  difficulty: boolean;
  language: boolean;
  isActive: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  actions: boolean;
}

interface UseLevelFiltersProps {
  onSearchChange?: (search: string) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onActiveFilterChange?: (activeFilter?: boolean) => void;
  onLanguageFilterChange?: (languageFilter: string) => void;
  onDifficultyFilterChange?: (difficultyFilter: string) => void;
}

interface UseLevelFiltersReturn {
  search: string;
  setSearch: (search: string) => void;
  activeFilter?: boolean;
  setActiveFilter: (activeFilter?: boolean) => void;
  languageFilter: string;
  setLanguageFilter: (languageFilter: string) => void;
  difficultyFilter: string;
  setDifficultyFilter: (difficultyFilter: string) => void;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  columnVisibility: LevelColumnVisibility;
  setColumnVisibility: (visibility: Partial<LevelColumnVisibility>) => void;
  handleSearchChange: (search: string) => void;
  handlePageChange: (page: number) => void;
  resetFilters: () => void;
}

export function useLevelFilters({
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onActiveFilterChange,
  onLanguageFilterChange,
  onDifficultyFilterChange,
}: UseLevelFiltersProps = {}): UseLevelFiltersReturn {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [languageFilter, setLanguageFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnVisibility, setColumnVisibilityState] = useState<LevelColumnVisibility>({
    name: true,
    description: false,
    difficulty: true,
    language: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
    actions: true,
  });

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setCurrentPage(1);
    onSearchChange?.(newSearch);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    onPageSizeChange?.(newPageSize);
  };

  const handleActiveFilterChange = (newActiveFilter?: boolean) => {
    setActiveFilter(newActiveFilter);
    setCurrentPage(1);
    onActiveFilterChange?.(newActiveFilter);
  };

  const handleLanguageFilterChange = (newLanguageFilter: string) => {
    setLanguageFilter(newLanguageFilter);
    setCurrentPage(1);
    onLanguageFilterChange?.(newLanguageFilter);
  };

  const handleDifficultyFilterChange = (newDifficultyFilter: string) => {
    setDifficultyFilter(newDifficultyFilter);
    setCurrentPage(1);
    onDifficultyFilterChange?.(newDifficultyFilter);
  };

  const setColumnVisibility = (visibility: Partial<LevelColumnVisibility>) => {
    setColumnVisibilityState(prev => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(visibility).map(([key, value]) => [
          key,
          value !== undefined ? Boolean(value) : prev[key as keyof LevelColumnVisibility]
        ])
      ) as Partial<LevelColumnVisibility>
    }));
  };

  const resetFilters = () => {
    setSearch('');
    setActiveFilter(undefined);
    setLanguageFilter('');
    setDifficultyFilter('');
    setCurrentPage(1);
    onSearchChange?.('');
    onActiveFilterChange?.(undefined);
    onLanguageFilterChange?.('');
    onDifficultyFilterChange?.('');
    onPageChange?.(1);
  };

  return {
    search,
    setSearch,
    activeFilter,
    setActiveFilter: handleActiveFilterChange,
    languageFilter,
    setLanguageFilter: handleLanguageFilterChange,
    difficultyFilter,
    setDifficultyFilter: handleDifficultyFilterChange,
    pageSize,
    setPageSize: handlePageSizeChange,
    currentPage,
    setCurrentPage: handlePageChange,
    columnVisibility,
    setColumnVisibility,
    handleSearchChange,
    handlePageChange,
    resetFilters,
  };
}

export type { LevelColumnVisibility, UseLevelFiltersProps, UseLevelFiltersReturn };