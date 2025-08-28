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
import { Plus, Edit, Trash2, FileText, Search, Settings, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
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

interface Content {
  id: string;
  name: string;
  description: string;
  levelId: string;
  skillId: string;
  validationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  assignedTeachers: { id: string; fullName: string }[];
  createdAt: string;
  updatedAt: string;
}

interface PaginatedContents {
  contents: Content[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

type ContentFormData = {
  name: string;
  description: string;
  levelId: string;
  skillId: string;
  teacherIds: string[];
  validationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
};

interface ColumnVisibility {
  name: boolean;
  description: boolean;
  level: boolean;
  skill: boolean;
  status: boolean;
  teachers: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  actions: boolean;
}

export default function ContenidoPage() {
  const { token } = useAuth();
  const [contents, setContents] = useState<PaginatedContents>({
    contents: [],
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [formData, setFormData] = useState<ContentFormData>({
    name: '',
    description: '',
    levelId: '',
    skillId: '',
    teacherIds: [],
    validationStatus: 'PENDING',
  });
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [activeFilter, setActiveFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | undefined>(undefined);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    description: true,
    level: true,
    skill: true,
    status: true,
    teachers: true,
    createdAt: false,
    updatedAt: false,
    actions: true,
  });

  const fetchContents = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const query = `
        query GetContentsPaginated($search: String, $page: Int, $limit: Int, $validationStatus: String) {
          contentsPaginated(search: $search, page: $page, limit: $limit, validationStatus: $validationStatus) {
            contents {
              id
              name
              description
              levelId
              skillId
              validationStatus
              assignedTeachers {
                id
                fullName
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
        validationStatus: activeFilter || undefined,
      };
      
      const response = await fetchGraphQL(query, variables, token);
      setContents(response.data?.contentsPaginated || {
        contents: [],
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast.error('Error al cargar contenidos');
    } finally {
      setLoading(false);
    }
  }, [token, search, currentPage, pageSize, activeFilter]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

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
      levelId: '',
      skillId: '',
      teacherIds: [],
      validationStatus: 'PENDING',
    });
    setEditingContent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('No hay token de autenticación');
      return;
    }

    try {
      if (editingContent) {
        const mutation = `
          mutation UpdateContent($updateContentInput: UpdateContentInput!) {
            updateContent(updateContentInput: $updateContentInput) {
              success
              message
            }
          }
        `;
        
        await fetchGraphQL(mutation, {
          updateContentInput: {
            id: editingContent.id,
            ...formData
          }
        }, token);
        
        toast.success('Contenido actualizado exitosamente');
      } else {
        const mutation = `
          mutation CreateContent($createContentInput: CreateContentInput!) {
            createContent(createContentInput: $createContentInput) {
              success
              message
            }
          }
        `;
        
        await fetchGraphQL(mutation, {
          createContentInput: formData
        }, token);
        
        toast.success('Contenido creado exitosamente');
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchContents();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error(editingContent ? 'Error al actualizar contenido' : 'Error al crear contenido');
    }
  };

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setFormData({
      name: content.name,
      description: content.description,
      levelId: content.levelId,
      skillId: content.skillId,
      teacherIds: content.assignedTeachers?.map(t => t.id) || [],
      validationStatus: content.validationStatus,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (content: Content) => {
    if (!token) {
      toast.error('No hay token de autenticación');
      return;
    }

    try {
      const mutation = `
        mutation DeleteContent($id: ID!) {
          deleteContent(id: $id) {
            success
            message
          }
        }
      `;
      
      await fetchGraphQL(mutation, { id: content.id }, token);
      toast.success('Contenido eliminado exitosamente');
      fetchContents();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Error al eliminar contenido');
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
                <FileText className="h-6 w-6" />
                Gestión de Contenidos
              </CardTitle>
              <CardDescription>
                Administra los contenidos disponibles en la plataforma
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Contenido
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingContent ? 'Editar Contenido' : 'Crear Nuevo Contenido'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingContent
                      ? 'Modifica los datos del contenido seleccionado.'
                      : 'Completa los datos para crear un nuevo contenido.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6 py-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Información Básica</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre del Contenido *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ej: Introducción al Inglés"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Descripción</Label>
                          <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Descripción del contenido..."
                            className="w-full min-h-[100px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Estado y Configuración</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label>Estado de Validación</Label>
                          <div className="space-y-2">
                            {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                              <div key={status} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`status-${status}`}
                                  checked={formData.validationStatus === status}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setFormData(prev => ({ ...prev, validationStatus: status as 'PENDING' | 'APPROVED' | 'REJECTED' }));
                                    }
                                  }}
                                />
                                <Label htmlFor={`status-${status}`} className="text-sm font-normal">
                                  {status === 'PENDING' ? 'Pendiente' : status === 'APPROVED' ? 'Aprobado' : 'Rechazado'}
                                </Label>
                              </div>
                            ))}
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
                      {editingContent ? 'Actualizar' : 'Crear'}
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
                  placeholder="Buscar contenidos..."
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
                        setActiveFilter(value === 'all' ? undefined : value as 'PENDING' | 'APPROVED' | 'REJECTED');
                        setCurrentPage(1);
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="PENDING">Pendientes</SelectItem>
                          <SelectItem value="APPROVED">Aprobados</SelectItem>
                          <SelectItem value="REJECTED">Rechazados</SelectItem>
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
                  checked={columnVisibility.level}
                  onCheckedChange={() => toggleColumnVisibility('level')}
                >
                  Nivel
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.skill}
                  onCheckedChange={() => toggleColumnVisibility('skill')}
                >
                  Habilidad
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.status}
                  onCheckedChange={() => toggleColumnVisibility('status')}
                >
                  Estado
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.teachers}
                  onCheckedChange={() => toggleColumnVisibility('teachers')}
                >
                  Profesores
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
                  {columnVisibility.level && <TableHead className="text-center">Nivel</TableHead>}
                  {columnVisibility.skill && <TableHead className="text-center">Habilidad</TableHead>}
                  {columnVisibility.status && <TableHead className="text-center">Estado</TableHead>}
                  {columnVisibility.teachers && <TableHead className="text-center">Profesores</TableHead>}
                  {columnVisibility.createdAt && <TableHead className="text-center">Fecha de Creación</TableHead>}
                  {columnVisibility.updatedAt && <TableHead className="text-center">Última Actualización</TableHead>}
                  {columnVisibility.actions && <TableHead className="text-center">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length} className="text-center py-8">
                      Cargando contenidos...
                    </TableCell>
                  </TableRow>
                ) : contents.contents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length} className="text-center py-8">
                      No se encontraron contenidos
                    </TableCell>
                  </TableRow>
                ) : (
                  contents.contents.map((content) => (
                    <TableRow key={content.id}>
                      {columnVisibility.name && (
                        <TableCell className="text-center font-medium">
                          {content.name}
                        </TableCell>
                      )}
                      {columnVisibility.description && (
                        <TableCell className="text-center">
                          <div className="max-w-xs truncate">
                            {content.description || 'Sin descripción'}
                          </div>
                        </TableCell>
                      )}
                      {columnVisibility.level && (
                        <TableCell className="text-center">
                          {content.levelId || 'Sin nivel'}
                        </TableCell>
                      )}
                      {columnVisibility.skill && (
                        <TableCell className="text-center">
                          {content.skillId || 'Sin habilidad'}
                        </TableCell>
                      )}
                      {columnVisibility.status && (
                        <TableCell className="text-center">
                          <Badge variant={
                            content.validationStatus === 'APPROVED' ? 'default' :
                            content.validationStatus === 'PENDING' ? 'secondary' : 'destructive'
                          }>
                            {content.validationStatus === 'PENDING' ? 'Pendiente' :
                             content.validationStatus === 'APPROVED' ? 'Aprobado' : 'Rechazado'}
                          </Badge>
                        </TableCell>
                      )}
                      {columnVisibility.teachers && (
                        <TableCell className="text-center">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {content.assignedTeachers?.length > 0 ? (
                              content.assignedTeachers.map((teacher) => (
                                <Badge key={teacher.id} variant="outline" className="text-xs">
                                  {teacher.fullName}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">Sin profesores</span>
                            )}
                          </div>
                        </TableCell>
                      )}
                      {columnVisibility.createdAt && (
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {formatDate(content.createdAt)}
                        </TableCell>
                      )}
                      {columnVisibility.updatedAt && (
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {formatDate(content.updatedAt)}
                        </TableCell>
                      )}
                      {columnVisibility.actions && (
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEdit(content)}
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
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el contenido
                                    "{content.name}" de nuestros servidores.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(content)}>
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
              Mostrando {((contents.page - 1) * contents.limit) + 1} a{' '}
              {Math.min(contents.page * contents.limit, contents.total)} de {contents.total} contenidos
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={!contents.hasPreviousPage}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: contents.totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    const current = contents.page;
                    return page === 1 || page === contents.totalPages || (page >= current - 1 && page <= current + 1);
                  })
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && page - array[index - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="px-2">...</span>}
                        <Button
                          variant={page === contents.page ? 'default' : 'outline'}
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
                disabled={!contents.hasNextPage}
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