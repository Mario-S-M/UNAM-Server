import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Plus, Settings } from 'lucide-react';

interface ColumnVisibility {
  name: boolean;
  level: boolean;
  skill: boolean;
  status: boolean;
  teachers: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  actions: boolean;
}

interface ContentHeaderProps {
  search: string;
  pageSize: number;
  activeFilter: 'all' | 'PENDING' | 'APPROVED' | 'REJECTED';
  columnVisibility: ColumnVisibility;
  onSearchChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
  onActiveFilterChange: (value: 'all' | 'PENDING' | 'APPROVED' | 'REJECTED') => void;
  onToggleColumnVisibility: (column: keyof ColumnVisibility) => void;
  onCreateClick: () => void;
}

export function ContentHeader({ 
  search, 
  pageSize, 
  activeFilter, 
  columnVisibility,
  onSearchChange, 
  onPageSizeChange,
  onActiveFilterChange,
  onToggleColumnVisibility,
  onCreateClick 
}: ContentHeaderProps) {
  return (
    <>
      {/* Filtros avanzados */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Estado:</label>
          <Select value={activeFilter} onValueChange={onActiveFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="PENDING">Pendiente</SelectItem>
              <SelectItem value="APPROVED">Aprobado</SelectItem>
              <SelectItem value="REJECTED">Rechazado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Mostrar:</label>
          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={columnVisibility.name}
              onCheckedChange={() => onToggleColumnVisibility('name')}
            >
              Nombre
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.level}
              onCheckedChange={() => onToggleColumnVisibility('level')}
            >
              Nivel
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.skill}
              onCheckedChange={() => onToggleColumnVisibility('skill')}
            >
              Skill
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.status}
              onCheckedChange={() => onToggleColumnVisibility('status')}
            >
              Estado
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.teachers}
              onCheckedChange={() => onToggleColumnVisibility('teachers')}
            >
              Profesores
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.createdAt}
              onCheckedChange={() => onToggleColumnVisibility('createdAt')}
            >
              Fecha de Creación
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.updatedAt}
              onCheckedChange={() => onToggleColumnVisibility('updatedAt')}
            >
              Última Actualización
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.actions}
              onCheckedChange={() => onToggleColumnVisibility('actions')}
            >
              Acciones
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Búsqueda y botón crear */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar contenido..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={onCreateClick}
          className="ml-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Contenido
        </Button>
      </div>
    </>
  );
}