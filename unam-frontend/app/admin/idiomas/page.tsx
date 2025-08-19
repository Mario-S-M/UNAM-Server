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
import { Plus, Edit, Trash2, Languages, Search, Settings, ChevronLeft, ChevronRight, Upload, Image } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { 
  validateLanguageForm,
  type CreateLanguageFormData,
  type UpdateLanguageFormData 
} from '@/schemas/language-forms';

// GraphQL Queries and Mutations
const GET_LANGUAGES_PAGINATED = `
  query GetLanguagesPaginated($search: String, $page: Int, $limit: Int, $isActive: Boolean) {
    lenguagesPaginated(search: $search, page: $page, limit: $limit, isActive: $isActive) {
      lenguages {
        id
        name
        eslogan_atractivo
        descripcion_corta
        descripcion_completa
        nivel
        duracion_total_horas
        color_tema
        imagen_hero
        badge_destacado

        idioma_origen
        idioma_destino
        certificado_digital
        puntuacion_promedio
        total_estudiantes_inscritos
        estado
        featured
        fecha_creacion
        fecha_actualizacion
        icons
        isActive
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

const CREATE_LANGUAGE = `
  mutation CreateLanguage($createLenguageInput: CreateLenguageInput!) {
    createLenguage(createLenguageInput: $createLenguageInput) {
      id
      name
      eslogan_atractivo
      descripcion_corta
      descripcion_completa
      nivel
      duracion_total_horas
      color_tema
      imagen_hero
      badge_destacado

      idioma_origen
      idioma_destino
      certificado_digital
      puntuacion_promedio
      total_estudiantes_inscritos
      estado
      featured
      fecha_creacion
      fecha_actualizacion
      icons
      isActive
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_LANGUAGE = `
  mutation UpdateLanguage($updateLenguageInput: UpdateLenguageInput!) {
    updateLenguage(updateLenguageInput: $updateLenguageInput) {
      id
      name
      eslogan_atractivo
      descripcion_corta
      descripcion_completa
      nivel
      duracion_total_horas
      color_tema
      imagen_hero
      badge_destacado

      idioma_origen
      idioma_destino
      certificado_digital
      puntuacion_promedio
      total_estudiantes_inscritos
      estado
      featured
      fecha_creacion
      fecha_actualizacion
      icons
      isActive
      createdAt
      updatedAt
    }
  }
`;

const DELETE_LANGUAGE = `
  mutation DeleteLanguage($id: ID!) {
    removeLenguage(id: $id) {
      id
      name
    }
  }
`;

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

type GraphQLInputValue = string | number | boolean | null | undefined | string[] | LanguageFormData | {
  [key: string]: string | number | boolean | null | undefined | string[];
};

interface GraphQLVariables {
  [key: string]: GraphQLInputValue;
}

// Toast notification function
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  // Simple toast implementation - you can replace with a proper toast library
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 p-4 rounded-md text-white z-50 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
};

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
  eslogan_atractivo: string;
  descripcion_corta: string;
  descripcion_completa: string;
  nivel: string;
  duracion_total_horas: number;
  color_tema: string;

  imagen_hero: string;
  badge_destacado?: string;

  idioma_origen: string;
  idioma_destino: string;
  certificado_digital: boolean;
  puntuacion_promedio: number;
  total_estudiantes_inscritos: number;
  estado: string;
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

interface LanguageFormData {
  name: string;
  eslogan_atractivo: string;
  descripcion_corta: string;
  descripcion_completa: string;
  nivel: string;
  duracion_total_horas: number;
  color_tema: string;
  imagen_hero: string;
  badge_destacado?: string;

  idioma_origen: string;
  idioma_destino: string;
  certificado_digital: boolean;
  estado: string;
  featured: boolean;
  icons?: string[];
}

interface ColumnVisibility {
  name: boolean;
  eslogan_atractivo: boolean;
  nivel: boolean;
  duracion_total_horas: boolean;
  estado: boolean;
  badge_destacado: boolean;
  puntuacion_promedio: boolean;
  total_estudiantes_inscritos: boolean;
  featured: boolean;
  icons: boolean;
  isActive: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  actions: boolean;
}

export default function IdiomasPage() {
  const { token } = useAuth();
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
    duracion_total_horas: 1,
    color_tema: '#000000',
    
    imagen_hero: '',
    badge_destacado: undefined,

    idioma_origen: '',
    idioma_destino: '',
    certificado_digital: false,
    estado: 'Activo',
    featured: false,
    icons: [],
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
      showToast('Por favor selecciona un archivo de imagen válido', 'error');
      return;
    }
    
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('El archivo es demasiado grande. Máximo 5MB permitido', 'error');
      return;
    }
    
    try {
      setUploadingImage(fieldName);
      
      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('image', file);
      
      // Subir archivo al backend
      const uploadResponse = await fetch('http://localhost:3000/uploads/image/public', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Error al subir la imagen');
      }
      
      const uploadResult = await uploadResponse.json();
      
      // Actualizar el formulario con la URL de la imagen
      setFormData(prev => ({ ...prev, [fieldName]: uploadResult.url }));
      
      showToast('Imagen subida exitosamente', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Error al subir la imagen', 'error');
    } finally {
      setUploadingImage(null);
    }
  };
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    eslogan_atractivo: false,
    nivel: false,
    duracion_total_horas: true,
    estado: true,
    badge_destacado: true,
    puntuacion_promedio: true,
    total_estudiantes_inscritos: true,
    featured: false,
    icons: true,
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
      showToast('Error al cargar los idiomas', 'error');
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
    const validationResult = validateLanguageForm(formData, !!editingLanguage);
    
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => err.message).join(', ');
      showToast(`Errores de validación: ${errors}`, 'error');
      return;
    }
    
    try {
      if (editingLanguage) {
        const updateData = {
          id: editingLanguage.id,
          ...validationResult.data
        };
        
        await fetchGraphQL(
          UPDATE_LANGUAGE,
          {
            updateLenguageInput: updateData,
          },
          token || undefined
         );
        showToast('Idioma actualizado exitosamente');
      } else {
        const createData = validationResult.data;
        
        await fetchGraphQL(
          CREATE_LANGUAGE,
          {
            createLenguageInput: createData,
          },
          token || undefined
         );
        showToast('Idioma creado exitosamente');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchLanguages();
    } catch (error) {
      console.error('Error saving language:', error);
      showToast('Error al guardar el idioma', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchGraphQL(DELETE_LANGUAGE, { id }, token || undefined);
      showToast('Idioma eliminado exitosamente');
      fetchLanguages();
    } catch (error) {
      console.error('Error deleting language:', error);
      showToast('Error al eliminar el idioma', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      eslogan_atractivo: '',
      descripcion_corta: '',
      descripcion_completa: '',
      nivel: 'Básico',
      duracion_total_horas: 1,
      color_tema: '#000000',
      imagen_hero: '',
      badge_destacado: undefined,

      idioma_origen: '',
      idioma_destino: '',
      certificado_digital: false,
      estado: 'Activo',
      featured: false,
      icons: [],
    });
    setIconInput('');
    setEditingLanguage(null);
  };

  const handleEdit = (language: Language) => {
    setEditingLanguage(language);
    setFormData({
      name: language.name,
      eslogan_atractivo: language.eslogan_atractivo,
      descripcion_corta: language.descripcion_corta,
      descripcion_completa: language.descripcion_completa,
      nivel: language.nivel,
      duracion_total_horas: language.duracion_total_horas,
      color_tema: language.color_tema,
      
      imagen_hero: language.imagen_hero,
      badge_destacado: language.badge_destacado,

      idioma_origen: language.idioma_origen,
      idioma_destino: language.idioma_destino,
      certificado_digital: language.certificado_digital,
      estado: language.estado,
      featured: language.featured,
      icons: language.icons || [],
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

  const toggleColumnVisibility = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

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
                        <p className="text-xs text-muted-foreground">{formData.descripcion_corta.length}/100 caracteres</p>
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
                                      setFormData(prev => ({ ...prev, nivel }));
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
                        <div className="space-y-2">
                          <Label htmlFor="duracion_total_horas">Duración (horas)</Label>
                          <Input
                            id="duracion_total_horas"
                            type="number"
                            min="1"
                            value={formData.duracion_total_horas}
                            onChange={(e) => setFormData(prev => ({ ...prev, duracion_total_horas: parseInt(e.target.value) || 1 }))}
                            placeholder="40"
                          />
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
                                      setFormData(prev => ({ ...prev, badge_destacado: badge.value }));
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
                                      setFormData(prev => ({ ...prev, estado }));
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
              <Select value={activeFilter?.toString() || 'all'} onValueChange={(value) => {
                setActiveFilter(value === 'all' ? undefined : value === 'true');
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Activos</SelectItem>
                  <SelectItem value="false">Inactivos</SelectItem>
                </SelectContent>
              </Select>
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
                  checked={columnVisibility.eslogan_atractivo}
                  onCheckedChange={() => toggleColumnVisibility('eslogan_atractivo')}
                >
                  Eslogan Atractivo
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.nivel}
                  onCheckedChange={() => toggleColumnVisibility('nivel')}
                >
                  Nivel
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.duracion_total_horas}
                  onCheckedChange={() => toggleColumnVisibility('duracion_total_horas')}
                >
                  Duración (Horas)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.estado}
                  onCheckedChange={() => toggleColumnVisibility('estado')}
                >
                  Estado del Curso
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.badge_destacado}
                  onCheckedChange={() => toggleColumnVisibility('badge_destacado')}
                >
                  Badge Destacado
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.puntuacion_promedio}
                  onCheckedChange={() => toggleColumnVisibility('puntuacion_promedio')}
                >
                  Puntuación Promedio
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.total_estudiantes_inscritos}
                  onCheckedChange={() => toggleColumnVisibility('total_estudiantes_inscritos')}
                >
                  Estudiantes Inscritos
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.featured}
                  onCheckedChange={() => toggleColumnVisibility('featured')}
                >
                  Destacado
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
                  Activo/Inactivo
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
                  {columnVisibility.name && <TableHead>Nombre</TableHead>}
                  {columnVisibility.eslogan_atractivo && <TableHead>Eslogan Atractivo</TableHead>}
                  {columnVisibility.nivel && <TableHead>Nivel</TableHead>}
                  {columnVisibility.duracion_total_horas && <TableHead>Duración (Horas)</TableHead>}
                  {columnVisibility.estado && <TableHead>Estado del Curso</TableHead>}
                  {columnVisibility.badge_destacado && <TableHead>Badge Destacado</TableHead>}
                  {columnVisibility.puntuacion_promedio && <TableHead>Puntuación Promedio</TableHead>}
                  {columnVisibility.total_estudiantes_inscritos && <TableHead>Estudiantes Inscritos</TableHead>}
                  {columnVisibility.featured && <TableHead>Destacado</TableHead>}
                  {columnVisibility.icons && <TableHead>Iconos</TableHead>}
                  {columnVisibility.isActive && <TableHead>Activo/Inactivo</TableHead>}
                  {columnVisibility.createdAt && <TableHead>Fecha de Creación</TableHead>}
                  {columnVisibility.updatedAt && <TableHead>Última Actualización</TableHead>}
                  {columnVisibility.actions && <TableHead className="text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={14} className="text-center py-8">
                      Cargando idiomas...
                    </TableCell>
                  </TableRow>
                ) : languages.lenguages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="text-center py-8">
                      No se encontraron idiomas
                    </TableCell>
                  </TableRow>
                ) : (
                  languages.lenguages.map((language) => (
                    <TableRow key={language.id}>
                      {columnVisibility.name && (
                        <TableCell className="font-medium">{language.name}</TableCell>
                      )}
                      {columnVisibility.eslogan_atractivo && (
                        <TableCell className="max-w-xs truncate">{language.eslogan_atractivo}</TableCell>
                      )}
                      {columnVisibility.nivel && (
                        <TableCell>
                          <Badge variant="outline">{language.nivel}</Badge>
                        </TableCell>
                      )}
                      {columnVisibility.duracion_total_horas && (
                        <TableCell>{language.duracion_total_horas}h</TableCell>
                      )}
                      {columnVisibility.estado && (
                        <TableCell>
                          <Badge variant={language.estado === 'Activo' ? 'default' : language.estado === 'En Desarrollo' ? 'secondary' : 'destructive'}>
                            {language.estado}
                          </Badge>
                        </TableCell>
                      )}
                      {columnVisibility.badge_destacado && (
                        <TableCell>
                          {language.badge_destacado && language.badge_destacado !== 'none' ? (
                            <Badge variant="default">{language.badge_destacado}</Badge>
                          ) : (
                            <span className="text-muted-foreground">Sin badge</span>
                          )}
                        </TableCell>
                      )}
                      {columnVisibility.puntuacion_promedio && (
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{language.puntuacion_promedio.toFixed(1)}</span>
                            <span className="text-yellow-500">★</span>
                          </div>
                        </TableCell>
                      )}
                      {columnVisibility.total_estudiantes_inscritos && (
                        <TableCell>{language.total_estudiantes_inscritos.toLocaleString()}</TableCell>
                      )}
                      {columnVisibility.featured && (
                        <TableCell>
                          <Badge variant={language.featured ? 'default' : 'secondary'}>
                            {language.featured ? 'Sí' : 'No'}
                          </Badge>
                        </TableCell>
                      )}
                      {columnVisibility.icons && (
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(language.icons && language.icons.length > 0) ? (
                              language.icons.map((icon, index) => (
                                <div key={index} className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg text-lg">
                                  {icon}
                                </div>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">Sin iconos</span>
                            )}
                          </div>
                        </TableCell>
                      )}
                      {columnVisibility.isActive && (
                        <TableCell>
                          <Badge variant={language.isActive ? 'default' : 'secondary'}>
                            {language.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                      )}
                      {columnVisibility.createdAt && (
                        <TableCell>{formatDate(language.createdAt)}</TableCell>
                      )}
                      {columnVisibility.updatedAt && (
                        <TableCell>{formatDate(language.updatedAt)}</TableCell>
                      )}
                      {columnVisibility.actions && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(language)}
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
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el idioma
                                    &quot;{language.name}&quot; de la base de datos.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(language.id)}>
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