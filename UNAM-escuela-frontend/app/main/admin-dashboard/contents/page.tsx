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
  ButtonGroup,
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
  Settings,
  PanelLeft,
  Square,
  Eye,
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
import CreateContentModal from "./components/CreateContentModal";
import EditContentModal from "./components/EditContentModal";
import TeachersManagementModal from "./components/TeachersManagementModal";
import ContentFilters from "./components/ContentFilters";
import SimpleContentTable from "./components/SimpleContentTable";
import EmptyState from "./components/EmptyState";
import PaginationInfo from "./components/PaginationInfo";
import ContentPreviewModal from "./components/ContentPreviewModal";
import ContentPreviewDrawer from "./components/ContentPreviewDrawer";
import ContentPreviewAdvancedModal from "./components/ContentPreviewAdvancedModal";
import ContentPreviewReadOnlyModal from "./components/ContentPreviewReadOnlyModal";

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
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false);
  const [isAdvancedPreviewOpen, setIsAdvancedPreviewOpen] = useState(false);
  const [isReadOnlyPreviewOpen, setIsReadOnlyPreviewOpen] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState("");
  const [editingContent, setEditingContent] = useState<any>(null);
  const [previewingContentId, setPreviewingContentId] = useState<string | null>(
    null
  );
  const [previewMode, setPreviewMode] = useState<
    "modal" | "drawer" | "advanced" | "readonly"
  >("advanced");

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
    queryFn: async () => {
      // Only fetch if we have a level or skill selected
      if (selectedLevel || selectedSkill) {
        const result = await getContentsPaginated({
          levelId: selectedLevel || undefined,
          skillId: selectedSkill || undefined,
          search: searchTerm || undefined,
          page: currentPage,
          limit: itemsPerPage,
        });

        // Handle the response structure
        if ("error" in result) {
          throw new Error(result.error);
        }

        return result.data;
      }
      return null;
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
  const paginatedData = paginatedContents;
  const contents = Array.isArray(paginatedData?.contents)
    ? paginatedData.contents
    : [];
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

  const handlePreviewContent = (contentId: string) => {
    setPreviewingContentId(contentId);
    switch (previewMode) {
      case "modal":
        setIsPreviewModalOpen(true);
        break;
      case "drawer":
        setIsPreviewDrawerOpen(true);
        break;
      case "advanced":
        setIsAdvancedPreviewOpen(true);
        break;
      case "readonly":
        setIsReadOnlyPreviewOpen(true);
        break;
    }
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
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-primary">
                  Gestión de Contenidos
                </h1>
                <p className="text-foreground/70">
                  Administra el contenido educativo del sistema
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ButtonGroup size="sm" variant="flat">
                  <Button
                    color={previewMode === "modal" ? "primary" : "default"}
                    onPress={() => setPreviewMode("modal")}
                    startContent={<Square className="h-4 w-4" />}
                  >
                    Modal
                  </Button>
                  <Button
                    color={previewMode === "drawer" ? "primary" : "default"}
                    onPress={() => setPreviewMode("drawer")}
                    startContent={<PanelLeft className="h-4 w-4" />}
                  >
                    Drawer
                  </Button>
                  <Button
                    color={previewMode === "advanced" ? "primary" : "default"}
                    onPress={() => setPreviewMode("advanced")}
                    startContent={<Settings className="h-4 w-4" />}
                  >
                    Avanzado
                  </Button>
                  <Button
                    color={previewMode === "readonly" ? "primary" : "default"}
                    onPress={() => setPreviewMode("readonly")}
                    startContent={<Eye className="h-4 w-4" />}
                  >
                    Vista Maestro
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <Card className="mb-6">
            <CardBody className="p-6">
              <ContentFilters
                filteredLanguages={filteredLanguages}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                languagesLoading={languagesLoading}
                levels={levels}
                selectedLevel={selectedLevel}
                setSelectedLevel={setSelectedLevel}
                levelsLoading={levelsLoading}
                skills={skills}
                selectedSkill={selectedSkill}
                setSelectedSkill={setSelectedSkill}
                skillsLoading={skillsLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onCreateContent={() => setIsCreateModalOpen(true)}
              />
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
                <EmptyState
                  searchTerm={searchTerm}
                  onCreate={() => setIsCreateModalOpen(true)}
                  isCreateDisabled={!selectedLevel}
                />
              ) : (
                <div className="overflow-x-auto">
                  <SimpleContentTable
                    contents={filteredContents}
                    onValidate={handleValidateContent}
                    onInvalidate={handleInvalidateContent}
                    onEdit={(content) => {
                      setEditingContent(content);
                      setIsEditModalOpen(true);
                    }}
                    onManageTeachers={(id) => {
                      setSelectedContentId(id);
                      setIsTeachersModalOpen(true);
                    }}
                    onDelete={() => {}}
                    onPreview={handlePreviewContent}
                  />
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
                <PaginationInfo
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  totalPages={totalPages}
                />
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

      <ContentPreviewModal
        contentId={previewingContentId}
        isOpen={isPreviewModalOpen}
        onOpenChange={setIsPreviewModalOpen}
      />

      <ContentPreviewDrawer
        contentId={previewingContentId}
        isOpen={isPreviewDrawerOpen}
        onOpenChange={setIsPreviewDrawerOpen}
      />

      <ContentPreviewAdvancedModal
        contentId={previewingContentId}
        isOpen={isAdvancedPreviewOpen}
        onOpenChange={setIsAdvancedPreviewOpen}
      />

      <ContentPreviewReadOnlyModal
        contentId={previewingContentId}
        isOpen={isReadOnlyPreviewOpen}
        onOpenChange={setIsReadOnlyPreviewOpen}
      />
    </>
  );
}
