import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSkills,
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
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Queries
  const {
    data: skillsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
  });

  // Mutations
  const createSkillMutation = useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
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
      queryClient.invalidateQueries({ queryKey: ["skills"] });
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
      queryClient.invalidateQueries({ queryKey: ["skills"] });
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
      queryClient.invalidateQueries({ queryKey: ["skills"] });
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
  const filteredSkills =
    skillsData?.data?.filter(
      (skill: Skill) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return {
    searchTerm,
    setSearchTerm,
    filteredSkills,
    isLoading,
    error,
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
