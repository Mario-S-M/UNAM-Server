'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Plus, Settings, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterOption {
  value: string;
  label: string;
}

interface ColumnVisibility {
  [key: string]: boolean;
}

interface TableFiltersProps {
  // Search
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  
  // Page size
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  
  // Filters
  activeFilter?: string;
  onActiveFilterChange?: (filter: string) => void;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  
  // Column visibility
  columnVisibility: ColumnVisibility;
  onToggleColumnVisibility: (column: string) => void;
  columnLabels: Record<string, string>;
  
  // Actions
  onCreateClick?: () => void;
  createButtonText?: string;
  
  // Styling
  className?: string;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export function TableFilters({
  search,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  pageSize,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  activeFilter,
  onActiveFilterChange,
  filterOptions,
  filterLabel = 'Filtrar por estado',
  columnVisibility,
  onToggleColumnVisibility,
  columnLabels,
  onCreateClick,
  createButtonText = 'Crear',
  className
}: TableFiltersProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Filtros y configuración */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Tamaño de página */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Mostrar:
            </span>
            <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por estado */}
          {filterOptions && onActiveFilterChange && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={activeFilter} onValueChange={onActiveFilterChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={filterLabel} />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Configuración de columnas */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Columnas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {Object.entries(columnLabels).map(([key, label]) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={columnVisibility[key]}
                  onCheckedChange={() => onToggleColumnVisibility(key)}
                >
                  {label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Búsqueda y botón crear */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        {onCreateClick && (
          <Button onClick={onCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            {createButtonText}
          </Button>
        )}
      </div>
    </div>
  );
}

export default TableFilters;