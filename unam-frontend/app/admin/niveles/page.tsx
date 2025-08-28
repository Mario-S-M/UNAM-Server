'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, GraduationCap, Search, Settings, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

type GraphQLInputValue = string | number | boolean | null | undefined | string[] | {
  [key: string]: string | number | boolean | null | undefined | string[];
};

interface GraphQLVariables {
  [key: string]: GraphQLInputValue;
}

const fetchGraphQL = async (query: string, variables?: GraphQLVariables, token?: string) => {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'GraphQL error');
    }

    return result;
  } catch (error) {
    console.error('GraphQL fetch error:', error);
    throw error;
  }
};

interface Language {
  id: string;
  name: string;
}

interface Level {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  isActive: boolean;
  lenguageId: string;
  lenguage: Language | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedLevels {
  levels: Level[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

type LevelFormData = {
  name: string;
  description: string;
  difficulty: string;
  lenguageId: string;
  isActive: boolean;
};

interface ColumnVisibility {
  name: boolean;
  description: boolean;
  difficulty: boolean;
  language: boolean;
  isActive: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  actions: boolean;
}

const DIFFICULTY_OPTIONS = [
  { value: 'Básico', label: 'Básico' },
  { value: 'Básico-Intermedio', label: 'Básico-Intermedio' },
  { value: 'Intermedio', label: 'Intermedio' },
  { value: 'Intermedio-Avanzado', label: 'Intermedio-Avanzado' },
  { value: 'Avanzado', label: 'Avanzado' }
];

export default function NivelesPage() {
  const { token } = useAuth();
  const [levels, setLevels] = useState<PaginatedLevels>({
    levels: [],
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [formData, setFormData] = useState<LevelFormData>({
    name: '',
    description: '',
    difficulty: 'Básico',
    lenguageId: '',
    isActive: true,
  });
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [difficultyFilter, setDifficultyFilter] = useState<string | undefined>(undefined);
  const [languageFilter, setLanguageFilter] = useState<string | undefined>(undefined);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    description: true,
    difficulty: true,
    language: true,
    isActive: true,
    createdAt: false,
    updatedAt: false,
    actions: true,
  });

  const fetchLanguages = useCallback(async () => {
    if (!token) return;
    
    try {
      const query = `
        query GetLanguages {
          lenguagesActivate {
            id
            name
          }
        }
      `;
      
      const response = await fetchGraphQL(query, {}, token);
      setLanguages(response.data?.lenguagesActivate || []);
    } catch (error) {
      console.error('Error fetching languages:', error);
      toast.error('Error al cargar idiomas');
    }
  }, [token]);

  const fetchLevels = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const query = `
        query GetLevelsPaginated($search: String, $page: Int, $limit: Int, $isActive: Boolean, $lenguageId: ID, $difficulty: String) {
          levelsPaginated(search: $search, page: $page, limit: $limit, isActive: $isActive, lenguageId: $lenguageId, difficulty: $difficulty) {
            levels {
              id
              name
              description
              difficulty
              isActive
              lenguageId
              lenguage {
                id
                name
              }
              createdAt
              updatedAt
            }
            total
            page
            limit
            totalPages
            hasNextPage
            hasPreviousPage
          }
        }
      `;
      
      const variables = {
        search: search || undefined,
        page: currentPage,
        limit: pageSize,
        isActive: activeFilter,
        lenguageId: languageFilter || undefined,
        difficulty: difficultyFilter || undefined,
      };
      
      const response = await fetchGraphQL(query, variables, token);
      setLevels(response.data?.levelsPaginated || {
        levels: [],
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    } catch (error) {
      console.error('Error fetching levels:', error);
      toast.error('Error al cargar niveles');
    } finally {
      setLoading(false);
    }
  }, [token, search, currentPage, pageSize, activeFilter, languageFilter, difficultyFilter]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const toggleColumnVisibility = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      difficulty: 'Básico',
      lenguageId: '',
      isActive: true,
    });
    setEditingLevel(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('No hay token de autenticación');
      return;
    }

    try {
      if (editingLevel) {
        const mutation = `
          mutation UpdateLevel($updateLevelInput: UpdateLevelInput!) {
            updateLevel(updateLevelInput: $updateLevelInput) {
              success
              message
            }
          }
        `;
        
        await fetchGraphQL(mutation, {
          updateLevelInput: {
            id: editingLevel.id,
            ...formData
          }
        }, token);
        
        toast.success('Nivel actualizado exitosamente');
      } else {
        const mutation = `
          mutation CreateLevel($createLevelInput: CreateLevelInput!) {
            createLevel(createLevelInput: $createLevelInput) {
              success
              message
            }
          }
        `;
        
        await fetchGraphQL(mutation, {
          createLevelInput: formData
        }, token);
        
        toast.success('Nivel creado exitosamente');
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchLevels();
    } catch (error) {
      console.error('Error saving level:', error);
      toast.error(editingLevel ? 'Error al actualizar nivel' : 'Error al crear nivel');
    }
  };

  const handleEdit = (level: Level) => {
    setEditingLevel(level);
    setFormData({
      name: level.name,
      description: level.description,
      difficulty: level.difficulty,
      lenguageId: level.lenguageId,
      isActive: level.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (level: Level) => {
    if (!token) {
      toast.error('No hay token de autenticación');
      return;
    }

    try {
      const mutation = `
        mutation DeleteLevel($id: ID!) {
          removeLevel(id: $id) {
            success
            message
          }
        }
      `;
      
      await fetchGraphQL(mutation, { id: level.id }, token);
      toast.success('Nivel eliminado exitosamente');
      fetchLevels();
    } catch (error) {
      console.error('Error deleting level:', error);
      toast.error('Error al eliminar nivel');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Error en fecha';
    }
  };

  return (
    <div className="px-6 py-6">
      <Card className="max-w-none">
        <CardHeader className="px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                Gestión de Niveles
              </CardTitle>
              <CardDescription>
                Administra los niveles disponibles en la plataforma
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Nivel
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingLevel ? 'Editar Nivel' : 'Crear Nuevo Nivel'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingLevel
                      ? 'Modifica los datos del nivel seleccionado.'
                      : 'Completa los datos para crear un nuevo nivel.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6 py-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Información Básica</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre del Nivel *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ej: Nivel Básico"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Descripción</Label>
                          <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Descripción del nivel..."
                            className="w-full min-h-[100px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Configuración Académica</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="difficulty">Dificultad *</Label>
                          <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona la dificultad" />
                            </SelectTrigger>
                            <SelectContent>
                              {DIFFICULTY_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lenguageId">Idioma *</Label>
                          <Select value={formData.lenguageId} onValueChange={(value) => setFormData(prev => ({ ...prev, lenguageId: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el idioma" />
                            </SelectTrigger>
                            <SelectContent>
                              {languages.map((language) => (
                                <SelectItem key={language.id} value={language.id}>
                                  {language.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Estado y Configuración</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label>Estado</Label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="active"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
                              />
                              <Label htmlFor="active" className="text-sm font-normal">
                                Activo
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="inactive"
                                checked={!formData.isActive}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !checked }))}
                              />
                              <Label htmlFor="inactive" className="text-sm font-normal">
                                Inactivo
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingLevel ? 'Actualizar' : 'Crear'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {/* Search and Filters */}
          <div className="flex items-center justify-between gap-4 mb-6 pt-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar niveles..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <div className="p-2">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Estado</div>
                      <Select value={activeFilter?.toString() || 'all'} onValueChange={(value) => {
                        setActiveFilter(value === 'all' ? undefined : value === 'true');
                        setCurrentPage(1);
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="true">Activos</SelectItem>
                          <SelectItem value="false">Inactivos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="text-sm font-medium">Dificultad</div>
                      <Select value={difficultyFilter || 'all'} onValueChange={(value) => {
                        setDifficultyFilter(value === 'all' ? undefined : value);
                        setCurrentPage(1);
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Dificultad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          {DIFFICULTY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="text-sm font-medium">Idioma</div>
                      <Select value={languageFilter || 'all'} onValueChange={(value) => {
                        setLanguageFilter(value === 'all' ? undefined : value);
                        setCurrentPage(1);
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          {languages.map((language) => (
                            <SelectItem key={language.id} value={language.id}>
                              {language.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Select value={pageSize.toString()} onValueChange={(value) => {
                setPageSize(parseInt(value));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
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
                  onCheckedChange={() => toggleColumnVisibility('name')}
                >
                  Nombre
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.description}
                  onCheckedChange={() => toggleColumnVisibility('description')}
                >
                  Descripción
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.difficulty}
                  onCheckedChange={() => toggleColumnVisibility('difficulty')}
                >
                  Dificultad
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.language}
                  onCheckedChange={() => toggleColumnVisibility('language')}
                >
                  Idioma
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.isActive}
                  onCheckedChange={() => toggleColumnVisibility('isActive')}
                >
                  Estado
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.createdAt}
                  onCheckedChange={() => toggleColumnVisibility('createdAt')}
                >
                  Fecha de Creación
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.updatedAt}
                  onCheckedChange={() => toggleColumnVisibility('updatedAt')}
                >
                  Última Actualización
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.actions}
                  onCheckedChange={() => toggleColumnVisibility('actions')}
                >
                  Acciones
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          <div className="rounded-md border w-full">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  {columnVisibility.name && <TableHead className="text-center">Nombre</TableHead>}
                  {columnVisibility.description && <TableHead className="text-center">Descripción</TableHead>}
                  {columnVisibility.difficulty && <TableHead className="text-center">Dificultad</TableHead>}
                  {columnVisibility.language && <TableHead className="text-center">Idioma</TableHead>}
                  {columnVisibility.isActive && <TableHead className="text-center">Estado</TableHead>}
                  {columnVisibility.createdAt && <TableHead className="text-center">Fecha de Creación</TableHead>}
                  {columnVisibility.updatedAt && <TableHead className="text-center">Última Actualización</TableHead>}
                  {columnVisibility.actions && <TableHead className="text-center">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length} className="text-center py-8">
                      Cargando niveles...
                    </TableCell>
                  </TableRow>
                ) : levels.levels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length} className="text-center py-8">
                      No se encontraron niveles
                    </TableCell>
                  </TableRow>
                ) : (
                  levels.levels.map((level) => (
                    <TableRow key={level.id}>
                      {columnVisibility.name && (
                        <TableCell className="text-center font-medium">
                          {level.name}
                        </TableCell>
                      )}
                      {columnVisibility.description && (
                        <TableCell className="text-center">
                          <div className="max-w-xs truncate">
                            {level.description || 'Sin descripción'}
                          </div>
                        </TableCell>
                      )}
                      {columnVisibility.difficulty && (
                        <TableCell className="text-center">
                          <Badge variant="outline">
                            {level.difficulty}
                          </Badge>
                        </TableCell>
                      )}
                      {columnVisibility.language && (
                        <TableCell className="text-center">
                          {level.lenguage?.name || 'Sin idioma'}
                        </TableCell>
                      )}
                      {columnVisibility.isActive && (
                        <TableCell className="text-center">
                          <Badge variant={level.isActive ? 'default' : 'secondary'}>
                            {level.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                      )}
                      {columnVisibility.createdAt && (
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {formatDate(level.createdAt)}
                        </TableCell>
                      )}
                      {columnVisibility.updatedAt && (
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {formatDate(level.updatedAt)}
                        </TableCell>
                      )}
                      {columnVisibility.actions && (
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEdit(level)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el nivel
                                    "{level.name}" de nuestros servidores.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(level)}>
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {((levels.page - 1) * levels.limit) + 1} a{' '}
              {Math.min(levels.page * levels.limit, levels.total)} de {levels.total} niveles
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!levels.hasPreviousPage}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: levels.totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    const current = levels.page;
                    return page === 1 || page === levels.totalPages || (page >= current - 1 && page <= current + 1);
                  })
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && page - array[index - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="px-2">...</span>}
                        <Button
                          variant={page === levels.page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    );
                  })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!levels.hasNextPage}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}