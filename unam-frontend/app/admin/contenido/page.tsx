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
import { Plus, Search, Settings, ChevronLeft, ChevronRight, Filter, Edit, Trash2, Check, X } from 'lucide-react';
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

    return result.data;
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
  languageId?: string;
  validationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  assignedTeachers: { id: string; fullName: string }[];
  createdAt: string;
  updatedAt: string;
  level?: {
    id: string;
    name: string;
  };
  skill?: {
    id: string;
    name: string;
  };
  language?: {
    id: string;
    name: string;
  };
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
  languageId: string;
  levelId: string;
  skillId: string;
  teacherIds: string[];
  validationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
};

interface ColumnVisibility {
  name: boolean;
  description: boolean;
  language: boolean;
  level: boolean;
  skill: boolean;
  status: boolean;
  teachers: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  actions: boolean;
}

interface Teacher {
  id: string;
  fullName: string;
  email: string;
}

interface Language {
  id: string;
  name: string;
  descripcion_corta?: string;
}

interface Level {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  lenguageId?: string;
}

interface Skill {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  levelId?: string;
  lenguageId?: string;
}

export default function ContenidoPage() {
  const { token, user } = useAuth();
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
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [languagesLoading, setLanguagesLoading] = useState(false);
  const [levels, setLevels] = useState<Level[]>([]);
  const [levelsLoading, setLevelsLoading] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [formData, setFormData] = useState<ContentFormData>({
    name: '',
    description: '',
    languageId: '',
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
    description: false,
    language: true,
    level: true,
    skill: true,
    status: true,
    teachers: true,
    createdAt: false,
    updatedAt: false,
    actions: true,
  });

  const fetchLanguages = useCallback(async () => {
    if (!token) return;
    
    setLanguagesLoading(true);
    try {
      const query = `
        query GetLanguages {
          lenguagesActivate {
            id
            name
            descripcion_corta
          }
        }
      `;
      
      const response = await fetchGraphQL(query, {}, token);
      setLanguages(response.lenguagesActivate || []);
    } catch (error) {
      console.error('Error fetching languages:', error);
      toast.error('Error al cargar los idiomas');
    } finally {
      setLanguagesLoading(false);
    }
  }, [token]);

  const fetchLevels = useCallback(async (languageId?: string) => {
    if (!token || !languageId) return;
    
    setLevelsLoading(true);
    try {
      const query = `
        query GetLevelsByLenguage($lenguageId: ID!) {
          levelsByLenguage(lenguageId: $lenguageId) {
            id
            name
            description
            difficulty
            lenguageId
          }
        }
      `;
      
      const response = await fetchGraphQL(query, { lenguageId: languageId }, token);
      const levels = response.levelsByLenguage || [];
      
      setLevels(levels);
    } catch (error) {
      console.error('Error fetching levels:', error);
      toast.error('Error al cargar los niveles');
    } finally {
      setLevelsLoading(false);
    }
  }, [token]);

  const fetchSkills = useCallback(async (levelId?: string, languageId?: string) => {
    if (!token || !levelId || !languageId) return;
    
    setSkillsLoading(true);
    try {
      const query = `
        query GetSkillsByLevelAndLanguage($levelId: ID!, $languageId: ID!) {
          skillsByLevelAndLanguage(levelId: $levelId, languageId: $languageId) {
            id
            name
            description
            difficulty
            levelId
            lenguageId
          }
        }
      `;
      
      const response = await fetchGraphQL(query, { levelId, languageId }, token);
      const skills = response.skillsByLevelAndLanguage || [];
      
      setSkills(skills);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Error al cargar las habilidades');
    } finally {
      setSkillsLoading(false);
    }
  }, [token]);

  const fetchTeachers = useCallback(async () => {
    if (!token) return;
    
    setTeachersLoading(true);
    try {
      const query = `
        query GetTeachers {
          users(roles: [docente]) {
            id
            fullName
            email
          }
        }
      `;
      
      const response = await fetchGraphQL(query, {}, token);
      if (response?.users) {
        setTeachers(response.users);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Error al cargar los profesores');
    } finally {
      setTeachersLoading(false);
    }
  }, [token]);

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
              languageId
              validationStatus
              assignedTeachers {
                id
                fullName
              }
              createdAt
              updatedAt
              level {
                id
                name
              }
              skill {
                id
                name
              }
              language {
                id
                name
              }
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
      setContents(response?.contentsPaginated || {
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

  useEffect(() => {
    if (token) {
      fetchLanguages();
      fetchTeachers();
    }
  }, [token, fetchLanguages, fetchTeachers]);

  // Cargar niveles cuando cambia el idioma seleccionado
  useEffect(() => {
    if (formData.languageId) {
      fetchLevels(formData.languageId);
      // Limpiar nivel y skill cuando cambia el idioma
      setFormData(prev => ({ ...prev, levelId: '', skillId: '' }));
    }
  }, [formData.languageId, fetchLevels]);

  // Cargar skills cuando cambia el nivel seleccionado
  useEffect(() => {
    if (formData.levelId) {
      fetchSkills(formData.levelId, formData.languageId);
      // Limpiar skill cuando cambia el nivel
      setFormData(prev => ({ ...prev, skillId: '' }));
    }
  }, [formData.levelId, formData.languageId, fetchSkills]);

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
      languageId: '',
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

    // Validar campos requeridos
    if (!formData.name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('La descripción es requerida');
      return;
    }
    
    if (!formData.languageId) {
      toast.error('El idioma es requerido');
      return;
    }
    
    if (!formData.levelId) {
      toast.error('El nivel es requerido');
      return;
    }
    
    if (!formData.skillId) {
      toast.error('La habilidad es requerida');
      return;
    }

    try {
      if (editingContent) {
        const mutation = `
          mutation UpdateContent($updateContentInput: UpdateContentInput!) {
            updateContent(updateContentInput: $updateContentInput) {
              id
              name
              description
              validationStatus
            }
          }
        `;
        
        await fetchGraphQL(mutation, {
          updateContentInput: {
            id: editingContent.id,
            name: formData.name,
            description: formData.description,
            languageId: formData.languageId,
            levelId: formData.levelId,
            skillId: formData.skillId,
            teacherIds: formData.teacherIds,
            validationStatus: formData.validationStatus
          }
        }, token);
        
        toast.success('Contenido actualizado exitosamente');
      } else {
        const mutation = `
          mutation CreateContent($createContentInput: CreateContentInput!) {
            createContent(createContentInput: $createContentInput) {
              id
              name
              description
              validationStatus
            }
          }
        `;
        
        await fetchGraphQL(mutation, {
          createContentInput: {
            name: formData.name,
            description: formData.description,
            languageId: formData.languageId,
            levelId: formData.levelId,
            skillId: formData.skillId,
            teacherIds: formData.teacherIds,
            validationStatus: formData.validationStatus
          }
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

  const handleCreate = () => {
    setEditingContent(null);
    setFormData({
      name: '',
      description: '',
      languageId: '',
      levelId: '',
      skillId: '',
      teacherIds: [],
      validationStatus: 'PENDING',
    });
    
    // Load all necessary data for creating
    fetchTeachers();
    fetchLanguages();
    
    // Reset dependent data
    setLevels([]);
    setSkills([]);
    
    setIsDialogOpen(true);
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



  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setFormData({
      name: content.name,
      description: content.description,
      languageId: content.languageId || '',
      levelId: content.levelId,
      skillId: content.skillId,
      teacherIds: content.assignedTeachers.map(t => t.id),
      validationStatus: content.validationStatus,
    });
    
    // Load dependent data
    if (content.languageId) {
      fetchLevels(content.languageId);
      if (content.levelId) {
        fetchSkills(content.levelId, content.languageId);
      }
    }
    
    setIsDialogOpen(true);
  };

  const handleApprove = async (contentId: string) => {
    if (!token) {
      toast.error('No hay token de autenticación');
      return;
    }

    try {
      const mutation = `
        mutation UpdateContent($updateContentInput: UpdateContentInput!) {
          updateContent(updateContentInput: $updateContentInput) {
            id
            validationStatus
          }
        }
      `;

      const result = await fetchGraphQL(mutation, {
        updateContentInput: {
          id: contentId,
          validationStatus: 'APPROVED'
        }
      }, token);

      if (result.updateContent && result.updateContent.id) {
        toast.success('Contenido aprobado exitosamente');
        fetchContents();
      } else {
        toast.error('Error al aprobar contenido');
      }
    } catch (error) {
      console.error('Error approving content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al aprobar contenido: ${errorMessage}`);
    }
  };

  const handleReject = async (contentId: string) => {
    if (!token) {
      toast.error('No hay token de autenticación');
      return;
    }

    try {
      const mutation = `
        mutation UpdateContent($updateContentInput: UpdateContentInput!) {
          updateContent(updateContentInput: $updateContentInput) {
            id
            validationStatus
          }
        }
      `;

      const result = await fetchGraphQL(mutation, {
        updateContentInput: {
          id: contentId,
          validationStatus: 'REJECTED'
        }
      }, token);

      if (result.updateContent && result.updateContent.id) {
        toast.success('Contenido rechazado exitosamente');
        fetchContents();
      } else {
        toast.error('Error al rechazar contenido');
      }
    } catch (error) {
      console.error('Error rejecting content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al rechazar contenido: ${errorMessage}`);
    }
  };

  const handleDelete = async (contentId: string) => {
    if (!token) {
      toast.error('No hay token de autenticación');
      return;
    }

    try {
      const mutation = `
        mutation DeleteContent($id: ID!) {
          removeContent(id: $id) {
            success
            message
          }
        }
      `;

      const result = await fetchGraphQL(mutation, {
        id: contentId
      }, token);

      if (result.removeContent.success) {
        toast.success('Contenido eliminado exitosamente');
        fetchContents();
      } else {
        toast.error(result.removeContent.message || 'Error al eliminar contenido');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Error al eliminar contenido');
    }
  };



  // Verificar si el usuario tiene permisos para ver comentarios
  const canViewComments = user && (user.roles.includes('admin') || user.roles.includes('docente') || user.roles.includes('superUser'));

  return (
    <div className="px-6 py-6">
      <Card className="max-w-none">
        <CardHeader className="px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                Gestión de Contenidos
              </CardTitle>
              <CardDescription>
                Administra los contenidos disponibles en la plataforma
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate}>
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
                      <h3 className="text-lg font-semibold border-b pb-2">Clasificación</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label>Idioma *</Label>
                          <Select 
                            value={formData.languageId && languages.find(l => l.id === formData.languageId) ? formData.languageId : ''} 
                            onValueChange={(value) => {
                              // Solo resetear nivel y habilidad si realmente cambió el idioma
                              const shouldReset = value !== formData.languageId;
                              setFormData(prev => ({ 
                                ...prev, 
                                languageId: value, 
                                levelId: shouldReset ? '' : prev.levelId,
                                skillId: shouldReset ? '' : prev.skillId
                              }));
                              fetchLevels(value);
                              if (shouldReset) {
                                setSkills([]);
                              }
                            }}
                            disabled={languagesLoading}
                          >
                            <SelectTrigger>
                              <SelectValue 
                                placeholder="Selecciona un idioma" 
                                className={formData.languageId && !languages.find(l => l.id === formData.languageId) ? 'text-red-500' : ''}
                              >
                                {formData.languageId && languages.find(l => l.id === formData.languageId) 
                                  ? languages.find(l => l.id === formData.languageId)?.name
                                  : formData.languageId ? 'Idioma no encontrado' : 'Selecciona un idioma'
                                }
                              </SelectValue>
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
                          <Label>Nivel *</Label>
                          <Select 
                            value={formData.levelId && levels.find(l => l.id === formData.levelId) ? formData.levelId : ''} 
                            onValueChange={(value) => {
                              // Solo resetear habilidad si realmente cambió el nivel
                              const shouldReset = value !== formData.levelId;
                              setFormData(prev => ({ 
                                ...prev, 
                                levelId: value, 
                                skillId: shouldReset ? '' : prev.skillId
                              }));
                              if (formData.languageId) {
                                fetchSkills(value, formData.languageId);
                              }
                            }}
                            disabled={levelsLoading || !formData.languageId}
                          >
                            <SelectTrigger>
                              <SelectValue 
                                placeholder="Selecciona un nivel" 
                                className={formData.levelId && !levels.find(l => l.id === formData.levelId) ? 'text-red-500' : ''}
                              >
                                {formData.levelId && levels.find(l => l.id === formData.levelId) 
                                  ? `${levels.find(l => l.id === formData.levelId)?.name} - ${levels.find(l => l.id === formData.levelId)?.difficulty}`
                                  : formData.levelId ? 'Nivel no encontrado' : 'Selecciona un nivel'
                                }
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {levels.map((level) => (
                                <SelectItem key={level.id} value={level.id}>
                                  {level.name} - {level.difficulty}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Habilidad *</Label>
                          <Select 
                            value={formData.skillId && skills.find(s => s.id === formData.skillId) ? formData.skillId : ''} 
                            onValueChange={(value) => setFormData(prev => ({ ...prev, skillId: value }))}
                            disabled={skillsLoading || !formData.levelId}
                          >
                            <SelectTrigger>
                              <SelectValue 
                                placeholder="Selecciona una habilidad" 
                                className={formData.skillId && !skills.find(s => s.id === formData.skillId) ? 'text-red-500' : ''}
                              >
                                {formData.skillId && skills.find(s => s.id === formData.skillId) 
                                  ? `${skills.find(s => s.id === formData.skillId)?.name} - ${skills.find(s => s.id === formData.skillId)?.difficulty}`
                                  : formData.skillId ? 'Habilidad no encontrada' : 'Selecciona una habilidad'
                                }
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {skills.map((skill) => (
                                <SelectItem key={skill.id} value={skill.id}>
                                  {skill.name} - {skill.difficulty}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {!editingContent && (
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
                    )}

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Asignación de Profesores</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label>Profesores Asignados</Label>
                          {teachersLoading ? (
                            <div className="text-sm text-muted-foreground">Cargando profesores...</div>
                          ) : (
                            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                              {teachers.length === 0 ? (
                                <div className="text-sm text-muted-foreground">No hay profesores disponibles</div>
                              ) : (
                                teachers.map((teacher) => (
                                  <div key={teacher.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`teacher-${teacher.id}`}
                                      checked={formData.teacherIds.includes(teacher.id)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setFormData(prev => ({
                                            ...prev,
                                            teacherIds: [...prev.teacherIds, teacher.id]
                                          }));
                                        } else {
                                          setFormData(prev => ({
                                            ...prev,
                                            teacherIds: prev.teacherIds.filter(id => id !== teacher.id)
                                          }));
                                        }
                                      }}
                                    />
                                    <Label htmlFor={`teacher-${teacher.id}`} className="text-sm font-normal flex-1">
                                      <div>
                                        <div className="font-medium">{teacher.fullName}</div>
                                        <div className="text-xs text-muted-foreground">{teacher.email}</div>
                                      </div>
                                    </Label>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                          {formData.teacherIds.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                              {formData.teacherIds.length} profesor(es) seleccionado(s)
                            </div>
                          )}
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
            </div>
            <div className="flex items-center space-x-2">
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
                  checked={columnVisibility.language}
                  onCheckedChange={() => toggleColumnVisibility('language')}
                >
                  Idioma
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
        </div>

          {/* Table */}
          <div className="rounded-md border w-full">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  {columnVisibility.name && <TableHead className="text-center">Nombre</TableHead>}
                  {columnVisibility.description && <TableHead className="text-center">Descripción</TableHead>}
                  {columnVisibility.language && <TableHead className="text-center">Idioma</TableHead>}
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
                      {columnVisibility.language && (
                        <TableCell className="text-center">
                          {content.language?.name || 'Sin idioma'}
                        </TableCell>
                      )}
                      {columnVisibility.level && (
                        <TableCell className="text-center">
                          {content.level?.name || 'Sin nivel'}
                        </TableCell>
                      )}
                      {columnVisibility.skill && (
                        <TableCell className="text-center">
                          {content.skill?.name || 'Sin habilidad'}
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
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(content)}
                              title="Editar contenido"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {content.validationStatus === 'APPROVED' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(content.id)}
                                title="Rechazar contenido"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprove(content.id)}
                                title="Aprobar contenido"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  title="Eliminar contenido"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el contenido.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(content.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
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