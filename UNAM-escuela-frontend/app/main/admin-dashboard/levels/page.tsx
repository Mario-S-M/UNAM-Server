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
  Select,
  SelectItem,
} from "@heroui/react";
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Search,
  ArrowLeft,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RouteGuard } from "@/components/auth/route-guard";
import {
  usePermissions,
  useAuthorization,
} from "@/app/hooks/use-authorization";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useActiveLenguages } from "@/app/hooks/use-lenguages";
import {
  getLevelsByLenguage,
  createLevel,
  updateLevel,
} from "@/app/actions/level-actions";
import { getContentsByLevel } from "@/app/actions/content-actions";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import GlobalTextArea from "@/components/global/globalTextArea";
import GlobalSelect from "@/components/global/globalSelect";
import { addToast } from "@heroui/react";

export default function LevelsManagementPage() {
  return (
    <RouteGuard requiredPage="/main/admin-dashboard/levels">
      <LevelsManagementContent />
    </RouteGuard>
  );
}

function LevelsManagementContent() {
  const { canManageContent } = usePermissions();
  const { userAssignedLanguage } = useAuthorization();
  const searchParams = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState(
    searchParams.get("language") || ""
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<any>(null);

  // Queries
  const { data: languages, isLoading: languagesLoading } = useActiveLenguages();

  const { data: levels, isLoading: levelsLoading } = useQuery({
    queryKey: ["levels", selectedLanguage],
    queryFn: () => getLevelsByLenguage(selectedLanguage),
    enabled: !!selectedLanguage,
  });

  // Filtrar idiomas basado en el rol del usuario
  const getFilteredLanguages = () => {
    let availableLanguages = languages || [];

    // Si es admin con idioma asignado, solo mostrar su idioma
    if (
      userAssignedLanguage?.isAdminWithLanguage &&
      userAssignedLanguage.assignedLanguageId
    ) {
      availableLanguages = availableLanguages.filter(
        (language: any) =>
          language.id === userAssignedLanguage.assignedLanguageId
      );
      // Auto-seleccionar el idioma asignado si no hay ninguno seleccionado
      if (!selectedLanguage && availableLanguages.length > 0) {
        setSelectedLanguage(availableLanguages[0].id);
      }
    }

    return availableLanguages;
  };

  const filteredLanguages = getFilteredLanguages();

  const filteredLevels = levels?.data?.filter(
    (level: any) =>
      level.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      level.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditLevel = (level: any) => {
    setEditingLevel(level);
    setIsEditModalOpen(true);
  };

  if (!canManageContent) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Card className="max-w-md">
          <CardBody className="text-center py-8">
            <p className="text-default-500">
              No tienes permisos para acceder a esta página.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
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
                <h1 className="text-3xl font-bold text-primary">
                  Gestión de Niveles
                </h1>
                <p className="text-foreground/70">
                  Administra los niveles educativos del sistema
                </p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <Card className="mb-6">
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Seleccionar Idioma"
                  placeholder="Elige un idioma"
                  selectedKeys={
                    selectedLanguage ? new Set([selectedLanguage]) : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setSelectedLanguage(selected || "");
                  }}
                  isLoading={languagesLoading}
                  color="default"
                  classNames={{
                    trigger:
                      "border-default-200 hover:border-default-300 !bg-default-50",
                    value: "text-default-700",
                    label: "text-default-600",
                    selectorIcon: "text-default-600 !text-default-600",
                    listbox: "bg-content1",
                    popoverContent: "bg-content1",
                  }}
                >
                  {filteredLanguages.map((lang: any) => (
                    <SelectItem key={lang.id} textValue={lang.name}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="Buscar"
                  placeholder="Buscar niveles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={<Search className="h-4 w-4" />}
                />{" "}
                <Button
                  color="primary"
                  startContent={<Plus className="h-4 w-4" />}
                  onPress={() => setIsCreateModalOpen(true)}
                  isDisabled={!selectedLanguage}
                  className="h-14"
                >
                  Crear Nivel
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Tabla de Niveles */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  Lista de Niveles
                  {selectedLanguage && filteredLevels && (
                    <span className="text-sm font-normal text-foreground/60 ml-2">
                      ({filteredLevels.length} niveles)
                    </span>
                  )}
                </h2>
              </div>
            </CardHeader>
            <CardBody>
              {!selectedLanguage ? (
                <div className="text-center py-12">
                  <GraduationCap className="h-16 w-16 text-default-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-default-500 mb-2">
                    Selecciona un Idioma
                  </h3>
                  <p className="text-default-400">
                    Primero selecciona un idioma para ver sus niveles
                  </p>
                </div>
              ) : levelsLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : !filteredLevels || filteredLevels.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap className="h-16 w-16 text-default-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-default-500 mb-2">
                    No hay niveles
                  </h3>
                  <p className="text-default-400 mb-4">
                    {searchTerm
                      ? "No se encontraron niveles con ese término de búsqueda"
                      : "Este idioma aún no tiene niveles creados"}
                  </p>
                  <Button
                    color="primary"
                    startContent={<Plus className="h-4 w-4" />}
                    onPress={() => setIsCreateModalOpen(true)}
                  >
                    Crear Primer Nivel
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table aria-label="Tabla de niveles">
                    <TableHeader>
                      <TableColumn>NIVEL</TableColumn>
                      <TableColumn>DESCRIPCIÓN</TableColumn>
                      <TableColumn>DIFICULTAD</TableColumn>
                      <TableColumn>CONTENIDOS</TableColumn>
                      <TableColumn>ESTADO</TableColumn>
                      <TableColumn>ACCIONES</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No hay niveles disponibles">
                      {filteredLevels?.length > 0 ? (
                        filteredLevels.map((level: any) => (
                          <TableRow key={level.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{level.name}</p>
                                <p className="text-xs text-foreground/50">
                                  ID: {level.id}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm text-foreground/70 max-w-xs truncate">
                                {level.description}
                              </p>
                            </TableCell>
                            <TableCell>
                              <Chip
                                size="sm"
                                color={getDifficultyColor(level.difficulty)}
                                variant="flat"
                                className="capitalize"
                              >
                                {getDifficultyLabel(level.difficulty)}
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <LevelContentsCell levelId={level.id} />
                            </TableCell>
                            <TableCell>
                              <Chip
                                size="sm"
                                color={level.isActive ? "success" : "default"}
                              >
                                {level.isActive ? "Activo" : "Inactivo"}
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Link
                                  href={`/main/admin-dashboard/contents?level=${level.id}`}
                                >
                                  <Button isIconOnly size="sm" variant="light">
                                    <BookOpen className="h-4 w-4 text-foreground" />
                                  </Button>
                                </Link>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  onPress={() => handleEditLevel(level)}
                                >
                                  <Edit className="h-4 w-4 text-foreground" />
                                </Button>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  color="danger"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <div className="text-center py-4">
                              <p className="text-foreground/50">
                                No hay niveles disponibles
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modal de crear nivel */}
      <CreateLevelModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        languageId={selectedLanguage}
      />

      {/* Modal de editar nivel */}
      <EditLevelModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        level={editingLevel}
      />
    </>
  );
}

// Componente para mostrar el contenido de un nivel
function LevelContentsCell({ levelId }: { levelId: string }) {
  const { data: contents, isLoading: contentsLoading } = useQuery({
    queryKey: ["contents", levelId],
    queryFn: () => getContentsByLevel(levelId),
  });

  return (
    <div className="flex items-center gap-2">
      {contentsLoading ? (
        <Spinner size="sm" />
      ) : (
        <>
          <BookOpen className="h-4 w-4 text-foreground/50" />
          <span className="text-sm">{contents?.data?.length || 0}</span>
        </>
      )}
    </div>
  );
}

// Modal para crear nivel
interface CreateLevelModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  languageId: string;
}

function CreateLevelModal({
  isOpen,
  onOpenChange,
  languageId,
}: CreateLevelModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const queryClient = useQueryClient();

  const createLevelMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createLevel(formData);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["levels"] });
      addToast({
        title: "Nivel creado",
        description: "El nivel se ha creado exitosamente",
        color: "success",
        timeout: 3000,
      });
      onOpenChange(false);
      setName("");
      setDescription("");
      setDifficulty("beginner");
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "No se pudo crear el nivel",
        color: "danger",
        timeout: 3000,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      addToast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        color: "danger",
        timeout: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("difficulty", difficulty);
    formData.append("lenguageId", languageId);

    await createLevelMutation.mutateAsync(formData);
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Crear Nuevo Nivel"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <GlobalInput
          label="Nombre del Nivel"
          placeholder="Ej: A1, A2, B1, B2..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          isRequired
        />

        <GlobalTextArea
          label="Descripción"
          placeholder="Descripción detallada del nivel..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          isRequired
          minRows={3}
        />

        <GlobalSelect
          label="Dificultad"
          placeholder="Selecciona la dificultad"
          selectedKeys={new Set([difficulty])}
          onSelectionChange={(keys: any) => {
            const selectedArray = Array.from(keys);
            setDifficulty(selectedArray[0] as string);
          }}
          color="default"
          classNames={{
            trigger:
              "border-default-200 hover:border-default-300 !bg-default-50",
            value: "text-default-700",
            label: "text-default-600",
            selectorIcon: "text-default-600 !text-default-600",
            listbox: "bg-content1",
            popoverContent: "bg-content1",
          }}
        >
          <SelectItem key="beginner">Principiante</SelectItem>
          <SelectItem key="mid-intermediate">Medio-Intermedio</SelectItem>
          <SelectItem key="intermediate">Intermedio</SelectItem>
          <SelectItem key="upper-intermediate">Intermedio-Avanzado</SelectItem>
          <SelectItem key="advanced">Avanzado</SelectItem>
        </GlobalSelect>

        <div className="flex justify-end gap-2 pt-4">
          <GlobalButton
            text="Cancelar"
            variant="light"
            onPress={() => onOpenChange(false)}
          />
          <GlobalButton
            text="Crear Nivel"
            color="primary"
            type="submit"
            isLoading={createLevelMutation.isPending}
          />
        </div>
      </form>
    </GlobalModal>
  );
}

// Modal para editar nivel
interface EditLevelModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  level: any;
}

function EditLevelModal({ isOpen, onOpenChange, level }: EditLevelModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const queryClient = useQueryClient();

  // Cargar datos del nivel cuando se abre el modal
  React.useEffect(() => {
    if (level && isOpen) {
      setName(level.name || "");
      setDescription(level.description || "");
      setDifficulty(level.difficulty || "beginner");
    }
  }, [level, isOpen]);

  // Reset cuando se cierra el modal
  React.useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setDifficulty("beginner");
    }
  }, [isOpen]);

  const updateLevelMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const result = await updateLevel(id, formData);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["levels"] });
      addToast({
        title: "Nivel actualizado",
        description: "El nivel se ha actualizado exitosamente",
        color: "success",
        timeout: 3000,
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "No se pudo actualizar el nivel",
        color: "danger",
        timeout: 3000,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔍 HandleSubmit ejecutado");
    console.log("🔍 Datos del formulario:", { name, description, difficulty });
    console.log("🔍 Level ID:", level?.id);

    if (!name.trim() || !description.trim()) {
      console.log("🔍 Validación fallida - campos vacíos");
      addToast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        color: "danger",
        timeout: 3000,
      });
      return;
    }

    if (!level?.id) {
      console.log("🔍 Validación fallida - no hay ID");
      addToast({
        title: "Error",
        description: "No se encontró el ID del nivel",
        color: "danger",
        timeout: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("difficulty", difficulty);

    console.log("🔍 Ejecutando mutación...");
    await updateLevelMutation.mutateAsync({ id: level.id, formData });
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Editar Nivel"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <GlobalInput
          label="Nombre del Nivel"
          placeholder="Ej: A1, A2, B1, B2..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          isRequired
        />

        <GlobalTextArea
          label="Descripción"
          placeholder="Descripción detallada del nivel..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          isRequired
          minRows={3}
        />

        <GlobalSelect
          label="Dificultad"
          placeholder="Selecciona la dificultad"
          selectedKeys={new Set([difficulty])}
          onSelectionChange={(keys: any) => {
            const selectedArray = Array.from(keys);
            setDifficulty(selectedArray[0] as string);
          }}
          color="default"
          classNames={{
            trigger:
              "border-default-200 hover:border-default-300 !bg-default-50",
            value: "text-default-700",
            label: "text-default-600",
            selectorIcon: "text-default-600 !text-default-600",
            listbox: "bg-content1",
            popoverContent: "bg-content1",
          }}
        >
          <SelectItem key="beginner">Principiante</SelectItem>
          <SelectItem key="mid-intermediate">Medio-Intermedio</SelectItem>
          <SelectItem key="intermediate">Intermedio</SelectItem>
          <SelectItem key="upper-intermediate">Intermedio-Avanzado</SelectItem>
          <SelectItem key="advanced">Avanzado</SelectItem>
        </GlobalSelect>

        <div className="flex justify-end gap-2 pt-4">
          <GlobalButton
            text="Cancelar"
            variant="light"
            onPress={() => onOpenChange(false)}
          />
          <GlobalButton
            text="Actualizar Nivel"
            color="primary"
            type="submit"
            isLoading={updateLevelMutation.isPending}
          />
        </div>
      </form>
    </GlobalModal>
  );
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "success";
    case "mid-intermediate":
      return "secondary";
    case "intermediate":
      return "primary";
    case "upper-intermediate":
      return "warning";
    case "advanced":
      return "danger";
    default:
      return "default";
  }
};

const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "Principiante";
    case "mid-intermediate":
      return "Medio-Intermedio";
    case "intermediate":
      return "Intermedio";
    case "upper-intermediate":
      return "Intermedio-Avanzado";
    case "advanced":
      return "Avanzado";
    default:
      return difficulty;
  }
};
