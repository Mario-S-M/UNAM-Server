import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSkillsPaginated,
  createSkill,
  updateSkill,
  deleteSkill,
  toggleSkillActive,
} from "@/app/actions/skill-actions";
import { addToast } from "@heroui/toast";
import {
  CreateSkillInput,
  UpdateSkillInput,
  Skill,
} from "@/app/interfaces/skill-interfaces";

export default function useSkillsManagement() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filtros
  const filters = {
    search: debouncedSearchTerm || undefined,
    isActive: statusFilter,
    page: currentPage,
    limit: pageSize,
  };

  // Queries
  const {
    data: paginatedSkillsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["skillsPaginated", filters],
    queryFn: () => getSkillsPaginated(filters),
    staleTime: 1000 * 60,
  });

  const paginatedData = paginatedSkillsResponse?.data;
  const skills = paginatedData?.skills || [];
  const totalPages = paginatedData?.totalPages || 1;

  // Mutations
  const createSkillMutation = useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skillsPaginated"] });
      addToast({
        title: "¡Éxito!",
        description: "Skill creada exitosamente",
        color: "success",
      });
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error.message || "Error al crear la skill",
        color: "danger",
      });
    },
  });

  const updateSkillMutation = useMutation({
    mutationFn: updateSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skillsPaginated"] });
      addToast({
        title: "¡Éxito!",
        description: "Skill actualizada exitosamente",
        color: "success",
      });
      setIsEditModalOpen(false);
      setSelectedSkill(null);
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error.message || "Error al actualizar la skill",
        color: "danger",
      });
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skillsPaginated"] });
      addToast({
        title: "¡Éxito!",
        description: "Skill eliminada exitosamente",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error.message || "Error al eliminar la skill",
        color: "danger",
      });
    },
  });

  const toggleSkillMutation = useMutation({
    mutationFn: toggleSkillActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skillsPaginated"] });
      addToast({
        title: "¡Éxito!",
        description: "Estado de la skill actualizado",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error.message || "Error al cambiar el estado",
        color: "danger",
      });
    },
  });

  // Handlers
  const handleCreateSkill = (data: CreateSkillInput) => {
    createSkillMutation.mutate(data);
  };

  const handleUpdateSkill = (data: UpdateSkillInput) => {
    updateSkillMutation.mutate(data);
  };

  const handleDeleteSkill = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta skill?")) {
      deleteSkillMutation.mutate(id);
    }
  };

  const handleToggleActive = (id: string) => {
    toggleSkillMutation.mutate(id);
  };

  const handleEditSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsEditing(true);
    setIsEditModalOpen(true);
  };

  // Filter skills based on search term
  const filteredSkills = skills || [];

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    setDebouncedSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    filteredSkills,
    skills,
    skillsLoading: isLoading,
    skillsError: error,
    paginatedData,
    totalPages,
    filters,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedSkill,
    setSelectedSkill,
    isEditing,
    setIsEditing,
    handleCreateSkill,
    handleUpdateSkill,
    handleDeleteSkill,
    handleToggleActive,
    handleEditSkill,
    createSkillMutation,
    updateSkillMutation,
  };
}
