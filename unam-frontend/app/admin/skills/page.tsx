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
import { Plus, Edit, Trash2, Target, Search, Settings, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
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

interface Skill {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  levelId?: string | null;
  lenguageId?: string | null;
  level?: {
    id: string;
    name: string;
  };
  lenguage?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PaginatedSkills {
  skills: Skill[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

type SkillFormData = {
  name: string;
  description: string;
  isActive: boolean;
  levelId?: string | null;
  lenguageId?: string | null;
};

interface Language {
  id: string;
  name: string;
  isActive: boolean;
}

interface Level {
  id: string;
  name: string;
  isActive: boolean;
  lenguageId: string;
}

interface ColumnVisibility {
  name: boolean;
  description: boolean;
  isActive: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  actions: boolean;
}

export default function SkillsPage() {
  const { token } = useAuth();
  const [skills, setSkills] = useState<PaginatedSkills>({
    skills: [],
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<SkillFormData>({
    name: '',
    description: '',
    isActive: true,
    levelId: null,
    lenguageId: null,
  });
  const [languages, setLanguages] = useState<Language[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [filteredLevels, setFilteredLevels] = useState<Level[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    description: true,
    isActive: true,
    createdAt: false,
    updatedAt: false,
    actions: true,
  });

  const fetchSkills = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const query = `
        query GetSkillsPaginated($search: String, $page: Int, $limit: Int, $isActive: Boolean) {
          skillsPaginated(search: $search, page: $page, limit: $limit, isActive: $isActive) {
            skills {
              id
              name
              description
              isActive
              levelId
              lenguageId
              level {
                id
                name
              }
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
      };
      
      const response = await fetchGraphQL(query, variables, token);
      setSkills(response.data?.skillsPaginated || {
        skills: [],
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Error al cargar habilidades');
    } finally {
      setLoading(false);
    }
  }, [token, search, currentPage, pageSize, activeFilter]);

  const fetchLanguages = useCallback(async () => {
    if (!token) return;
    
    try {
      const query = `
        query GetLanguages {
          lenguages {
            id
            name
            isActive
          }
        }
      `;
      
      const response = await fetchGraphQL(query, {}, token);
      setLanguages(response.data?.lenguages?.filter((lang: Language) => lang.isActive) || []);
    } catch (error) {
      console.error('Error fetching languages:', error);
      toast.error('Error al cargar idiomas');
    }
  }, [token]);

  const fetchLevels = useCallback(async () => {
    if (!token) return;
    
    try {
      const query = `
        query GetLevels {
          levels {
            id
            name
            isActive
            lenguageId
          }
        }
      `;
      
      const response = await fetchGraphQL(query, {}, token);
      setLevels(response.data?.levels?.filter((level: Level) => level.isActive) || []);
    } catch (error) {
      console.error('Error fetching levels:', error);
      toast.error('Error al cargar niveles');
    }
  }, [token]);

  useEffect(() => {
    fetchSkills();
    fetchLanguages();
    fetchLevels();
  }, [fetchSkills, fetchLanguages, fetchLevels]);

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
      isActive: true,
      levelId: null,
      lenguageId: null,
    });
    setEditingSkill(null);
    setFilteredLevels([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('No hay token de autenticación');
      return;
    }

    try {
      if (editingSkill) {
        const mutation = `
          mutation UpdateSkill($updateSkillInput: UpdateSkillInput!) {
            updateSkill(updateSkillInput: $updateSkillInput) {
              success
              message
            }
          }
        `;
        
        await fetchGraphQL(mutation, {
          updateSkillInput: {
            id: editingSkill.id,
            ...formData
          }
        }, token);
        
        toast.success('Habilidad actualizada exitosamente');
      } else {
        const mutation = `
          mutation CreateSkill($createSkillInput: CreateSkillInput!) {
            createSkill(createSkillInput: $createSkillInput) {
              success
              message
            }
          }
        `;
        
        await fetchGraphQL(mutation, {
          createSkillInput: formData
        }, token);
        
        toast.success('Habilidad creada exitosamente');
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchSkills();
    } catch (error) {
      console.error('Error saving skill:', error);
      toast.error(editingSkill ? 'Error al actualizar habilidad' : 'Error al crear habilidad');
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      description: skill.description,
      isActive: skill.isActive,
      levelId: skill.levelId || null,
      lenguageId: skill.lenguageId || null,
    });
    
    // Filtrar niveles si hay un idioma seleccionado
    if (skill.lenguageId) {
      const filtered = levels.filter(level => level.lenguageId === skill.lenguageId);
      setFilteredLevels(filtered);
    } else {
      setFilteredLevels([]);
    }
    
    setIsDialogOpen(true);
  };

  // Función para manejar el cambio de idioma
  const handleLanguageChange = (languageId: string | null) => {
    setFormData(prev => ({ 
      ...prev, 
      lenguageId: languageId,
      levelId: null // Reset level when language changes
    }));
    
    if (languageId) {
      const filtered = levels.filter(level => level.lenguageId === languageId);
      setFilteredLevels(filtered);
    } else {
      setFilteredLevels([]);
    }
  };

  const handleDelete = async (skill: Skill) => {
    if (!token) {
      toast.error('No hay token de autenticación');
      return;
    }

    try {
      const mutation = `
        mutation DeleteSkill($id: ID!) {
          removeSkill(id: $id) {
            success
            message
          }
        }
      `;
      
      await fetchGraphQL(mutation, { id: skill.id }, token);
      toast.success('Habilidad eliminada exitosamente');
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Error al eliminar habilidad');
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
                <Target className="h-6 w-6" />
                Gestión de Habilidades
              </CardTitle>
              <CardDescription>
                Administra las habilidades disponibles en la plataforma
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Habilidad
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingSkill ? 'Editar Habilidad' : 'Crear Nueva Habilidad'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingSkill
                      ? 'Modifica los datos de la habilidad seleccionada.'
                      : 'Completa los datos para crear una nueva habilidad.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6 py-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Información Básica</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre de la Habilidad *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ej: Comprensión Lectora"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Descripción</Label>
                          <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Descripción de la habilidad..."
                            className="w-full min-h-[100px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Asignación</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="language">Idioma *</Label>
                          <Select
                            value={formData.lenguageId || ''}
                            onValueChange={(value) => handleLanguageChange(value || null)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un idioma" />
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
                        <div className="space-y-2">
                          <Label htmlFor="level">Nivel *</Label>
                          <Select
                            value={formData.levelId || ''}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, levelId: value || null }))}
                            disabled={!formData.lenguageId || filteredLevels.length === 0}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={!formData.lenguageId ? "Primero selecciona un idioma" : "Selecciona un nivel"} />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredLevels.map((level) => (
                                <SelectItem key={level.id} value={level.id}>
                                  {level.name}
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
                      {editingSkill ? 'Actualizar' : 'Crear'}
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
                  placeholder="Buscar habilidades..."
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
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
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
            <Select value={pageSize.toString()} onValueChange={(value) => {
              setPageSize(parseInt(value));
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[70px]">
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

          {/* Table */}
          <div className="rounded-md border w-full">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  {columnVisibility.name && <TableHead className="text-center">Nombre</TableHead>}
                  {columnVisibility.description && <TableHead className="text-center">Descripción</TableHead>}
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
                      Cargando habilidades...
                    </TableCell>
                  </TableRow>
                ) : skills.skills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length} className="text-center py-8">
                      No se encontraron habilidades
                    </TableCell>
                  </TableRow>
                ) : (
                  skills.skills.map((skill) => (
                    <TableRow key={skill.id}>
                      {columnVisibility.name && (
                        <TableCell className="text-center font-medium">
                          {skill.name}
                        </TableCell>
                      )}
                      {columnVisibility.description && (
                        <TableCell className="text-center">
                          <div className="max-w-xs truncate">
                            {skill.description || 'Sin descripción'}
                          </div>
                        </TableCell>
                      )}
                      {columnVisibility.isActive && (
                        <TableCell className="text-center">
                          <Badge variant={skill.isActive ? 'default' : 'secondary'}>
                            {skill.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                      )}
                      {columnVisibility.createdAt && (
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {formatDate(skill.createdAt)}
                        </TableCell>
                      )}
                      {columnVisibility.updatedAt && (
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {formatDate(skill.updatedAt)}
                        </TableCell>
                      )}
                      {columnVisibility.actions && (
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEdit(skill)}
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
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente la habilidad
                                    "{skill.name}" de nuestros servidores.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(skill)}>
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
              Mostrando {((skills.page - 1) * skills.limit) + 1} a{' '}
              {Math.min(skills.page * skills.limit, skills.total)} de {skills.total} habilidades
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!skills.hasPreviousPage}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: skills.totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    const current = skills.page;
                    return page === 1 || page === skills.totalPages || (page >= current - 1 && page <= current + 1);
                  })
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && page - array[index - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="px-2">...</span>}
                        <Button
                          variant={page === skills.page ? 'default' : 'outline'}
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
                disabled={!skills.hasNextPage}
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