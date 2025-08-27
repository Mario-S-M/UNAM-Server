'use client';

import React, { useState, useEffect } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Settings, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Import from the new modular structure
import {
  SkillDialog,
  SkillTable,
  useSkillMutations,
  type Skill,
  type ColumnVisibility
} from '@/skills';
import { useSkillData } from './hooks/useSkillData';

export default function SkillsAdminPage() {
  const { token } = useAuth();
  
  // State management
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | undefined>(undefined);
  const [selectedLevelId, setSelectedLevelId] = useState<string | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    description: false,
    difficulty: true,
    level: true,
    color: true,
    imageUrl: false,
    icon: false,
    objectives: false,
    prerequisites: false,
    estimatedHours: false,
    isActive: true,
    createdAt: false,
    updatedAt: false,
    actions: true,
  });

  // Custom hooks
  const {
    skills,
    languages,
    levels,
    loading,
    fetchSkills,
    fetchLanguages,
    fetchLevelsByLanguage
  } = useSkillData(token || undefined);

  const refreshSkills = () => {
    fetchSkills(search, currentPage, pageSize, activeFilter, selectedLevelId, selectedLanguageId);
  };

  const {
    handleCreate,
    handleUpdate,
    handleDelete
  } = useSkillMutations(refreshSkills);

  // Effects
  useEffect(() => {
    if (token) {
      refreshSkills();
    }
  }, [search, currentPage, pageSize, activeFilter, selectedLevelId, selectedLanguageId, token]);

  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  useEffect(() => {
    if (selectedLanguageId) {
      fetchLevelsByLanguage(selectedLanguageId);
    }
  }, [selectedLanguageId, fetchLevelsByLanguage]);

  // Event handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleColumnVisibility = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSkill(null);
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (editingSkill) {
        await handleUpdate(editingSkill.id, formData);
      } else {
        await handleCreate(formData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting skill:', error);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      await handleDelete(skillId);
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Administración de Skills
              </CardTitle>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Skill
            </Button>
          </div>
          <SkillDialog
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
            onSubmit={handleSubmit}
            editingSkill={editingSkill}
            languages={languages}
            levels={levels}
            onLanguageChange={(langId) => {
              if (langId) {
                fetchLevelsByLanguage(langId);
              }
            }}
          />
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <div className="mb-3">
                      <label className="text-sm font-medium mb-1 block">Idioma</label>
                      <Select value={selectedLanguageId || "all"} onValueChange={(value) => {
                        const languageId = value === "all" ? undefined : value;
                        setSelectedLanguageId(languageId);
                        if (languageId) {
                          fetchLevelsByLanguage(languageId);
                        } else {
                          setSelectedLevelId(undefined);
                        }
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
                    <div className="mb-3">
                      <label className="text-sm font-medium mb-1 block">Nivel</label>
                      <Select 
                        value={selectedLevelId || "all"} 
                        onValueChange={(value) => setSelectedLevelId(value === "all" ? undefined : value)}
                        disabled={!selectedLanguageId}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los niveles</SelectItem>
                          {levels.map((level) => (
                            <SelectItem key={level.id} value={level.id}>
                              {level.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Estado</label>
                      <Select value={activeFilter?.toString() || 'all'} onValueChange={(value) => {
                        if (value === 'all') {
                          setActiveFilter(undefined);
                        } else {
                          setActiveFilter(value === 'true');
                        }
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

          <SkillTable
            skills={skills.data}
            loading={loading}
            columnVisibility={columnVisibility}
            onEdit={handleEdit}
            onDelete={handleDeleteSkill}
          />

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