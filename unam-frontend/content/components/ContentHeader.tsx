import React from 'react';
import { Search, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentFilters } from './ContentFilters';

interface ContentHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
  columnVisibility: {
    title: boolean;
    description: boolean;
    status: boolean;
    createdAt: boolean;
    updatedAt: boolean;
    actions: boolean;
  };
  onColumnVisibilityChange: (column: string, visible: boolean) => void;
  onCreateClick: () => void;
  children?: React.ReactNode;
  // Nuevos filtros
  selectedLanguageId: string;
  onLanguageFilterChange: (value: string) => void;
  selectedSkillId: string;
  onSkillFilterChange: (value: string) => void;
  selectedLevelId: string;
  onLevelFilterChange: (value: string) => void;
  languages: { id: string; name: string }[];
  skills: { id: string; name: string }[];
  levels: { id: string; name: string }[];
}

export function ContentHeader({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  pageSize,
  onPageSizeChange,
  columnVisibility,
  onColumnVisibilityChange,
  onCreateClick,
  children,
  selectedLanguageId,
  onLanguageFilterChange,
  selectedSkillId,
  onSkillFilterChange,
  selectedLevelId,
  onLevelFilterChange,
  languages,
  skills,
  levels,
}: ContentHeaderProps) {
  return (
    <Card className="max-w-none">
      <CardHeader className="px-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Gestión de Contenido
            </CardTitle>
            <CardDescription>
              Administra el contenido de la plataforma
            </CardDescription>
          </div>
          <Button onClick={onCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Contenido
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="flex flex-col gap-4">
          {/* Filtros y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar contenido..."
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="DRAFT">Borrador</SelectItem>
                  <SelectItem value="PUBLISHED">Publicado</SelectItem>
                  <SelectItem value="ARCHIVED">Archivado</SelectItem>
                </SelectContent>
              </Select>
              
              <ContentFilters
                selectedLanguageId={selectedLanguageId}
                onLanguageFilterChange={onLanguageFilterChange}
                selectedSkillId={selectedSkillId}
                onSkillFilterChange={onSkillFilterChange}
                selectedLevelId={selectedLevelId}
                onLevelFilterChange={onLevelFilterChange}
                languages={languages}
                skills={skills}
                levels={levels}
              />
              
              <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 por página</SelectItem>
                  <SelectItem value="10">10 por página</SelectItem>
                  <SelectItem value="20">20 por página</SelectItem>
                  <SelectItem value="50">50 por página</SelectItem>
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
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.title}
                  onCheckedChange={(checked) => onColumnVisibilityChange('title', checked)}
                >
                  Título
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.description}
                  onCheckedChange={(checked) => onColumnVisibilityChange('description', checked)}
                >
                  Descripción
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.status}
                  onCheckedChange={(checked) => onColumnVisibilityChange('status', checked)}
                >
                  Estado
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.createdAt}
                  onCheckedChange={(checked) => onColumnVisibilityChange('createdAt', checked)}
                >
                  Fecha de Creación
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.updatedAt}
                  onCheckedChange={(checked) => onColumnVisibilityChange('updatedAt', checked)}
                >
                  Fecha de Actualización
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.actions}
                  onCheckedChange={(checked) => onColumnVisibilityChange('actions', checked)}
                >
                  Acciones
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Contenido de la tabla */}
        <div className="mt-6">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}