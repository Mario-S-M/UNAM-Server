import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Filter, Eye } from 'lucide-react';
import { LanguageColumnVisibility } from '@/types';

interface LanguageFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilter: string;
  onFilterChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
  columnVisibility: LanguageColumnVisibility;
  onColumnVisibilityChange: (column: keyof LanguageColumnVisibility) => void;
  totalItems: number;
}

const filterOptions = [
  { value: 'all', label: 'Todos los idiomas' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
  { value: 'recent', label: 'Recientes' }
];

const pageSizeOptions = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' }
];

const columnLabels: Record<keyof LanguageColumnVisibility, string> = {
  name: 'Nombre',
  code: 'Código',
  nativeName: 'Nombre Nativo',
  flag: 'Bandera',
  icons: 'Iconos',
  isActive: 'Estado',
  createdAt: 'Fecha de Creación',
  updatedAt: 'Última Actualización',
  actions: 'Acciones'
};

export function LanguageFilters({
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
  pageSize,
  onPageSizeChange,
  columnVisibility,
  onColumnVisibilityChange,
  totalItems
}: LanguageFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-2 flex-1">
        {/* Búsqueda */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar idiomas..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtro por estado */}
        <Select value={activeFilter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filtrar por..." />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tamaño de página */}
        <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Controles de columnas y estadísticas */}
      <div className="flex items-center gap-2">
        {/* Contador de resultados */}
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {totalItems} idioma{totalItems !== 1 ? 's' : ''}
        </span>

        {/* Visibilidad de columnas */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {Object.entries(columnLabels).map(([key, label]) => {
              const columnKey = key as keyof LanguageColumnVisibility;
              return (
                <DropdownMenuCheckboxItem
                  key={key}
                  className="capitalize"
                  checked={columnVisibility[columnKey]}
                  onCheckedChange={() => onColumnVisibilityChange(columnKey)}
                >
                  {label}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default LanguageFilters;