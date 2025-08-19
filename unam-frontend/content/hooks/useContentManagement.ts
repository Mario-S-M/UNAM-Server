import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { GET_CONTENTS, CREATE_CONTENT, UPDATE_CONTENT, DELETE_CONTENT, GET_LEVELS, GET_SKILLS, GET_TEACHERS } from '@/lib/graphql/queries';
import { Content, CreateContentFormData as ContentFormData, Level, Skill, Teacher } from '../../types';
import { PaginatedContents as ContentsData } from '../../types';
import { 
  validateContentForm,
  cleanContentFormData,
  type CreateContentFormData,
  type UpdateContentFormData 
} from '@/schemas/content-forms';

interface GraphQLError {
  message: string;
  extensions?: {
    code?: string;
    [key: string]: string | number | boolean | null | undefined;
  };
}

function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string';
}

import { ContentColumnVisibility as ColumnVisibility } from '../../types';

const initialFormData: ContentFormData = {
  name: '',
  description: '',
  levelId: '',
  skillId: '',
  teacherIds: [],
  validationStatus: 'PENDING'
};

export function useContentManagement() {
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [activeFilter, setActiveFilter] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('all');
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    description: true,
    level: true,
    skill: true,
    status: true,
    teachers: true,
    createdAt: false,
    updatedAt: false,
    actions: true
  });
  const [formData, setFormData] = useState<ContentFormData>(initialFormData);

  // Queries
  const { data: contentsData, loading: contentsLoading, refetch: refetchContents } = useQuery<ContentsData>(GET_CONTENTS, {
    variables: {
      page: currentPage,
      limit: pageSize
    }
  });
  
  const { data: levelsData } = useQuery(GET_LEVELS);
  const { data: skillsData } = useQuery(GET_SKILLS, {
    variables: {
      page: 1,
      limit: 100
    }
  });
  const { data: teachersData } = useQuery(GET_TEACHERS);
  
  // Mutations
  const [createContent, { loading: createLoading }] = useMutation(CREATE_CONTENT);
  const [updateContent, { loading: updateLoading }] = useMutation(UPDATE_CONTENT);
  const [deleteContent, { loading: deleteLoading }] = useMutation(DELETE_CONTENT);

  // Derived data
  const contents: Content[] = contentsData?.contents || [];
  const levels: Level[] = levelsData?.levels || [];
  const skills: Skill[] = skillsData?.skills || [];
  const teachers: Teacher[] = teachersData?.teachers || [];
  const totalPages = Math.ceil((contentsData?.total || 0) / pageSize);
  const totalItems = contentsData?.total || 0;
  const meta = contentsData;

  const filteredContents = contents.filter(content => {
    // Buscar el skill por ID para obtener el nombre
    const skill = skills.find(s => s.id === content.skillId);
    const skillName = skill?.name || '';
    
    const matchesSearch = content.name.toLowerCase().includes(search.toLowerCase()) ||
      content.description.toLowerCase().includes(search.toLowerCase()) ||
      skillName.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || content.validationStatus === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Actions
  const resetForm = () => {
    setFormData(initialFormData);
    setEditingContent(null);
  };

  const handleCreate = async () => {
    try {
      // Limpiar y validar datos del formulario con Zod
      const cleanedData = cleanContentFormData(formData);
      const validationResult = validateContentForm(cleanedData, false);
      
      if (!validationResult.success) {
         const errors = validationResult.error.issues.map(issue => issue.message).join(', ');
         toast.error(errors || 'Error de validación');
         return;
       }
      
      await createContent({
        variables: {
          createContentInput: validationResult.data
        }
      });
      toast.success('Contenido creado exitosamente');
      setIsCreateModalOpen(false);
      resetForm();
      refetchContents();
    } catch (error: unknown) {
      const message = isErrorWithMessage(error) ? error.message : 'Error al crear el contenido';
      toast.error(message);
    }
  };

  const handleUpdate = async () => {
    if (!editingContent) return;
    
    try {
      // Limpiar y validar datos del formulario con Zod
      const cleanedData = cleanContentFormData(formData);
      const validationResult = validateContentForm(cleanedData, true);
      
      if (!validationResult.success) {
         const errors = validationResult.error.issues.map(issue => issue.message).join(', ');
         toast.error(errors || 'Error de validación');
         return;
       }
      
      await updateContent({
        variables: {
          updateContentInput: {
            id: editingContent.id,
            ...validationResult.data
          }
        }
      });
      toast.success('Contenido actualizado exitosamente');
      setEditingContent(null);
      resetForm();
      refetchContents();
    } catch (error: unknown) {
      const message = isErrorWithMessage(error) ? error.message : 'Error al actualizar el contenido';
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContent({
        variables: { id }
      });
      toast.success('Contenido eliminado exitosamente');
      refetchContents();
    } catch (error: unknown) {
      const message = isErrorWithMessage(error) ? error.message : 'Error al eliminar el contenido';
      toast.error(message);
    }
  };

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setFormData({
      name: content.name,
      description: content.description,
      levelId: content.levelId || '',
      skillId: content.skillId || '',
      teacherIds: content.assignedTeachers?.map(teacher => teacher.id) || [],
      validationStatus: (content.validationStatus || 'PENDING') as 'PENDING' | 'APPROVED' | 'REJECTED'
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setEditingContent(null);
    resetForm();
  };

  const handleModalSubmit = () => {
    if (editingContent) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const toggleColumnVisibility = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return {
    // State
    search,
    pageSize,
    activeFilter,
    columnVisibility,
    isCreateModalOpen,
    editingContent,
    currentPage,
    formData,
    
    // Data
    contents: filteredContents,
    levels,
    skills,
    teachers,
    meta,
    totalPages,
    totalItems,
    
    // Loading states
    contentsLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    
    // Actions
    setSearch,
    setPageSize,
    setActiveFilter,
    toggleColumnVisibility,
    handleSearchChange,
    formatDate,
    setIsCreateModalOpen,
    setFormData,
    handleEdit,
    handleDelete,
    handlePageChange,
    handleModalClose,
    handleModalSubmit
  };
}