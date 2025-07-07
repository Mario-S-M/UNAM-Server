"use client";

import React, { useState, useEffect } from "react";
import {
  getContentsByLevel,
  createContent,
  getContentsBySkill,
  getContentsByLevelAndSkill,
  validateContent,
  invalidateContent,
  getContentById,
  assignTeachersToContent,
  removeTeacherFromContent,
  adminWorkaroundAssignTeachers,
  updateContent,
  getContentsPaginated,
} from "@/app/actions/content-actions";
import { getActiveSkills } from "@/app/actions/skill-actions";
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
  Pagination,
} from "@heroui/react";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Users,
  Search,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RouteGuard } from "@/components/auth/route-guard";
import { filterTeachersForLanguageCompatibility } from "@/app/actions/level-language-utils";
import {
  usePermissions,
  useAuthorization,
} from "@/app/hooks/use-authorization";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useActiveLenguages } from "@/app/hooks/use-lenguages";
import { getLevelsByLenguage } from "@/app/actions/level-actions";
import { getTeachers } from "@/app/actions/user-actions";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import GlobalTextArea from "@/components/global/globalTextArea";
import GlobalSelect from "@/components/global/globalSelect";
import { addToast } from "@heroui/toast";

export default function ContentsManagementPage() {
  return (
    <RouteGuard requiredPage="/main/admin-dashboard/contents">
      <ContentsManagementContent />
    </RouteGuard>
  );
}

function ContentsManagementContent() {
  const { canManageContent } = usePermissions();
  const { userAssignedLanguage } = useAuthorization();
  const searchParams = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState(
    searchParams.get("language") || ""
  );
  const [selectedLevel, setSelectedLevel] = useState(
    searchParams.get("level") || ""
  );
  const [selectedSkill, setSelectedSkill] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTeachersModalOpen, setIsTeachersModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState("");
  const [editingContent, setEditingContent] = useState<any>(null);

  // Queries
  const { data: languages, isLoading: languagesLoading } = useActiveLenguages();

  const { data: levels, isLoading: levelsLoading } = useQuery({
    queryKey: ["levels", selectedLanguage],
    queryFn: () => getLevelsByLenguage(selectedLanguage),
    enabled: !!selectedLanguage,
  });

  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: getActiveSkills,
  });

  // Use paginated contents query
  const { data: paginatedContents, isLoading: contentsLoading } = useQuery({
    queryKey: [
      "contentsPaginated",
      selectedLevel,
      selectedSkill,
      searchTerm,
      currentPage,
      itemsPerPage,
    ],
    queryFn: () => {
      // Only fetch if we have a level or skill selected
      if (selectedLevel || selectedSkill) {
        return getContentsPaginated({
          levelId: selectedLevel || undefined,
          skillId: selectedSkill || undefined,
          search: searchTerm || undefined,
          page: currentPage,
          limit: itemsPerPage,
        });
      }
      return Promise.resolve({ data: null });
    },
    enabled: !!(selectedLevel || selectedSkill),
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

  // Extract paginated data with proper type checking
  const paginatedData =
    paginatedContents && "data" in paginatedContents
      ? paginatedContents.data
      : null;
  const contents = paginatedData?.contents || [];
  const totalItems = paginatedData?.total || 0;
  const totalPages = paginatedData?.totalPages || 1;
  const hasNextPage = paginatedData?.hasNextPage || false;
  const hasPreviousPage = paginatedData?.hasPreviousPage || false;

  // Since search is handled by the backend, we don't need client-side filtering
  const filteredContents = contents;

  // Reset page when filters change
  const resetPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  // Reset page when level or skill changes
  React.useEffect(() => {
    resetPage();
  }, [selectedLevel, selectedSkill]);

  // Reset page when search term changes (with debounce)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      resetPage();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const queryClient = useQueryClient();

  // Validation mutations
  const validateContentMutation = useMutation({
    mutationFn: validateContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentsPaginated"] });
      addToast({
        title: "¡Éxito!",
        description: "Contenido validado exitosamente",
        color: "success",
      });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "Error al validar el contenido",
        color: "danger",
      });
    },
  });

  const invalidateContentMutation = useMutation({
    mutationFn: invalidateContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentsPaginated"] });
      addToast({
        title: "¡Éxito!",
        description: "Contenido marcado como no validado",
        color: "success",
      });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "Error al invalidar el contenido",
        color: "danger",
      });
    },
  });

  // Handler functions
  const handleValidateContent = (contentId: string) => {
    validateContentMutation.mutate(contentId);
  };

  const handleInvalidateContent = (contentId: string) => {
    invalidateContentMutation.mutate(contentId);
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
                  Gestión de Contenidos
                </h1>
                <p className="text-foreground/70">
                  Administra el contenido educativo del sistema
                </p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <Card className="mb-6">
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Select
                  label="Seleccionar Idioma"
                  placeholder="Elige un idioma"
                  selectedKeys={
                    selectedLanguage ? new Set([selectedLanguage]) : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setSelectedLanguage(selected || "");
                    setSelectedLevel("");
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
                    <SelectItem key={lang.id}>{lang.name}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="Seleccionar Nivel"
                  placeholder="Elige un nivel"
                  selectedKeys={
                    selectedLevel ? new Set([selectedLevel]) : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setSelectedLevel(selected || "");
                  }}
                  isLoading={levelsLoading}
                  isDisabled={!selectedLanguage}
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
                  {(levels?.data || []).map((level: any) => (
                    <SelectItem key={level.id}>{level.name}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="Seleccionar Skill"
                  placeholder="Elige una skill"
                  selectedKeys={
                    selectedSkill ? new Set([selectedSkill]) : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setSelectedSkill(selected || "");
                  }}
                  isLoading={skillsLoading}
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
                  {(skills?.data || []).map((skill: any) => (
                    <SelectItem key={skill.id} textValue={skill.name}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: skill.color }}
                        />
                        {skill.name}
                      </div>
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Buscar"
                  placeholder="Buscar contenidos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={<Search className="h-4 w-4" />}
                />

                <Button
                  color="primary"
                  startContent={<Plus className="h-4 w-4" />}
                  onPress={() => setIsCreateModalOpen(true)}
                  isDisabled={!selectedLevel}
                  className="h-14"
                >
                  Crear Contenido
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Tabla de Contenidos */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  Lista de Contenidos
                  {filteredContents && (
                    <span className="text-sm font-normal text-foreground/60 ml-2">
                      ({filteredContents.length} contenidos)
                    </span>
                  )}
                </h2>
              </div>
            </CardHeader>
            <CardBody>
              {!(selectedLevel || selectedSkill) ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-default-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-default-500 mb-2">
                    Selecciona un Nivel o Skill
                  </h3>
                  <p className="text-default-400">
                    Primero selecciona un nivel o skill para ver los contenidos
                  </p>
                </div>
              ) : contentsLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : !filteredContents || filteredContents.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-default-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-default-500 mb-2">
                    No hay contenidos
                  </h3>
                  <p className="text-default-400 mb-4">
                    {searchTerm
                      ? "No se encontraron contenidos con ese término de búsqueda"
                      : "Este filtro aún no tiene contenidos creados"}
                  </p>
                  <Button
                    color="primary"
                    startContent={<Plus className="h-4 w-4" />}
                    onPress={() => setIsCreateModalOpen(true)}
                    isDisabled={!selectedLevel}
                  >
                    Crear Primer Contenido
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table aria-label="Tabla de contenidos">
                    <TableHeader>
                      <TableColumn>NOMBRE</TableColumn>
                      <TableColumn>DESCRIPCIÓN</TableColumn>
                      <TableColumn>SKILL</TableColumn>
                      <TableColumn>VALIDACIÓN</TableColumn>
                      <TableColumn>PROFESORES</TableColumn>
                      <TableColumn>ACCIONES</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {filteredContents.map((content: any) => (
                        <TableRow key={content.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="font-medium">{content.name}</p>
                                <p className="text-xs text-foreground/50">
                                  ID: {content.id}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-foreground/70 max-w-xs">
                              {content.description.length > 80
                                ? `${content.description.substring(0, 80)}...`
                                : content.description}
                            </p>
                          </TableCell>
                          <TableCell>
                            {content.skill ? (
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{
                                    backgroundColor: content.skill.color,
                                  }}
                                />
                                <span className="text-sm">
                                  {content.skill.name}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-foreground/50">
                                Sin skill
                              </span>
                            )}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              {content.validationStatus === "validado" ? (
                                <Chip size="sm" color="success" variant="dot">
                                  Validado
                                </Chip>
                              ) : (
                                <Chip size="sm" color="danger" variant="dot">
                                  Sin validar
                                </Chip>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-foreground/50" />
                              <span className="text-sm">
                                {content.assignedTeachers?.length || 0}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {/* Validation Controls */}
                              {content.validationStatus === "validado" ? (
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  color="warning"
                                  title="Marcar como no validado"
                                  onPress={() =>
                                    handleInvalidateContent(content.id)
                                  }
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  color="success"
                                  title="Validar contenido"
                                  onPress={() =>
                                    handleValidateContent(content.id)
                                  }
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}

                              {/* Other Actions */}
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="primary"
                                title="Editar contenido"
                                onPress={() => {
                                  setEditingContent(content);
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="secondary"
                                title="Gestionar profesores"
                                onPress={() => {
                                  setSelectedContentId(content.id);
                                  setIsTeachersModalOpen(true);
                                }}
                              >
                                <Users className="h-4 w-4" />
                              </Button>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="danger"
                                title="Eliminar contenido"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {filteredContents &&
                filteredContents.length > 0 &&
                totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <Pagination
                      total={totalPages}
                      page={currentPage}
                      onChange={setCurrentPage}
                      color="primary"
                      variant="light"
                      size="lg"
                      showControls
                      className="gap-2"
                      classNames={{
                        wrapper: "gap-2 overflow-visible shadow-none",
                        item: "w-10 h-10 text-sm bg-transparent border-0 rounded-lg hover:bg-default-100 text-default-600 hover:text-foreground",
                        cursor:
                          "bg-primary text-primary-foreground font-semibold shadow-sm",
                        prev: "bg-transparent hover:bg-default-100 border-0 rounded-lg text-default-600 hover:text-foreground",
                        next: "bg-transparent hover:bg-default-100 border-0 rounded-lg text-default-600 hover:text-foreground",
                      }}
                    />
                  </div>
                )}

              {/* Pagination Info */}
              {filteredContents && filteredContents.length > 0 && (
                <div className="flex justify-between items-center mt-4 px-2 py-2 bg-default-50 rounded-lg">
                  <div className="text-sm text-default-600">
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                    {Math.min(currentPage * itemsPerPage, totalItems)} de{" "}
                    <span className="font-semibold">{totalItems}</span>{" "}
                    contenidos
                  </div>
                  <div className="text-sm text-default-500">
                    Página {currentPage} de {totalPages}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modales */}
      <CreateContentModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        levelId={selectedLevel}
      />

      <EditContentModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        content={editingContent}
      />

      <TeachersManagementModal
        isOpen={isTeachersModalOpen}
        onOpenChange={setIsTeachersModalOpen}
        contentId={selectedContentId}
      />
    </>
  );
}

// Modal para crear contenido
interface CreateContentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  levelId: string;
}

function CreateContentModal({
  isOpen,
  onOpenChange,
  levelId,
}: CreateContentModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [filteredTeachersForLanguage, setFilteredTeachersForLanguage] =
    useState<any[]>([]);
  const [isFilteringTeachers, setIsFilteringTeachers] = useState(false);
  const queryClient = useQueryClient();
  const { userAssignedLanguage } = useAuthorization(); // Obtener información del idioma asignado

  const { data: skills } = useQuery({
    queryKey: ["skills"],
    queryFn: getActiveSkills,
  });

  const { data: teachers, isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const result = await getTeachers();
      return result;
    },
  });

  // Aplicar filtrado de idioma de forma asíncrona cuando cambien los datos
  useEffect(() => {
    const applyLanguageFiltering = async () => {
      if (!teachers?.data || !levelId) {
        setFilteredTeachersForLanguage([]);
        return;
      }

      setIsFilteringTeachers(true);
      try {
        const userLanguageRestriction =
          userAssignedLanguage?.isAdminWithLanguage
            ? userAssignedLanguage.assignedLanguageId || undefined
            : undefined;

        const filtered = await filterTeachersForLanguageCompatibility(
          teachers.data,
          levelId,
          userLanguageRestriction
        );

        setFilteredTeachersForLanguage(filtered);
      } catch (error) {
        console.error("Error applying language filtering:", error);
        // En caso de error, mostrar todos los profesores
        setFilteredTeachersForLanguage(teachers.data);
      } finally {
        setIsFilteringTeachers(false);
      }
    };

    applyLanguageFiltering();
  }, [
    teachers?.data,
    levelId,
    userAssignedLanguage?.isAdminWithLanguage,
    userAssignedLanguage?.assignedLanguageId,
  ]);

  const createContentMutation = useMutation({
    mutationFn: async (formData: any) => {
      const result = await createContent(formData);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentsPaginated"] });
      addToast({
        title: "¡Éxito!",
        description: "Contenido creado exitosamente",
        color: "success",
      });
      onOpenChange(false);
      setName("");
      setDescription("");
      setSelectedSkill("");
      setSelectedTeachers([]);
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "Error al crear el contenido",
        color: "danger",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that a skill is selected
    if (!selectedSkill) {
      addToast({
        title: "Error de validación",
        description: "Debes seleccionar una skill para el contenido",
        color: "danger",
      });
      return;
    }

    // Validate that skills are available
    if (!skills?.data || skills.data.length === 0) {
      addToast({
        title: "Error",
        description: "No hay skills disponibles. Crear una skill primero.",
        color: "danger",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("levelId", levelId);
    formData.append("skillId", selectedSkill);

    if (selectedTeachers.length > 0) {
      formData.append("teacherIds", JSON.stringify(selectedTeachers));
    }

    createContentMutation.mutate(formData);
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Nuevo Contenido"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <GlobalInput
          label="Nombre del Contenido"
          placeholder="Ej: Introducción a la programación"
          value={name}
          onChange={(e) => setName(e.target.value)}
          isRequired
        />

        <GlobalTextArea
          label="Descripción"
          placeholder="Descripción detallada del contenido..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          isRequired
          minRows={3}
        />

        <GlobalSelect
          label="Skill"
          placeholder={
            !skills?.data || skills.data.length === 0
              ? "No hay skills disponibles"
              : "Selecciona una skill (obligatorio)"
          }
          selectedKeys={selectedSkill ? new Set([selectedSkill]) : new Set()}
          onSelectionChange={(keys: any) => {
            const selectedArray = Array.from(keys);
            setSelectedSkill((selectedArray[0] as string) || "");
          }}
          isRequired
          isDisabled={!skills?.data || skills.data.length === 0}
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
          {(skills?.data || []).map((skill: any) => (
            <SelectItem key={skill.id} textValue={skill.name}>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: skill.color }}
                />
                {skill.name}
              </div>
            </SelectItem>
          ))}
        </GlobalSelect>

        {(!skills?.data || skills.data.length === 0) && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <p className="text-sm text-orange-800">
                No hay skills disponibles. Debes{" "}
                <Link
                  href="/main/admin-dashboard/skills"
                  className="underline hover:no-underline"
                >
                  crear una skill
                </Link>{" "}
                antes de poder crear contenido.
              </p>
            </div>
          </div>
        )}

        {/* Sección de asignación de profesores */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Asignar Profesores{" "}
            <span className="text-default-400">(Opcional)</span>
          </label>
          <p className="text-xs text-default-500 mb-2">
            Puedes asignar profesores ahora o hacerlo más tarde desde la gestión
            de contenidos
          </p>

          {teachersLoading || isFilteringTeachers ? (
            <div className="flex items-center gap-2 py-2">
              <Spinner size="sm" />
              <span className="text-sm text-default-600">
                {teachersLoading
                  ? "Cargando profesores..."
                  : "Aplicando filtros de idioma..."}
              </span>
            </div>
          ) : (filteredTeachersForLanguage || []).length === 0 ? (
            <div className="p-4 bg-default-50 border border-default-200 rounded-md text-center">
              <Users className="h-5 w-5 mx-auto text-default-400 mb-2" />
              <p className="text-sm text-default-600">
                La asignación de profesores podrá realizarse después de crear el
                contenido
              </p>
              <p className="text-xs text-default-500 mt-1">
                Utiliza la opción "Gestionar profesores" desde la lista de
                contenidos
              </p>
            </div>
          ) : (
            <GlobalSelect
              label="Asignar Profesores"
              placeholder="Selecciona profesores para asignar (opcional)"
              selectionMode="multiple"
              selectedKeys={selectedTeachers}
              onSelectionChange={(keys: any) => {
                setSelectedTeachers(Array.from(keys) as string[]);
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
              {filteredTeachersForLanguage.map((teacher: any) => (
                <SelectItem key={teacher.id} textValue={teacher.fullName}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-default-100 rounded-full flex items-center justify-center">
                      <Users className="h-3 w-3 text-default-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {teacher.fullName}
                      </span>
                      <span className="text-xs text-default-500">
                        {teacher.email}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </GlobalSelect>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <GlobalButton
            text="Cancelar"
            variant="light"
            onPress={() => onOpenChange(false)}
          />
          <GlobalButton
            text="Crear Contenido"
            color="primary"
            type="submit"
            isLoading={createContentMutation.isPending}
            isDisabled={
              createContentMutation.isPending ||
              !skills?.data ||
              skills.data.length === 0
            }
          />
        </div>
      </form>
    </GlobalModal>
  );
}

// Modal para editar contenido
interface EditContentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  content: any;
}

function EditContentModal({
  isOpen,
  onOpenChange,
  content,
}: EditContentModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  // Reset form when modal opens with new content
  useEffect(() => {
    if (content && isOpen) {
      setName(content.name || "");
      setDescription(content.description || "");
    }
  }, [content, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
    }
  }, [isOpen]);

  const updateContentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await updateContent(content.id, formData);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentsPaginated"] });
      addToast({
        title: "¡Éxito!",
        description: "Contenido actualizado exitosamente",
        color: "success",
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "Error al actualizar el contenido",
        color: "danger",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      addToast({
        title: "Error de validación",
        description: "El nombre y la descripción son obligatorios",
        color: "danger",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    updateContentMutation.mutate(formData);
  };

  if (!content) return null;

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Editar Contenido"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <GlobalInput
          label="Nombre del Contenido"
          placeholder="Ej: Introducción a la programación"
          value={name}
          onChange={(e) => setName(e.target.value)}
          isRequired
        />

        <GlobalTextArea
          label="Descripción"
          placeholder="Descripción detallada del contenido..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          isRequired
          minRows={3}
        />

        <div className="flex justify-end gap-2 pt-4">
          <GlobalButton
            text="Cancelar"
            variant="light"
            onPress={() => onOpenChange(false)}
          />
          <GlobalButton
            text="Actualizar Contenido"
            color="primary"
            type="submit"
            isLoading={updateContentMutation.isPending}
          />
        </div>
      </form>
    </GlobalModal>
  );
}

// Modal para gestionar profesores
interface TeachersManagementModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
}

function TeachersManagementModal({
  isOpen,
  onOpenChange,
  contentId,
}: TeachersManagementModalProps) {
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTeachersForLanguage, setFilteredTeachersForLanguage] =
    useState<any[]>([]);
  const [isFilteringTeachers, setIsFilteringTeachers] = useState(false);
  const queryClient = useQueryClient();
  const { userRole } = usePermissions(); // Obtener el rol del usuario actual
  const { userAssignedLanguage } = useAuthorization(); // Obtener información del idioma asignado

  // Obtener datos del contenido
  const { data: content, isLoading: contentLoading } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => getContentById(contentId),
    enabled: !!contentId && isOpen,
  });

  // Obtener lista de profesores con manejo de errores mejorado
  const {
    data: teachers,
    isLoading: teachersLoading,
    error: teachersError,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const result = await getTeachers();
      return result;
    },
    enabled: isOpen,
    retry: 2, // Aumentar los reintentos
    retryDelay: 1000, // Esperar 1 segundo entre reintentos
  });

  // Aplicar filtrado de idioma de forma asíncrona cuando cambien los datos
  useEffect(() => {
    const applyLanguageFiltering = async () => {
      if (!teachers?.data || !content?.data?.levelId) {
        setFilteredTeachersForLanguage([]);
        return;
      }

      setIsFilteringTeachers(true);
      try {
        const userLanguageRestriction =
          userAssignedLanguage?.isAdminWithLanguage
            ? userAssignedLanguage.assignedLanguageId || undefined
            : undefined;

        const filtered = await filterTeachersForLanguageCompatibility(
          teachers.data,
          content.data.levelId,
          userLanguageRestriction
        );

        setFilteredTeachersForLanguage(filtered);
      } catch (error) {
        console.error("Error applying language filtering:", error);
        // En caso de error, mostrar todos los profesores
        setFilteredTeachersForLanguage(teachers.data);
      } finally {
        setIsFilteringTeachers(false);
      }
    };

    applyLanguageFiltering();
  }, [
    teachers?.data,
    content?.data?.levelId,
    userAssignedLanguage?.isAdminWithLanguage,
    userAssignedLanguage?.assignedLanguageId,
  ]);

  // Inicializar con profesores ya asignados
  useEffect(() => {
    if (content?.data?.assignedTeachers) {
      setSelectedTeacherIds(
        content.data.assignedTeachers.map((teacher: any) => teacher.id)
      );
    }
  }, [content?.data?.assignedTeachers]);

  // Filtrar profesores por búsqueda después de aplicar filtros de idioma
  const searchFilteredTeachers = (() => {
    if (!searchQuery) return filteredTeachersForLanguage;

    const searchLower = searchQuery.toLowerCase();
    return filteredTeachersForLanguage.filter(
      (teacher: any) =>
        teacher.fullName?.toLowerCase().includes(searchLower) ||
        teacher.email?.toLowerCase().includes(searchLower)
    );
  })();

  const assignTeachersMutation = useMutation({
    mutationFn: async (teacherIds: string[]) => {
      let result;

      // Si el usuario es admin pero no es superUser, usar el workaround
      if (userRole === "admin") {
        // Usar nuestra función workaround especial para admins
        result = await adminWorkaroundAssignTeachers(contentId, teacherIds);
      } else {
        // Método normal para superUsers u otros casos
        result = await assignTeachersToContent(contentId, teacherIds);
      }

      if (result.error) {
        // Si es un error de permisos, intentar el workaround como última opción
        if (result.error.includes("superUser")) {
          // Intentar con el workaround en caso de error de permisos
          const workaroundResult = await adminWorkaroundAssignTeachers(
            contentId,
            teacherIds
          );

          if (workaroundResult.error) {
            throw new Error(
              `No se pudieron asignar profesores: ${workaroundResult.error}`
            );
          }

          return workaroundResult;
        }

        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentsPaginated"] });
      queryClient.invalidateQueries({ queryKey: ["content", contentId] });
      addToast({
        title: "¡Éxito!",
        description: "Profesores asignados exitosamente",
        color: "success",
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      addToast({
        title: "Error en la asignación",
        description: error.message || "Error al asignar profesores",
        color: "danger",
      });

      // Si es un error de permisos, mostrar mensaje adicional
      if (error.message.includes("superUser")) {
        addToast({
          title: "Restricción de permisos",
          description:
            "Este es un problema conocido en el backend que requiere el rol superUser. Estamos trabajando en una solución.",
          color: "warning",
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mostrar mensaje informativo antes de intentar
    addToast({
      title: "Procesando asignación",
      description: `Asignando ${selectedTeacherIds.length} profesores al contenido`,
      color: "primary",
      timeout: 3000,
    });

    // Informar sobre la restricción conocida
    if (userRole === "admin") {
      addToast({
        title: "Información importante",
        description:
          "Como administrador, se utilizará un método alternativo para asignar profesores, ya que el método directo está restringido a superUsuarios.",
        color: "warning",
        timeout: 5000,
      });
    }

    assignTeachersMutation.mutate(selectedTeacherIds);
  };

  const handleRemoveTeacher = async (teacherId: string) => {
    try {
      const result = await removeTeacherFromContent(contentId, teacherId);
      if (result.error) {
        throw new Error(result.error);
      }

      queryClient.invalidateQueries({ queryKey: ["contentsPaginated"] });
      queryClient.invalidateQueries({ queryKey: ["content", contentId] });

      addToast({
        title: "¡Éxito!",
        description: "Profesor removido exitosamente",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al remover profesor",
        color: "danger",
      });
    }
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`Gestionar Profesores - ${content?.data?.name || "Contenido"}`}
    >
      {/* Info de diagnóstico */}
      <div className="mb-4 p-2 bg-default-50 border border-default-200 text-default-800 text-xs rounded-md">
        <p>
          <strong>Rol de usuario:</strong> {userRole}
        </p>
        <p>
          <strong>Estado carga:</strong>{" "}
          {teachersLoading || isFilteringTeachers
            ? "Cargando..."
            : "Completado"}
        </p>
        <p>
          <strong>Profesores encontrados:</strong>{" "}
          {filteredTeachersForLanguage?.length || 0}
        </p>
      </div>

      {contentLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del contenido */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              Información del Contenido
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Nombre:</strong> {content?.data?.name}
              </p>
              <p>
                <strong>Descripción:</strong> {content?.data?.description}
              </p>
            </div>
          </div>

          {/* Profesores actualmente asignados */}
          {content?.data?.assignedTeachers &&
            content.data.assignedTeachers.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Profesores Actualmente Asignados (
                  {content.data.assignedTeachers.length})
                </h4>
                <div className="space-y-2">
                  {content.data.assignedTeachers.map((teacher: any) => (
                    <div
                      key={teacher.id}
                      className="flex items-center justify-between p-3 bg-default-50 rounded-lg border border-default-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-default-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-default-600" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {teacher.fullName}
                          </p>
                          <p className="text-sm text-default-500">
                            {teacher.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        title="Remover profesor"
                        onPress={() => handleRemoveTeacher(teacher.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Buscar y asignar nuevos profesores */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Asignar Profesores
            </h4>

            <GlobalInput
              label="Buscar Profesores"
              placeholder="Buscar por nombre o correo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search className="h-4 w-4" />}
              className="mb-4"
              isClearable
            />

            {teachersLoading || isFilteringTeachers ? (
              <div className="flex justify-center py-4">
                <Spinner size="sm" />
                <span className="ml-2 text-sm text-gray-600">
                  {teachersLoading
                    ? "Cargando profesores..."
                    : "Aplicando filtros de idioma..."}
                </span>
              </div>
            ) : teachersError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-center">
                <AlertCircle className="h-5 w-5 mx-auto text-red-400 mb-2" />
                <p className="text-sm text-red-600">
                  Error al cargar profesores
                </p>
                <p className="text-xs text-red-500 mt-1">
                  Tu rol actual: {userRole}. El error es relacionado con
                  permisos.
                </p>
                <p className="text-xs text-default-600 mt-2">
                  Expandiendo búsqueda... usando método alternativo
                </p>
                <Button
                  color="primary"
                  size="sm"
                  className="mt-2"
                  onPress={() => {
                    // Forzar una recarga de los datos
                    queryClient.invalidateQueries({ queryKey: ["teachers"] });
                  }}
                >
                  Reintentar
                </Button>
              </div>
            ) : filteredTeachersForLanguage.length === 0 ? (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
                <Users className="h-5 w-5 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  No hay profesores disponibles para asignar
                </p>
                <p className="text-xs text-default-500 mt-1">
                  Para añadir profesores, es necesario que haya usuarios con rol
                  de docente en el sistema
                </p>
                <p className="text-xs text-default-500 mt-1">
                  Tu rol actual: {userRole}
                </p>
              </div>
            ) : (
              <>
                <div className="text-xs text-default-500 mb-2">
                  Selecciona uno o más profesores para asignar al contenido
                </div>
                <GlobalSelect
                  label="Profesores Disponibles"
                  placeholder="Selecciona profesores"
                  selectionMode="multiple"
                  selectedKeys={selectedTeacherIds}
                  onSelectionChange={(keys: any) =>
                    setSelectedTeacherIds(Array.from(keys) as string[])
                  }
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
                  {searchFilteredTeachers?.map((teacher: any) => (
                    <SelectItem
                      key={teacher.id}
                      textValue={`${teacher.fullName} (${teacher.email})`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {teacher.fullName}
                          </span>
                          <span className="text-xs text-default-500">
                            {teacher.email}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  )) || []}
                </GlobalSelect>

                {filteredTeachersForLanguage?.length === 0 && (
                  <div className="text-center py-2 text-default-500 text-sm">
                    No se encontraron profesores con ese criterio de búsqueda
                  </div>
                )}
              </>
            )}
          </div>

          {/* Información adicional */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Información importante:</p>
                <ul className="space-y-1 text-xs">
                  <li>
                    • Los profesores asignados podrán ver y editar este
                    contenido
                  </li>
                  <li>• El contenido aparecerá en su panel de profesor</li>
                  <li>
                    • Pueden crear y editar el contenido markdown del curso
                  </li>
                  <li>
                    • Solo los administradores pueden asignar/desasignar
                    profesores
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <GlobalButton
              text="Cancelar"
              variant="light"
              onPress={() => onOpenChange(false)}
            />
            <GlobalButton
              text="Asignar Profesores"
              color="primary"
              type="submit"
              isLoading={assignTeachersMutation.isPending}
            />
          </div>
        </form>
      )}
    </GlobalModal>
  );
}
