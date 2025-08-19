'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Edit, Trash2, Zap, Search, Settings, ChevronLeft, ChevronRight, X, Upload, Image } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// GraphQL Queries and Mutations
const GET_SKILLS_PAGINATED = `
  query GetSkillsPaginated($search: String, $page: Int, $limit: Int, $isActive: Boolean) {
    skillsPaginated(search: $search, page: $page, limit: $limit, isActive: $isActive) {
      skills {
        id
        name
        description
        color
        imageUrl
        icon
        objectives
        prerequisites
        difficulty
        estimatedHours
        tags
        isActive
        levelId
        lenguageId
        level {
          id
          name
          description
          difficulty
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

const GET_LANGUAGES = `
  query GetLanguages {
    lenguagesActivate {
      id
      name
    }
  }
`;

const GET_LEVELS_BY_LANGUAGE = `
  query GetLevelsByLanguage($lenguageId: ID!) {
    levelsByLenguage(lenguageId: $lenguageId) {
      id
      name
      description
      difficulty
    }
  }
`;

const CREATE_SKILL = `
  mutation CreateSkill($createSkillInput: CreateSkillInput!) {
    createSkill(createSkillInput: $createSkillInput) {
      id
      name
      description
      color
      imageUrl
      icon
      objectives
      prerequisites
      difficulty
      estimatedHours
      tags
      isActive
      levelId
      lenguageId
      level {
        id
        name
        description
        difficulty
      }
      lenguage {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_SKILL = `
  mutation UpdateSkill($updateSkillInput: UpdateSkillInput!) {
    updateSkill(updateSkillInput: $updateSkillInput) {
      id
      name
      description
      color
      imageUrl
      icon
      objectives
      prerequisites
      difficulty
      estimatedHours
      tags
      isActive
      levelId
      lenguageId
      level {
        id
        name
        description
        difficulty
      }
      lenguage {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

const DELETE_SKILL = `
  mutation DeleteSkill($id: ID!) {
    removeSkill(id: $id) {
      id
      name
    }
  }
`;

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

type GraphQLInputValue = string | number | boolean | null | undefined | string[] | SkillFormData | {
  [key: string]: string | number | boolean | null | undefined | string[];
};

interface GraphQLVariables {
  [key: string]: GraphQLInputValue;
}

// Toast notification function
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  // Simple console log for now - replace with actual toast implementation
  if (type === 'error') {
    console.error(message);
  } else {
    console.log(message);
  }
};

// GraphQL fetch function
const fetchGraphQL = async (query: string, variables?: GraphQLVariables, token?: string) => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  return result.data;
};

interface Level {
  id: string;
  name: string;
  description: string;
  difficulty: string;
}

interface Language {
  id: string;
  name: string;
}

interface Skill {
  id: string;
  name: string;
  description: string;
  color: string;
  imageUrl?: string;
  icon?: string;
  objectives?: string;
  prerequisites?: string;
  difficulty: string;
  estimatedHours?: number;
  tags: string[];
  isActive: boolean;
  levelId?: string;
  lenguageId?: string;
  level?: Level;
  lenguage?: Language;
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

interface SkillFormData {
  name: string;
  description: string;
  color: string;
  imageUrl: string;
  icon: string;
  objectives: string[];
  prerequisites: string[];
  difficulty: string;
  estimatedHours: number;
  tags: string[];
  levelId: string;
  lenguageId: string;
}

interface ColumnVisibility {
  name: boolean;
  description: boolean;
  difficulty: boolean;
  level: boolean;
  color: boolean;
  imageUrl: boolean;
  icon: boolean;
  objectives: boolean;
  prerequisites: boolean;
  estimatedHours: boolean;
  isActive: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  actions: boolean;
}

export default function SkillsAdminPage() {
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
    color: '#3B82F6',
    imageUrl: '',
    icon: '',
    objectives: [],
    prerequisites: [],
    difficulty: 'Básico',
    estimatedHours: 0,
    tags: [],
    levelId: '',
    lenguageId: '',
  });
  const [newObjective, setNewObjective] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('');
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    description: true,
    difficulty: true,
    level: true,
    color: false,
    imageUrl: false,
    icon: false,
    objectives: false,
    prerequisites: false,
    estimatedHours: true,
    isActive: true,
    createdAt: false,
    updatedAt: false,
    actions: true,
  });

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchGraphQL(
        GET_SKILLS_PAGINATED,
        {
          search: search || undefined,
          page: currentPage,
          limit: pageSize,
          isActive: activeFilter,
        },
        token || undefined
      );
      setSkills(data.skillsPaginated);
    } catch (error) {
      console.error('Error fetching skills:', error);
      showToast('Error al cargar las habilidades', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, activeFilter, token]);

  const fetchLanguages = useCallback(async () => {
    try {
      const data = await fetchGraphQL(GET_LANGUAGES, {}, token || undefined);
      setLanguages(data.lenguagesActivate);
    } catch (error) {
      console.error('Error fetching languages:', error);
      showToast('Error al cargar los idiomas', 'error');
    }
  }, [token]);

  const fetchLevelsByLanguage = useCallback(async (languageId: string) => {
    if (!languageId) {
      setLevels([]);
      return;
    }
    try {
      const data = await fetchGraphQL(
        GET_LEVELS_BY_LANGUAGE,
        { lenguageId: languageId },
        token || undefined
      );
      setLevels(data.levelsByLenguage);
    } catch (error) {
      console.error('Error fetching levels:', error);
      showToast('Error al cargar los niveles', 'error');
    }
  }, [token]);

  useEffect(() => {
    fetchSkills();
    fetchLanguages();
  }, [fetchSkills, fetchLanguages]);

  useEffect(() => {
    if (selectedLanguageId) {
      fetchLevelsByLanguage(selectedLanguageId);
    }
  }, [selectedLanguageId, fetchLevelsByLanguage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.imageUrl;
      
      // Si hay una imagen seleccionada, subirla primero
      if (selectedImageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', selectedImageFile);
        
        // Generar un skillId temporal para nuevas skills o usar el existente
        const skillId = editingSkill?.id || `temp-${Date.now()}`;
        formDataUpload.append('skillId', skillId);
        
        const uploadResponse = await fetch('http://localhost:3000/uploads/skill-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataUpload,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          imageUrl = uploadResult.imageUrl;
        } else {
          throw new Error('Error al subir la imagen');
        }
      }
      
      const submitData = {
        ...formData,
        imageUrl,
        levelId: formData.levelId && formData.levelId !== '' ? formData.levelId : null,
        lenguageId: formData.lenguageId && formData.lenguageId !== '' ? formData.lenguageId : null,
        estimatedHours: formData.estimatedHours > 0 ? formData.estimatedHours : null,
        objectives: formData.objectives.join('\n'),
        prerequisites: formData.prerequisites.join('\n')
      };
      
      if (editingSkill) {
        await fetchGraphQL(
          UPDATE_SKILL,
          {
            updateSkillInput: {
              id: editingSkill.id,
              ...submitData,
            },
          },
          token || undefined
        );
        showToast('Habilidad actualizada exitosamente');
      } else {
        await fetchGraphQL(
          CREATE_SKILL,
          { createSkillInput: submitData },
          token || undefined
        );
        showToast('Habilidad creada exitosamente');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchSkills();
    } catch (error) {
      console.error('Error saving skill:', error);
      showToast('Error al guardar la habilidad', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchGraphQL(DELETE_SKILL, { id }, token || undefined);
      showToast('Habilidad eliminada exitosamente');
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      showToast('Error al eliminar la habilidad', 'error');
    }
  };

  const handleImageUpload = async (file: File, fieldName: 'imageUrl') => {
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: '' });
  };

  const resetForm = () => {
    setEditingSkill(null);
    setSelectedLanguageId('');
    setLevels([]);
    setSelectedImageFile(null);
    setImagePreview(null);
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      imageUrl: '',
      icon: '',
      objectives: [],
      prerequisites: [],
      difficulty: 'Básico',
      estimatedHours: 0,
      tags: [],
      levelId: '',
      lenguageId: '',
    });
    setNewObjective('');
    setNewPrerequisite('');
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    const languageId = skill.lenguageId || '';
    setSelectedLanguageId(languageId);
    
    // Si la skill tiene una imagen, mostrarla como preview
    if (skill.imageUrl) {
      setImagePreview(skill.imageUrl);
    } else {
      setImagePreview(null);
    }
    setSelectedImageFile(null);
    
    setFormData({
      name: skill.name,
      description: skill.description,
      color: skill.color,
      imageUrl: skill.imageUrl || '',
      icon: skill.icon || '',
      objectives: skill.objectives ? skill.objectives.split('\n').filter(obj => obj.trim()) : [],
      prerequisites: skill.prerequisites ? skill.prerequisites.split('\n').filter(pre => pre.trim()) : [],
      difficulty: skill.difficulty,
      estimatedHours: skill.estimatedHours || 0,
      tags: skill.tags || [],
      levelId: skill.levelId || '',
      lenguageId: languageId,
    });
    if (languageId) {
      fetchLevelsByLanguage(languageId);
    }
    setNewObjective('');
    setNewPrerequisite('');
    setIsDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleColumnVisibility = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="px-6 py-6">
      <Card className="max-w-none">
        <CardHeader className="px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6" />
                Skills
              </CardTitle>
              <CardDescription>
                Gestiona las habilidades y competencias disponibles en el sistema
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Skill
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingSkill ? 'Editar Skill' : 'Crear Nuevo Skill'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingSkill
                      ? 'Modifica los datos del skill seleccionado.'
                      : 'Completa los datos para crear un nuevo skill.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6 py-4">
                    {/* Información Básica */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Información Básica</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre del Skill *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                            placeholder="Nombre del skill"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="difficulty">Dificultad</Label>
                          <Select
                            value={formData.difficulty}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar dificultad" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Básico">Básico</SelectItem>
                              <SelectItem value="Intermedio">Intermedio</SelectItem>
                              <SelectItem value="Avanzado">Avanzado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Descripción Corta</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          placeholder="Descripción del skill"
                        />
                      </div>
                    </div>

                    {/* Detalles Académicos */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Detalles Académicos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="lenguageId">Idioma *</Label>
                          <Select
                            value={formData.lenguageId}
                            onValueChange={(value) => {
                              setFormData(prev => ({ ...prev, lenguageId: value, levelId: '' }));
                              setSelectedLanguageId(value);
                              if (value) {
                                fetchLevelsByLanguage(value);
                              } else {
                                setLevels([]);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar idioma" />
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
                          <Label htmlFor="levelId">Nivel *</Label>
                          <Select
                            value={formData.levelId}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, levelId: value }))}
                            disabled={!selectedLanguageId || levels.length === 0}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={selectedLanguageId ? "Seleccionar nivel" : "Primero selecciona un idioma"} />
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
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="estimatedHours">Duración Total (Horas)</Label>
                          <Input
                            id="estimatedHours"
                            type="number"
                            value={formData.estimatedHours}
                            onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
                            min="0"
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="color">Color del Tema</Label>
                          <div className="flex gap-2">
                            <Input
                              id="color"
                              type="color"
                              value={formData.color}
                              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                              className="w-16 h-10 p-1 rounded cursor-pointer"
                            />
                            <Input
                              value={formData.color}
                              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                              placeholder="#000000"
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Elementos Visuales */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Elementos Visuales</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="imageFile">Imagen Hero</Label>
                          <div className="space-y-3">
                             <div className="flex gap-2">
                              <Button
                                 type="button"
                                 onClick={() => {
                                   const input = document.createElement('input');
                                   input.type = 'file';
                                   input.accept = 'image/*';
                                   input.onchange = (e) => {
                                     const file = (e.target as HTMLInputElement).files?.[0];
                                     if (file) handleImageUpload(file, 'imageUrl');
                                   };
                                   input.click();
                                 }}
                                 disabled={uploadingImage === 'imageUrl'}
                                 size="sm"
                               >
                                 {uploadingImage === 'imageUrl' ? (
                                   'Subiendo...'
                                 ) : (
                                   <><Upload className="h-4 w-4 mr-2" />Subir Archivo</>
                                 )}
                               </Button>
                               {formData.imageUrl && (
                                 <Button
                                   type="button"
                                   variant="outline"
                                   size="sm"
                                   onClick={() => window.open(formData.imageUrl, '_blank')}
                                 >
                                   <Image className="h-4 w-4 mr-2" />Ver
                                 </Button>
                               )}
                            </div>
                            {(imagePreview || formData.imageUrl) && (
                              <div className="relative">
                                <img
                                  src={imagePreview || formData.imageUrl}
                                  alt="Preview"
                                  className="w-full h-32 object-cover rounded-md border"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, imageUrl: '' }));
                                    setImagePreview(null);
                                    setSelectedImageFile(null);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="icon">Icono</Label>
                          <Input
                            id="icon"
                            value={formData.icon}
                            onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                            placeholder="icon-name"
                          />
                        </div>
                      </div>
                    </div>



                    {/* Estructura del Curso */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">Estructura del Curso</h3>
                      
                      {/* Objetivos Section */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Objetivos de Aprendizaje</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Agregar objetivo..."
                            value={newObjective}
                            onChange={(e) => setNewObjective(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (newObjective.trim()) {
                                  setFormData(prev => ({
                                    ...prev,
                                    objectives: [...prev.objectives, newObjective.trim()]
                                  }));
                                  setNewObjective('');
                                }
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              if (newObjective.trim()) {
                                setFormData(prev => ({
                                  ...prev,
                                  objectives: [...prev.objectives, newObjective.trim()]
                                }));
                                setNewObjective('');
                              }
                            }}
                            size="sm"
                          >
                            Agregar
                          </Button>
                        </div>
                        {formData.objectives.length > 0 && (
                          <div className="space-y-1 max-h-32 overflow-y-auto border rounded p-2">
                            {formData.objectives.map((objective, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <span className="flex-1">{objective}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      objectives: prev.objectives.filter((_, i) => i !== index)
                                    }));
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Prerequisites Section */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Prerrequisitos</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Agregar prerrequisito..."
                            value={newPrerequisite}
                            onChange={(e) => setNewPrerequisite(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (newPrerequisite.trim()) {
                                  setFormData(prev => ({
                                    ...prev,
                                    prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
                                  }));
                                  setNewPrerequisite('');
                                }
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              if (newPrerequisite.trim()) {
                                setFormData(prev => ({
                                  ...prev,
                                  prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
                                }));
                                setNewPrerequisite('');
                              }
                            }}
                            size="sm"
                          >
                            Agregar
                          </Button>
                        </div>
                        {formData.prerequisites.length > 0 && (
                          <div className="space-y-1 max-h-32 overflow-y-auto border rounded p-2">
                            {formData.prerequisites.map((prerequisite, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <span className="flex-1">{prerequisite}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
                                    }));
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
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
        <CardContent>
          <div className="flex items-center justify-between space-y-2">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Select value={activeFilter?.toString() || 'all'} onValueChange={(value) => {
                if (value === 'all') {
                  setActiveFilter(undefined);
                } else {
                  setActiveFilter(value === 'true');
                }
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Activos</SelectItem>
                  <SelectItem value="false">Inactivos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
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
                  checked={columnVisibility.level}
                  onCheckedChange={() => toggleColumnVisibility('level')}
                >
                  Nivel
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.color}
                  onCheckedChange={() => toggleColumnVisibility('color')}
                >
                  Color
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.imageUrl}
                  onCheckedChange={() => toggleColumnVisibility('imageUrl')}
                >
                  URL de Imagen
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.icon}
                  onCheckedChange={() => toggleColumnVisibility('icon')}
                >
                  Icono
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.objectives}
                  onCheckedChange={() => toggleColumnVisibility('objectives')}
                >
                  Objetivos
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.prerequisites}
                  onCheckedChange={() => toggleColumnVisibility('prerequisites')}
                >
                  Prerequisitos
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.estimatedHours}
                  onCheckedChange={() => toggleColumnVisibility('estimatedHours')}
                >
                  Horas Estimadas
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

          <div className="rounded-md border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  {columnVisibility.name && <TableHead>Nombre</TableHead>}
                  {columnVisibility.description && <TableHead>Descripción</TableHead>}
                  {columnVisibility.difficulty && <TableHead>Dificultad</TableHead>}
                  {columnVisibility.level && <TableHead>Nivel</TableHead>}
                  {columnVisibility.color && <TableHead>Color</TableHead>}
                  {columnVisibility.imageUrl && <TableHead>URL de Imagen</TableHead>}
                  {columnVisibility.icon && <TableHead>Icono</TableHead>}
                  {columnVisibility.objectives && <TableHead>Objetivos</TableHead>}
                  {columnVisibility.prerequisites && <TableHead>Prerequisitos</TableHead>}
                  {columnVisibility.estimatedHours && <TableHead>Horas Estimadas</TableHead>}
                  {columnVisibility.isActive && <TableHead>Estado</TableHead>}
                  {columnVisibility.createdAt && <TableHead>Fecha de Creación</TableHead>}
                  {columnVisibility.updatedAt && <TableHead>Última Actualización</TableHead>}
                  {columnVisibility.actions && <TableHead className="text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Cargando skills...
                    </TableCell>
                  </TableRow>
                ) : skills.skills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={15} className="text-center py-8">
                      No se encontraron skills
                    </TableCell>
                  </TableRow>
                ) : (
                  skills.skills.map((skill) => (
                    <TableRow key={skill.id}>
                      {columnVisibility.name && (
                        <TableCell className="font-medium">{skill.name}</TableCell>
                      )}
                      {columnVisibility.description && (
                        <TableCell className="max-w-xs truncate">{skill.description}</TableCell>
                      )}
                      {columnVisibility.difficulty && (
                        <TableCell>
                          <Badge variant="outline">{skill.difficulty}</Badge>
                        </TableCell>
                      )}
                      {columnVisibility.level && (
                        <TableCell>
                          <Badge variant="secondary">{skill.level?.name || 'Sin nivel'}</Badge>
                        </TableCell>
                      )}
                      {columnVisibility.color && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: skill.color }}
                            />
                            <span className="text-sm">{skill.color}</span>
                          </div>
                        </TableCell>
                      )}
                      {columnVisibility.imageUrl && (
                        <TableCell className="max-w-xs truncate">
                          {skill.imageUrl || 'Sin imagen'}
                        </TableCell>
                      )}
                      {columnVisibility.icon && (
                        <TableCell className="max-w-xs truncate">
                          {skill.icon || 'Sin icono'}
                        </TableCell>
                      )}
                      {columnVisibility.objectives && (
                        <TableCell className="max-w-xs">
                          <div className="text-sm">
                            {skill.objectives ? 
                              skill.objectives.split('\n').slice(0, 2).map((obj, idx) => (
                                <div key={idx} className="truncate">• {obj}</div>
                              )) : 'Sin objetivos'
                            }
                            {skill.objectives && skill.objectives.split('\n').length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{skill.objectives.split('\n').length - 2} más
                              </div>
                            )}
                          </div>
                        </TableCell>
                      )}
                      {columnVisibility.prerequisites && (
                        <TableCell className="max-w-xs">
                          <div className="text-sm">
                            {skill.prerequisites ? 
                              skill.prerequisites.split('\n').slice(0, 2).map((prereq, idx) => (
                                <div key={idx} className="truncate">• {prereq}</div>
                              )) : 'Sin prerequisitos'
                            }
                            {skill.prerequisites && skill.prerequisites.split('\n').length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{skill.prerequisites.split('\n').length - 2} más
                              </div>
                            )}
                          </div>
                        </TableCell>
                      )}
                      {columnVisibility.estimatedHours && (
                        <TableCell>
                          <Badge variant="outline">
                            {skill.estimatedHours ? `${skill.estimatedHours}h` : 'No definido'}
                          </Badge>
                        </TableCell>
                      )}
                      {columnVisibility.isActive && (
                        <TableCell>
                          <Badge variant={skill.isActive ? 'default' : 'secondary'}>
                            {skill.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                      )}
                      {columnVisibility.createdAt && (
                        <TableCell>{formatDate(skill.createdAt)}</TableCell>
                      )}
                      {columnVisibility.updatedAt && (
                        <TableCell>{formatDate(skill.updatedAt)}</TableCell>
                      )}
                      {columnVisibility.actions && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(skill)}
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
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente el skill
                                    "{skill.name}" de la base de datos.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(skill.id)}>
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
              {Math.min(skills.page * skills.limit, skills.total)} de {skills.total} skills
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(skills.page - 1)}
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
                onClick={() => handlePageChange(skills.page + 1)}
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