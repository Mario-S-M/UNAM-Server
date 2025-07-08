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
import LevelsTable from "./components/LevelsTable";
import CreateLevelModal from "./components/CreateLevelModal";
import EditLevelModal from "./components/EditLevelModal";
import LevelFilters from "./components/LevelFilters";
import LevelsEmptyState from "./components/LevelsEmptyState";

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
              <LevelFilters
                filteredLanguages={filteredLanguages}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                languagesLoading={languagesLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onCreateLevel={() => setIsCreateModalOpen(true)}
              />
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
                <LevelsEmptyState
                  searchTerm={searchTerm}
                  onCreate={() => setIsCreateModalOpen(true)}
                />
              ) : (
                <LevelsTable
                  levels={filteredLevels}
                  searchTerm={searchTerm}
                  onEdit={handleEditLevel}
                  onDelete={() => {}}
                  getDifficultyColor={getDifficultyColor}
                  getDifficultyLabel={getDifficultyLabel}
                  onCreateLevel={() => setIsCreateModalOpen(true)}
                />
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
        onSubmit={() => {}}
        isLoading={false}
      />

      {/* Modal de editar nivel */}
      <EditLevelModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        level={editingLevel}
        onSubmit={() => {}}
        isLoading={false}
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
