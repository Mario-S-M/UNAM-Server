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
import { Plus, Edit, Trash2, Languages, Search, Settings, ChevronLeft, ChevronRight, Upload, Image, Filter } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageTable } from './components/LanguageTable';
import { LanguageEntity, LanguageColumnVisibility } from '@/types';
import { 
  validateLanguageForm,
  type CreateLanguageFormData,
  type UpdateLanguageFormData 
} from '@/schemas/language-forms';
import { 
  LANGUAGE_LIST_FRAGMENT, 
  MUTATION_RESPONSE_FRAGMENT,
  DELETE_RESPONSE_FRAGMENT 
} from '@/lib/graphql/fragments';

// GraphQL Queries and Mutations
const GET_LANGUAGES_PAGINATED = `
  ${LANGUAGE_LIST_FRAGMENT}
  
  query GetLanguagesPaginated($search: String, $page: Int, $limit: Int, $isActive: Boolean) {
    lenguagesPaginated(search: $search, page: $page, limit: $limit, isActive: $isActive) {
      lenguages {
        ...LanguageListFields
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

const CREATE_LANGUAGE = `
  ${MUTATION_RESPONSE_FRAGMENT}
  
  mutation CreateLanguage($createLenguageInput: CreateLenguageInput!) {
    createLenguage(createLenguageInput: $createLenguageInput) {
      ...MutationResponseFields
    }
  }
`;

const UPDATE_LANGUAGE = `
  ${MUTATION_RESPONSE_FRAGMENT}
  
  mutation UpdateLanguage($updateLenguageInput: UpdateLenguageInput!) {
    updateLenguage(updateLenguageInput: $updateLenguageInput) {
      ...MutationResponseFields
    }
  }
`;

const DELETE_LANGUAGE = `
  ${DELETE_RESPONSE_FRAGMENT}
  
  mutation DeleteLanguage($id: ID!) {
    removeLenguage(id: $id) {
      ...DeleteResponseFields
    }
  }
`;

const TOGGLE_LANGUAGE_STATUS = `
  ${MUTATION_RESPONSE_FRAGMENT}
  
  mutation ToggleLanguageStatus($id: ID!) {
    toggleLanguageStatus(id: $id) {
      ...MutationResponseFields
    }
  }
`;

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

type GraphQLInputValue = string | number | boolean | null | undefined | string[] | CreateLanguageFormData | {
  [key: string]: string | number | boolean | null | undefined | string[];
};

interface GraphQLVariables {
  [key: string]: GraphQLInputValue;
}

import { toast } from 'sonner';
import { useLanguageMutations } from './hooks/useLanguageMutations';

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
      // Retornar el error en lugar de lanzarlo para manejo silencioso
      return { error: result.errors[0].message };
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
  eslogan_atractivo: string | null;
  descripcion_corta: string | null;
  descripcion_completa: string | null;
  nivel: 'Básico' | 'Básico-Intermedio' | 'Intermedio' | 'Intermedio-Avanzado' | 'Avanzado' | null;
  color_tema: string | null;
  icono_curso: string | null;
  imagen_hero: string | null;
  badge_destacado?: 'Más Popular' | 'Nuevo' | 'Recomendado' | null;
  idioma_origen: string | null;
  idioma_destino: string | null;
  certificado_digital: boolean;
  puntuacion_promedio: number;
  total_estudiantes_inscritos: number;
  estado: 'Activo' | 'Inactivo' | 'En Desarrollo' | 'Pausado';
  featured: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  icons?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedLanguages {
  lenguages: Language[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Using Zod-derived types from language-forms.ts
type LanguageFormData = CreateLanguageFormData;

// Usar LanguageColumnVisibility directamente
type ColumnVisibility = LanguageColumnVisibility;

export default function IdiomasPage() {
  const { token } = useAuth();
  const { createLanguage, updateLanguage, deleteLanguage, toggleLanguageStatus } = useLanguageMutations();
  const [languages, setLanguages] = useState<PaginatedLanguages>({
    lenguages: [],
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [formData, setFormData] = useState<LanguageFormData>({
    name: '',
    eslogan_atractivo: '',
    descripcion_corta: '',
    descripcion_completa: '',
    nivel: 'Básico',

    color_tema: '#000000',
    icono_curso: '',
    imagen_hero: '',
    badge_destacado: undefined,
    idioma_origen: '',
    idioma_destino: '',
    certificado_digital: false,
    puntuacion_promedio: 0,
    total_estudiantes_inscritos: 0,
    estado: 'Activo',
    featured: false,
    icons: [],
    isActive: true,
  });
  const [iconInput, setIconInput] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  // Función para manejar la subida de imágenes
  const handleImageUpload = async (file: File, fieldName: 'imagen_hero') => {
    if (!file) return;
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }
    
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo es demasiado grande. Máximo 5MB permitido');
      return;
    }
    
    try {
      setUploadingImage(fieldName);
      
      // Crear FormData para enviar el archivo
      const formDataToSend = new FormData();
      formDataToSend.append('image', file);
      
      // Agregar datos de la entidad si están disponibles
      if (formData.name) {
        formDataToSend.append('languageName', formData.name);
      }
      
      // Usar el endpoint específico de languages si tenemos el nombre
      const endpoint = formData.name 
        ? `${API_BASE}/uploads/language-image`
        : `${API_BASE}/uploads/image/public`;
      
      const headers: HeadersInit = {};
      if (token && formData.name) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Subir archivo al backend
      const uploadResponse = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: formDataToSend,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Error al subir la imagen');
      }
      
      const uploadResult = await uploadResponse.json();
      
      // Actualizar el formulario con la URL de la imagen
      setFormData(prev => ({ ...prev, [fieldName]: uploadResult.url }));
      
      toast.success('Imagen subida exitosamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploadingImage(null);
    }
  };
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    code: false,
    nativeName: false,
    flag: false,
    icons: false,
    isActive: true,
    createdAt: false,
    updatedAt: false,
    actions: true,
  });

  const fetchLanguages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchGraphQL(
        GET_LANGUAGES_PAGINATED,
        {
          search: search || undefined,
          page: currentPage,
          limit: pageSize,
          isActive: activeFilter,
        },
        token || undefined
       );
      setLanguages(data.lenguagesPaginated);
    } catch (error) {
      console.error('Error fetching languages:', error);
      toast.error('Error al cargar los idiomas');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, activeFilter, token]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    
    // Validar datos del formulario con Zod
    const dataToValidate = editingLanguage 
      ? { ...formData, id: editingLanguage.id }
      : formData;
    const validationResult = validateLanguageForm(dataToValidate, !!editingLanguage);
    
    
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => err.message).join(', ');
      
      toast.error(`Errores de validación: ${errors}`);
      return;
    }
    
    let updateData: any = undefined;
    let createData: any = undefined;

    try {

      if (editingLanguage) {
        // Filtrar campos vacíos para evitar errores de validación en el backend
        updateData = {
          id: editingLanguage.id
        };
        
        // Solo incluir campos que no estén vacíos o que sean diferentes del valor original
        const data = validationResult.data;
        
        if (data.name && data.name.trim() !== '') updateData.name = data.name;
        if (data.eslogan_atractivo && data.eslogan_atractivo.trim() !== '') updateData.eslogan_atractivo = data.eslogan_atractivo;
        if (data.descripcion_corta && data.descripcion_corta.trim() !== '') updateData.descripcion_corta = data.descripcion_corta;
        if (data.descripcion_completa && data.descripcion_completa.trim() !== '') updateData.descripcion_completa = data.descripcion_completa;
        if (data.nivel) updateData.nivel = data.nivel;

        if (data.color_tema && data.color_tema.trim() !== '' && /^#[0-9A-Fa-f]{6}$/.test(data.color_tema)) updateData.color_tema = data.color_tema;
        if (data.icono_curso && data.icono_curso.trim() !== '') updateData.icono_curso = data.icono_curso;
        if (data.imagen_hero && data.imagen_hero.trim() !== '') updateData.imagen_hero = data.imagen_hero;
        if (data.badge_destacado) updateData.badge_destacado = data.badge_destacado;
        if (data.idioma_origen && data.idioma_origen.trim() !== '') updateData.idioma_origen = data.idioma_origen;
        if (data.idioma_destino && data.idioma_destino.trim() !== '') updateData.idioma_destino = data.idioma_destino;
        if (data.certificado_digital !== undefined) updateData.certificado_digital = data.certificado_digital;
        if (data.puntuacion_promedio !== undefined) updateData.puntuacion_promedio = data.puntuacion_promedio;
        if (data.total_estudiantes_inscritos !== undefined) updateData.total_estudiantes_inscritos = data.total_estudiantes_inscritos;
        if (data.estado) updateData.estado = data.estado;
        if (data.featured !== undefined) updateData.featured = data.featured;
        if (data.icons && data.icons.length > 0) updateData.icons = data.icons;
        if (data.isActive !== undefined) updateData.isActive = data.isActive;
        
        
        const result = await fetchGraphQL(
          UPDATE_LANGUAGE,
          {
            updateLenguageInput: updateData,
          },
          token || undefined
         );
        
        toast.warning('Idioma actualizado exitosamente');
      } else {
        // Filtrar campos vacíos para la creación también
        const data = validationResult.data;
        createData = {
          name: data.name
        };
        
        // Solo incluir campos que no estén vacíos
        if (data.eslogan_atractivo && data.eslogan_atractivo.trim() !== '') createData.eslogan_atractivo = data.eslogan_atractivo;
        if (data.descripcion_corta && data.descripcion_corta.trim() !== '') createData.descripcion_corta = data.descripcion_corta;
        if (data.descripcion_completa && data.descripcion_completa.trim() !== '') createData.descripcion_completa = data.descripcion_completa;
        if (data.nivel) createData.nivel = data.nivel;

        if (data.color_tema && data.color_tema.trim() !== '' && /^#[0-9A-Fa-f]{6}$/.test(data.color_tema)) createData.color_tema = data.color_tema;
        if (data.icono_curso && data.icono_curso.trim() !== '') createData.icono_curso = data.icono_curso;
        if (data.imagen_hero && data.imagen_hero.trim() !== '') createData.imagen_hero = data.imagen_hero;
        if (data.badge_destacado) createData.badge_destacado = data.badge_destacado;
        if (data.idioma_origen && data.idioma_origen.trim() !== '') createData.idioma_origen = data.idioma_origen;
        if (data.idioma_destino && data.idioma_destino.trim() !== '') createData.idioma_destino = data.idioma_destino;
        if (data.certificado_digital !== undefined) createData.certificado_digital = data.certificado_digital;
        if (data.puntuacion_promedio !== undefined) createData.puntuacion_promedio = data.puntuacion_promedio;
        if (data.total_estudiantes_inscritos !== undefined) createData.total_estudiantes_inscritos = data.total_estudiantes_inscritos;
        if (data.estado) createData.estado = data.estado;
        if (data.featured !== undefined) createData.featured = data.featured;
        if (data.icons && data.icons.length > 0) createData.icons = data.icons;
        if (data.isActive !== undefined) createData.isActive = data.isActive;
        
        
        const result = await fetchGraphQL(
          CREATE_LANGUAGE,
          {
            createLenguageInput: createData,
          },
          token || undefined
         );
        
        toast.success('Idioma creado exitosamente');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchLanguages();
    } catch (error) {

      console.error('❌ Error saving language:', error);
      console.error('📊 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        updateData: editingLanguage ? updateData : undefined,
        createData: !editingLanguage ? createData : undefined,
        formData: formData,
        editingLanguage: editingLanguage
      });
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el idioma';

      toast.error(`Errores de Validación: ${errorMessage}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await fetchGraphQL(DELETE_LANGUAGE, { id }, token || undefined);
      
      // Verificar si hay error en la respuesta
      if (result && 'error' in result) {
        const errorMessage = result.error;
        
        if (errorMessage.includes('No se puede eliminar el idioma') && errorMessage.includes('nivel(es) asociado(s)')) {
          toast.error('No se puede eliminar este idioma porque tiene niveles asociados. Primero elimina todos los niveles de este idioma.');
        } else {
          toast.error('Error al eliminar el idioma. Por favor, inténtalo de nuevo.');
        }
        return;
      }
      
      toast.success('Idioma eliminado exitosamente');
      fetchLanguages();
    } catch (error) {
      console.error('Error deleting language:', error);
      toast.error('Error al eliminar el idioma. Por favor, inténtalo de nuevo.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      eslogan_atractivo: '',
      descripcion_corta: '',
      descripcion_completa: '',
      nivel: 'Básico',

      color_tema: '#000000',
      icono_curso: '',
      imagen_hero: '',
      badge_destacado: undefined,
      idioma_origen: '',
      idioma_destino: '',
      certificado_digital: false,
      puntuacion_promedio: 0,
      total_estudiantes_inscritos: 0,
      estado: 'Activo',
      featured: false,
      icons: [],
      isActive: true,
    });
    setIconInput('');
    setEditingLanguage(null);
  };

  const handleEdit = (language: Language) => {
    setEditingLanguage(language);
    setFormData({
      name: language.name,
      eslogan_atractivo: language.eslogan_atractivo || '',
      descripcion_corta: language.descripcion_corta || '',
      descripcion_completa: language.descripcion_completa || '',
      nivel: language.nivel || 'Básico',

      color_tema: language.color_tema || '#000000',
      icono_curso: language.icono_curso || '',
      imagen_hero: language.imagen_hero || '',
      badge_destacado: language.badge_destacado || undefined,
      idioma_origen: language.idioma_origen || '',
      idioma_destino: language.idioma_destino || '',
      certificado_digital: language.certificado_digital,
      puntuacion_promedio: language.puntuacion_promedio,
      total_estudiantes_inscritos: language.total_estudiantes_inscritos,
      estado: language.estado,
      featured: language.featured,
      icons: language.icons || [],
      isActive: language.isActive,
    });
    setIconInput((language.icons || []).join(', '));
    setIsDialogOpen(true);
  };

  const handleAddIcon = () => {
    if (iconInput.trim()) {
      const newIcons = iconInput.split(',').map(icon => icon.trim()).filter(icon => icon);
      setFormData(prev => ({
        ...prev,
        icons: [...new Set([...(prev.icons || []), ...newIcons])]
      }));
      setIconInput('');
    }
  };

  const handleRemoveIcon = (iconToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      icons: (prev.icons || []).filter(icon => icon !== iconToRemove)
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const toggleColumnVisibility = (column: keyof LanguageColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const data = await fetchGraphQL(
        TOGGLE_LANGUAGE_STATUS,
        { id },
        token || undefined
      );
      
      // La mutación devuelve directamente el objeto Language actualizado
      const updatedLanguage = data.toggleLanguageStatus;
      if (updatedLanguage && updatedLanguage.isActive !== undefined) {
        const statusMessage = updatedLanguage.isActive 
          ? 'Idioma activado exitosamente' 
          : 'Idioma desactivado exitosamente';
        toast.success(statusMessage);
        await fetchLanguages();
      } else {
        toast.error('Error al cambiar el estado del idioma');
      }
    } catch (error) {
      console.error('Error toggling language status:', error);
      toast.error('Error al cambiar el estado del idioma');
    }
  };

  // Computed values
  const visibleColumnsCount = Object.values(columnVisibility).filter(Boolean).length;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return 'No disponible';
    }
    
    try {
      // Si es un timestamp en milisegundos como string, convertirlo a número
      const timestamp = isNaN(Number(dateString)) ? dateString : Number(dateString);
      const date = new Date(timestamp);
      
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      
      return date.toLocaleDateString('es-ES', {
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

  // Función para convertir Language a LanguageEntity
  const convertToLanguageEntity = (language: Language): LanguageEntity => {
    return {
      id: language.id,
      name: language.name,
      code: language.idioma_origen || 'N/A',
      nativeName: language.name,
      flag: language.imagen_hero || '',
      icons: language.icons || [],
      isActive: language.isActive,
      createdAt: language.createdAt,
      updatedAt: language.updatedAt
    };
  };

  return (
    <div className="px-6 py-6">
      <Card className="max-w-none">
        <CardHeader className="px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-6 w-6" />
                Gestión de Idiomas
              </CardTitle>
              <CardDescription>
                Administra los idiomas disponibles en la plataforma
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Idioma
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingLanguage ? 'Editar Idioma' : 'Crear Nuevo Idioma'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingLanguage
                      ? 'Modifica los datos del idioma seleccionado.'
                      : 'Completa los datos para crear un nuevo idioma.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6 py-4">
                    {/* Información Básica */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Información Básica</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre del Curso *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ej: Inglés Básico"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eslogan_atractivo">Eslogan Atractivo</Label>
                          <Input
                            id="eslogan_atractivo"
                            value={formData.eslogan_atractivo}
                            onChange={(e) => setFormData(prev => ({ ...prev, eslogan_atractivo: e.target.value }))}
                            placeholder="Ej: ¡Domina el inglés en tiempo récord!"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="descripcion_corta">Descripción Corta (máx. 100 caracteres)</Label>
                        <Input
                          id="descripcion_corta"
                          value={formData.descripcion_corta}
                          onChange={(e) => setFormData(prev => ({ ...prev, descripcion_corta: e.target.value }))}
                          placeholder="Descripción breve del curso"
                          maxLength={100}
                        />
                        <p className="text-xs text-muted-foreground">{(formData.descripcion_corta || '').length}/100 caracteres</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="descripcion_completa">Descripción Completa</Label>
                        <textarea
                          id="descripcion_completa"
                          value={formData.descripcion_completa}
                          onChange={(e) => setFormData(prev => ({ ...prev, descripcion_completa: e.target.value }))}
                          placeholder="Descripción detallada del curso, objetivos, metodología..."
                          className="w-full min-h-[100px] px-3 py-2 border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                        />
                      </div>
                    </div>

                    {/* Detalles Académicos */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Detalles Académicos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Nivel</Label>
                          <div className="space-y-2">
                            {['Básico', 'Básico-Intermedio', 'Intermedio', 'Intermedio-Avanzado', 'Avanzado'].map((nivel) => (
                              <div key={nivel} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`nivel-${nivel}`}
                                  checked={formData.nivel === nivel}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setFormData(prev => ({ ...prev, nivel: nivel as 'Básico' | 'Básico-Intermedio' | 'Intermedio' | 'Intermedio-Avanzado' | 'Avanzado' }));
                                    }
                                  }}
                                />
                                <Label htmlFor={`nivel-${nivel}`} className="text-sm font-normal">
                                  {nivel}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>


                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="idioma_origen">Idioma Origen</Label>
                          <Input
                            id="idioma_origen"
                            value={formData.idioma_origen}
                            onChange={(e) => setFormData(prev => ({ ...prev, idioma_origen: e.target.value }))}
                            placeholder="Español"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="idioma_destino">Idioma Destino</Label>
                          <Input
                            id="idioma_destino"
                            value={formData.idioma_destino}
                            onChange={(e) => setFormData(prev => ({ ...prev, idioma_destino: e.target.value }))}
                            placeholder="Inglés"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Elementos Visuales */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Elementos Visuales</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="color_tema">Color Tema</Label>
                          <div className="flex gap-2">
                            <Input
                              id="color_tema"
                              type="color"
                              value={formData.color_tema}
                              onChange={(e) => setFormData(prev => ({ ...prev, color_tema: e.target.value }))}
                              className="w-16 h-10 p-1 border rounded"
                            />
                            <Input
                              value={formData.color_tema}
                              onChange={(e) => setFormData(prev => ({ ...prev, color_tema: e.target.value }))}
                              placeholder="#000000"
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Badge Destacado</Label>
                          <div className="space-y-2">
                            {[{ value: undefined, label: 'Sin badge' }, { value: 'Más Popular', label: 'Más Popular' }, { value: 'Nuevo', label: 'Nuevo' }, { value: 'Recomendado', label: 'Recomendado' }].map((badge) => (
                              <div key={badge.label} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`badge-${badge.label}`}
                                  checked={formData.badge_destacado === badge.value}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setFormData(prev => ({ ...prev, badge_destacado: badge.value as 'Más Popular' | 'Nuevo' | 'Recomendado' | undefined }));
                                    }
                                  }}
                                />
                                <Label htmlFor={`badge-${badge.label}`} className="text-sm font-normal">
                                  {badge.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="imagen_hero">Imagen Hero</Label>
                        <div className="space-y-2">
                          <Input
                            id="imagen_hero"
                            value={formData.imagen_hero}
                            onChange={(e) => setFormData(prev => ({ ...prev, imagen_hero: e.target.value }))}
                            placeholder="https://ejemplo.com/hero.jpg o sube un archivo"
                          />
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={uploadingImage === 'imagen_hero'}
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) handleImageUpload(file, 'imagen_hero');
                                };
                                input.click();
                              }}
                            >
                              {uploadingImage === 'imagen_hero' ? (
                                'Subiendo...'
                              ) : (
                                <><Upload className="h-4 w-4 mr-2" />Subir Archivo</>
                              )}
                            </Button>
                            {formData.imagen_hero && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(formData.imagen_hero, '_blank')}
                              >
                                <Image className="h-4 w-4 mr-2" />Ver
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Configuración y Estado */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Configuración y Estado</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Estado del Curso</Label>
                          <div className="space-y-2">
                            {['Activo', 'Inactivo', 'En Desarrollo', 'Pausado'].map((estado) => (
                              <div key={estado} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`estado-${estado}`}
                                  checked={formData.estado === estado}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setFormData(prev => ({ ...prev, estado: estado as 'Activo' | 'Inactivo' | 'En Desarrollo' | 'Pausado' }));
                                    }
                                  }}
                                />
                                <Label htmlFor={`estado-${estado}`} className="text-sm font-normal">
                                  {estado}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="certificado_digital"
                              checked={formData.certificado_digital}
                              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, certificado_digital: !!checked }))}
                            />
                            <Label htmlFor="certificado_digital">Certificado Digital</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="featured"
                              checked={formData.featured}
                              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: !!checked }))}
                            />
                            <Label htmlFor="featured">Curso Destacado</Label>
                          </div>
                        </div>
                      </div>
                    </div>



                    {/* Iconos (Compatibilidad) */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Iconos (Compatibilidad)</h3>
                      <div className="space-y-2">
                        <Label htmlFor="icons">Iconos</Label>
                        <div className="flex gap-2">
                          <Input
                            id="icons"
                            value={iconInput}
                            onChange={(e) => setIconInput(e.target.value)}
                            placeholder="Ingresa iconos separados por comas"
                            className="flex-1"
                          />
                          <Button type="button" onClick={handleAddIcon} size="sm">
                            Agregar
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(formData.icons || []).map((icon, index) => (
                            <Badge key={index} variant="secondary" className="cursor-pointer"
                              onClick={() => handleRemoveIcon(icon)}>
                              {icon} ×
                            </Badge>
                          ))}
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
                      {editingLanguage ? 'Actualizar' : 'Crear'}
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
                  placeholder="Buscar idiomas..."
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
                  checked={columnVisibility.code}
                  onCheckedChange={() => toggleColumnVisibility('code')}
                >
                  Código
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.nativeName}
                  onCheckedChange={() => toggleColumnVisibility('nativeName')}
                >
                  Nombre Nativo
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.flag}
                  onCheckedChange={() => toggleColumnVisibility('flag')}
                >
                  Bandera
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.icons}
                  onCheckedChange={() => toggleColumnVisibility('icons')}
                >
                  Iconos
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

          {/* Language Table */}
          <LanguageTable
            languages={languages.lenguages.map(convertToLanguageEntity)}
            loading={loading}
            columnVisibility={columnVisibility as LanguageColumnVisibility}
            onEdit={(language: LanguageEntity) => {
              // Convertir LanguageEntity de vuelta a Language para handleEdit
              const originalLanguage = languages.lenguages.find(l => l.id === language.id);
              if (originalLanguage) handleEdit(originalLanguage);
            }}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            formatDate={formatDate}
          />

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {((languages.page - 1) * languages.limit) + 1} a{' '}
              {Math.min(languages.page * languages.limit, languages.total)} de {languages.total} idiomas
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(languages.page - 1)}
                disabled={!languages.hasPreviousPage}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: languages.totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    const current = languages.page;
                    return page === 1 || page === languages.totalPages || (page >= current - 1 && page <= current + 1);
                  })
                  .map((page, index, array) => {
                    const showEllipsis = index > 0 && page - array[index - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="px-2">...</span>}
                        <Button
                          variant={page === languages.page ? 'default' : 'outline'}
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
                onClick={() => handlePageChange(languages.page + 1)}
                disabled={!languages.hasNextPage}
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