"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
  Spinner,
  Button,
  Input,
  useDisclosure,
} from "@heroui/react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";
import Link from "next/link";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  toggleSkillActive,
} from "@/app/actions/skill-actions";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import GlobalTextArea from "@/components/global/globalTextArea";
import { addToast } from "@heroui/toast";
import {
  CreateSkillInput,
  UpdateSkillInput,
  Skill,
} from "@/app/interfaces/skill-interfaces";

export default function SkillsManagementPage() {
  const { canManageSkills } = usePermissions();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onOpenChange: setIsCreateModalOpen,
  } = useDisclosure();

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onOpenChange: setIsEditModalOpen,
  } = useDisclosure();

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
      setIsCreateModalOpen();
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
      setIsEditModalOpen();
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
    onEditModalOpen();
  };

  // Filter skills based on search term
  const filteredSkills =
    skillsData?.data?.filter(
      (skill) =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (!canManageSkills) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-danger">No tienes permisos para gestionar skills</p>
      </div>
    );
  }

  return (
    <RouteGuard requiredPage="/main/admin">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/main/admin-dashboard">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Gestión de Skills</h1>
              <p className="text-default-600">
                Administra las habilidades del sistema
              </p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<Plus className="h-4 w-4" />}
            onPress={onCreateModalOpen}
          >
            Nueva Skill
          </Button>
        </div>

        <Card>
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">Skills</p>
              <p className="text-small text-default-500">
                Lista de todas las skills del sistema
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex justify-between gap-3 items-end mb-4">
              <Input
                isClearable
                className="w-full sm:max-w-[44%]"
                placeholder="Buscar skills..."
                startContent={<Search className="h-4 w-4" />}
                value={searchTerm}
                onClear={() => setSearchTerm("")}
                onValueChange={setSearchTerm}
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-danger">
                Error al cargar las skills
              </div>
            ) : (
              <Table aria-label="Skills table">
                <TableHeader>
                  <TableColumn>NOMBRE</TableColumn>
                  <TableColumn>DESCRIPCIÓN</TableColumn>
                  <TableColumn>COLOR</TableColumn>
                  <TableColumn>ESTADO</TableColumn>
                  <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredSkills.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: skill.color }}
                          />
                          <span className="font-medium">{skill.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-small text-default-600">
                          {skill.description.length > 80
                            ? `${skill.description.substring(0, 80)}...`
                            : skill.description}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border border-default-300"
                            style={{ backgroundColor: skill.color }}
                          />
                          <span className="text-small font-mono">
                            {skill.color}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          color={skill.isActive ? "success" : "danger"}
                          variant="flat"
                          size="sm"
                        >
                          {skill.isActive ? "Activa" : "Inactiva"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="primary"
                            onPress={() => handleEditSkill(skill)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color={skill.isActive ? "warning" : "success"}
                            onPress={() => handleToggleActive(skill.id)}
                          >
                            {skill.isActive ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => handleDeleteSkill(skill.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>

        <CreateSkillModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSubmit={handleCreateSkill}
          isLoading={createSkillMutation.isPending}
        />

        <EditSkillModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          skill={selectedSkill}
          onSubmit={handleUpdateSkill}
          isLoading={updateSkillMutation.isPending}
        />
      </div>
    </RouteGuard>
  );
}

// Create Skill Modal Component
interface CreateSkillModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateSkillInput) => void;
  isLoading: boolean;
}

function CreateSkillModal({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateSkillModalProps) {
  const [formData, setFormData] = useState<CreateSkillInput>({
    name: "",
    description: "",
    color: "#3B82F6",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({ name: "", description: "", color: "#3B82F6" });
    onOpenChange(false);
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Nueva Skill"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <GlobalInput
          label="Nombre"
          placeholder="Ingresa el nombre de la skill"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <GlobalTextArea
          label="Descripción"
          placeholder="Describe la skill"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="w-12 h-10 rounded border border-default-300"
            />
            <Input
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              placeholder="#3B82F6"
              className="font-mono"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="light" onPress={handleClose}>
            Cancelar
          </Button>
          <GlobalButton
            type="submit"
            color="primary"
            isLoading={isLoading}
            startContent={<Plus className="h-4 w-4" />}
          >
            Crear Skill
          </GlobalButton>
        </div>
      </form>
    </GlobalModal>
  );
}

// Edit Skill Modal Component
interface EditSkillModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  skill: Skill | null;
  onSubmit: (data: UpdateSkillInput) => void;
  isLoading: boolean;
}

function EditSkillModal({
  isOpen,
  onOpenChange,
  skill,
  onSubmit,
  isLoading,
}: EditSkillModalProps) {
  const [formData, setFormData] = useState<UpdateSkillInput>({
    id: "",
    name: "",
    description: "",
    color: "#3B82F6",
  });

  React.useEffect(() => {
    if (skill) {
      setFormData({
        id: skill.id,
        name: skill.name,
        description: skill.description,
        color: skill.color,
      });
    }
  }, [skill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Editar Skill"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <GlobalInput
          label="Nombre"
          placeholder="Ingresa el nombre de la skill"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <GlobalTextArea
          label="Descripción"
          placeholder="Describe la skill"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="w-12 h-10 rounded border border-default-300"
            />
            <Input
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              placeholder="#3B82F6"
              className="font-mono"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="light" onPress={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <GlobalButton
            type="submit"
            color="primary"
            isLoading={isLoading}
            startContent={<Edit className="h-4 w-4" />}
          >
            Actualizar Skill
          </GlobalButton>
        </div>
      </form>
    </GlobalModal>
  );
}
