'use client';

import React, { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, GraduationCap, Search, Settings, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CreateLevelFormSchema, 
  UpdateLevelFormSchema, 
  validateLevelForm,
  type CreateLevelFormData,
  type UpdateLevelFormData 
} from '@/schemas/level-forms';

// GraphQL Queries and Mutations
const GET_LEVELS_PAGINATED = `
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

const GET_LANGUAGES = `
  query GetLanguages {
    lenguagesActivate {
      id
      name
    }
  }
`;

const CREATE_LEVEL = `
  mutation CreateLevel($createLevelInput: CreateLevelInput!) {
    createLevel(createLevelInput: $createLevelInput) {
      id
      name
      description
      difficulty
      isActive
      lenguageId
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_LEVEL = `
  mutation UpdateLevel($updateLevelInput: UpdateLevelInput!) {
    updateLevel(updateLevelInput: $updateLevelInput) {
      id
      name
      description
      difficulty
      isActive
      lenguageId
      createdAt
      updatedAt
    }
  }
`;

const DELETE_LEVEL = `
  mutation DeleteLevel($id: ID!) {
    removeLevel(id: $id) {
      id
      name
    }
  }
`;

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

type GraphQLInputValue = string | number | boolean | null | undefined | string[] | CreateLevelFormData | {
  [key: string]: string | number | boolean | null | undefined | string[];
};

interface GraphQLVariables {
  [key: string]: GraphQLInputValue;
}

import { toast } from 'sonner';

// GraphQL fetch function
const fetchGraphQL = async (query: string, variables?: GraphQLVariables, token?: string) => {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    return result.data;
  } catch (error) {
    console.error('GraphQL Error:', error);
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

// Using Zod-derived types from level-forms.ts
type LevelFormData = CreateLevelFormData;

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
  const { user, token } = useAuth();
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
  const [languageFilter, setLanguageFilter] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    description: false,
    difficulty: true,
    language: true,
    isActive: true,
    createdAt: false,
    updatedAt: false,
    actions: true,
  });

  const fetchLanguages = async () => {
    try {
      const data = await fetchGraphQL(GET_LANGUAGES, {}, token || undefined);
      setLanguages(data.lenguagesActivate || []);
    } catch (error) {
      console.error('Error fetching languages:', error);
      toast.error('Error al cargar los idiomas');
    }
  };

  const fetchLevels = async () => {
    try {
      setLoading(true);
      const data = await fetchGraphQL(
        GET_LEVELS_PAGINATED,
        {
          search: search || undefined,
          page: currentPage,
          limit: pageSize,
          isActive: activeFilter,
          lenguageId: languageFilter || undefined,
          difficulty: difficultyFilter || undefined,
        },
        token || undefined
      );
      setLevels(data.levelsPaginated);
    } catch (error) {
      console.error('Error fetching levels:', error);
      toast.error('Error al cargar los niveles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    fetchLevels();
  }, [currentPage, pageSize, search, activeFilter, languageFilter, difficultyFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLevel) {
        // Para actualización, solo enviar campos que han cambiado y no están vacíos
        const updateData: any = {
          id: editingLevel.id
        };
        
        if (formData.name.trim() !== editingLevel.name) {
          updateData.name = formData.name.trim();
        }
        if (formData.description.trim() !== editingLevel.description) {
          updateData.description = formData.description.trim();
        }
        if (formData.difficulty !== editingLevel.difficulty) {
          updateData.difficulty = formData.difficulty;
        }
        if (formData.lenguageId !== editingLevel.lenguageId) {
          updateData.lenguageId = formData.lenguageId;
        }
        if (formData.isActive !== editingLevel.isActive) {
          updateData.isActive = formData.isActive;
        }
        
        await fetchGraphQL(
          UPDATE_LEVEL,
          {
            updateLevelInput: updateData,
          },
          token || undefined
        );
        toast.success('Nivel actualizado exitosamente');
      } else {
        // Para creación, validar todos los campos
        const validationResult = validateLevelForm(formData, false);
        
        if (!validationResult.success) {
          const errors = validationResult.error.issues.map((err) => err.message).join(', ');
          toast.error(`Errores de validación: ${errors}`);
          return;
        }
        
        await fetchGraphQL(
          CREATE_LEVEL,
          {
            createLevelInput: validationResult.data,
          },
          token || undefined
        );
        toast.success('Nivel creado exitosamente');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchLevels();
    } catch (error) {
      console.error('Error saving level:', error);
      toast.error('Error al guardar el nivel');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchGraphQL(DELETE_LEVEL, { id }, token || undefined);
      toast.success('Nivel eliminado exitosamente');
      fetchLevels();
    } catch (error) {
      console.error('Error deleting level:', error);
      toast.error('Error al eliminar el nivel');
    }
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

  const handleEdit = (level: Level) => {
    setEditingLevel(level);
    setFormData({
      name: level.name,
      description: level.description,
      difficulty: level.difficulty as 'Básico' | 'Básico-Intermedio' | 'Intermedio' | 'Intermedio-Avanzado' | 'Avanzado',
      lenguageId: level.lenguageId,
      isActive: level.isActive,
    });
    setIsDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return 'No disponible';
    }
    
    try {
      // Convertir timestamp a número
      const timestamp = Number(dateString);
      
      if (isNaN(timestamp)) {
        return 'Fecha inválida';
      }
      
      // Crear fecha UTC desde el timestamp
      const utcDate = new Date(timestamp);
      
      if (isNaN(utcDate.getTime())) {
        return 'Fecha inválida';
      }
      
      // Convertir manualmente a hora de México (UTC-6)
      const mexicoOffset = -6 * 60; // -6 horas en minutos
      const localTime = new Date(utcDate.getTime() + (mexicoOffset * 60 * 1000));
      
      // Formatear la fecha
      const formatter = new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      return formatter.format(localTime);
    } catch {
      return 'Error en fecha';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    const option = DIFFICULTY_OPTIONS.find(opt => opt.value === difficulty);
    return option ? option.label : difficulty;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico': return 'bg-green-100 text-green-800';
      case 'Básico-Intermedio': return 'bg-blue-100 text-blue-800';
      case 'Intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'Intermedio-Avanzado': return 'bg-orange-100 text-orange-800';
      case 'Avanzado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                Gestión de Niveles
              </CardTitle>
              <CardDescription>
                Administra los niveles de dificultad para cada idioma
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Nivel
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
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
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nombre
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="description" className="text-right pt-2">
                        Descripción
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="col-span-3"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="difficulty" className="text-right">
                        Dificultad
                      </Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value as 'Básico' | 'Básico-Intermedio' | 'Intermedio' | 'Intermedio-Avanzado' | 'Avanzado' }))}
                      >
                        <SelectTrigger className="col-span-3">
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
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="language" className="text-right">
                        Idioma
                      </Label>
                      <Select
                        value={formData.lenguageId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, lenguageId: value }))}
                      >
                        <SelectTrigger className="col-span-3">
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
                    {editingLevel && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="isActive" className="text-right">
                          Estado
                        </Label>
                        <Select
                          value={formData.isActive.toString()}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, isActive: value === 'true' }))}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecciona el estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Activo</SelectItem>
                            <SelectItem value="false">Inactivo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {!editingLevel && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                          Estado
                        </Label>
                        <div className="col-span-3 flex items-center">
                          <Badge className="bg-green-100 text-green-800">Activo (automático)</Badge>
                        </div>
                      </div>
                    )}

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
                    <div className="space-y-4">
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
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Idioma</div>
                        <Select value={languageFilter} onValueChange={(value) => {
                          setLanguageFilter(value === 'all' ? '' : value);
                          setCurrentPage(1);
                        }}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Idioma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos los idiomas</SelectItem>
                            {languages.map((language) => (
                              <SelectItem key={language.id} value={language.id}>
                                {language.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Dificultad</div>
                        <Select value={difficultyFilter} onValueChange={(value) => {
                          setDifficultyFilter(value === 'all' ? '' : value);
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
          <div className="rounded-md border">
            <Table>
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
                    <TableCell colSpan={8} className="text-center py-8">
                      Cargando niveles...
                    </TableCell>
                  </TableRow>
                ) : levels.levels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No se encontraron niveles
                    </TableCell>
                  </TableRow>
                ) : (
                  levels.levels.map((level) => (
                    <TableRow key={level.id}>
                      {columnVisibility.name && (
                        <TableCell className="font-medium text-center">{level.name}</TableCell>
                      )}
                      {columnVisibility.description && (
                        <TableCell className="max-w-xs truncate text-center">{level.description}</TableCell>
                      )}
                      {columnVisibility.difficulty && (
                        <TableCell className="text-center">
                          <Badge className={getDifficultyColor(level.difficulty)}>
                            {getDifficultyLabel(level.difficulty)}
                          </Badge>
                        </TableCell>
                      )}
                      {columnVisibility.language && (
                        <TableCell className="text-center">{level.lenguage?.name || 'Sin idioma'}</TableCell>
                      )}
                      {columnVisibility.isActive && (
                        <TableCell className="text-center">
                          <Badge variant={level.isActive ? 'default' : 'secondary'}>
                            {level.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                      )}
                      {columnVisibility.createdAt && (
                        <TableCell className="text-center">{formatDate(level.createdAt)}</TableCell>
                      )}
                      {columnVisibility.updatedAt && (
                        <TableCell className="text-center">{formatDate(level.updatedAt)}</TableCell>
                      )}
                      {columnVisibility.actions && (
                        <TableCell className="text-center">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(level)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el nivel
                                    &quot;{level.name}&quot; de la base de datos.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(level.id)}>
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
                onClick={() => handlePageChange(levels.page - 1)}
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
                          onClick={() => handlePageChange(page)}
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
                onClick={() => handlePageChange(levels.page + 1)}
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