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
} from "@heroui/react";
import {
  Globe,
  Plus,
  Edit,
  GraduationCap,
  Search,
  ArrowLeft,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RouteGuard } from "@/components/auth/route-guard";
import {
  usePermissions,
  useAuthorization,
} from "@/app/hooks/use-authorization";
import Link from "next/link";
import { getLanguagesList } from "@/app/actions/lenguage-actions";
import { getLevelsByLenguage } from "@/app/actions/level-actions";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import GlobalTextArea from "@/components/global/globalTextArea";
import { addToast } from "@heroui/toast";
import { useActiveLenguages } from "@/app/hooks/use-lenguages";

export default function LanguagesManagementPage() {
  return (
    <RouteGuard requiredPage="/main/admin-dashboard/languages">
      <LanguagesManagementContent />
    </RouteGuard>
  );
}

function LanguagesManagementContent() {
  const { canManageContent } = usePermissions();
  const { hasAnyRole, userAssignedLanguage } = useAuthorization();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Queries
  const { data: languages, isLoading: languagesLoading } = useActiveLenguages();

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
    }

    // Aplicar filtro de búsqueda
    return availableLanguages.filter(
      (language: any) =>
        language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        language.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredLanguages = getFilteredLanguages();

  // Solo SuperUsers pueden crear idiomas, los admins solo pueden crear niveles
  const canCreateLanguages = hasAnyRole(["superUser"]);

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
                  Gestión de Idiomas
                </h1>
                <p className="text-foreground/70">
                  Administra los idiomas disponibles en el sistema
                </p>
              </div>
            </div>
          </div>

          {/* Filtros y acciones */}
          <Card className="mb-6">
            <CardBody className="p-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <Input
                  label="Buscar"
                  placeholder="Buscar idiomas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={<Search className="h-4 w-4" />}
                  className="max-w-md"
                />

                {canCreateLanguages && (
                  <Button
                    color="primary"
                    startContent={<Plus className="h-4 w-4" />}
                    onPress={() => setIsCreateModalOpen(true)}
                  >
                    Crear Idioma
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Tabla de Idiomas */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  Lista de Idiomas
                  {filteredLanguages && (
                    <span className="text-sm font-normal text-foreground/60 ml-2">
                      ({filteredLanguages.length} idiomas)
                    </span>
                  )}
                </h2>
              </div>
            </CardHeader>
            <CardBody>
              {languagesLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : !filteredLanguages || filteredLanguages.length === 0 ? (
                <div className="text-center py-12">
                  <Globe className="h-16 w-16 text-default-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-default-500 mb-2">
                    No hay idiomas
                  </h3>
                  <p className="text-default-400 mb-4">
                    {searchTerm
                      ? "No se encontraron idiomas con ese término de búsqueda"
                      : "Aún no hay idiomas creados en el sistema"}
                  </p>
                  {canCreateLanguages && (
                    <Button
                      color="primary"
                      startContent={<Plus className="h-4 w-4" />}
                      onPress={() => setIsCreateModalOpen(true)}
                    >
                      Crear Primer Idioma
                    </Button>
                  )}
                  {!canCreateLanguages && (
                    <p className="text-default-400 text-sm">
                      Solo los Super Administradores pueden crear idiomas
                    </p>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table aria-label="Tabla de idiomas">
                    <TableHeader>
                      <TableColumn>IDIOMA</TableColumn>
                      <TableColumn>DESCRIPCIÓN</TableColumn>
                      <TableColumn>NIVELES</TableColumn>
                      <TableColumn>ESTADO</TableColumn>
                      <TableColumn>ACCIONES</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No hay idiomas disponibles">
                      {filteredLanguages?.length > 0 ? (
                        filteredLanguages.map((language: any) => (
                          <TableRow key={language.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                  <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <p className="font-medium">{language.name}</p>
                                  <p className="text-xs text-foreground/50">
                                    ID: {language.id}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm text-foreground/70 max-w-xs">
                                {language.description}
                              </p>
                            </TableCell>
                            <TableCell>
                              <LanguageLevelsCell languageId={language.id} />
                            </TableCell>
                            <TableCell>
                              <Chip
                                size="sm"
                                color={
                                  language.isActive ? "success" : "default"
                                }
                              >
                                {language.isActive ? "Activo" : "Inactivo"}
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Link
                                  href={`/main/admin-dashboard/levels?language=${language.id}`}
                                >
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    title="Ver niveles"
                                  >
                                    <GraduationCap className="h-4 w-4 text-foreground" />
                                  </Button>
                                </Link>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  title="Editar idioma"
                                >
                                  <Edit className="h-4 w-4 text-foreground" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <div className="text-center py-4">
                              <p className="text-foreground/50">
                                No hay idiomas disponibles
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

      {/* Modal de crear idioma - Solo visible para SuperUsers */}
      {canCreateLanguages && (
        <CreateLanguageModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
        />
      )}
    </>
  );
}

// Componente para mostrar los niveles de un idioma
function LanguageLevelsCell({ languageId }: { languageId: string }) {
  const { data: levels, isLoading: levelsLoading } = useQuery({
    queryKey: ["levels", languageId],
    queryFn: () => getLevelsByLenguage(languageId),
  });

  return (
    <div className="flex items-center gap-2">
      {levelsLoading ? (
        <Spinner size="sm" />
      ) : (
        <>
          <GraduationCap className="h-4 w-4 text-foreground/50" />
          <span className="text-sm">{levels?.data?.length || 0}</span>
        </>
      )}
    </div>
  );
}

// Modal para crear idioma
interface CreateLanguageModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

function CreateLanguageModal({
  isOpen,
  onOpenChange,
}: CreateLanguageModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const createLanguageMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // TODO: Implementar createLenguage function
      throw new Error("Función de crear idioma no implementada");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["languages"] });
      addToast({
        title: "Idioma creado",
        description: "El idioma se ha creado exitosamente",
        color: "success",
        timeout: 3000,
      });
      onOpenChange(false);
      setName("");
      setDescription("");
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "No se pudo crear el idioma",
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

    await createLanguageMutation.mutateAsync(formData);
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Crear Nuevo Idioma"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <GlobalInput
          label="Nombre del Idioma"
          placeholder="Ej: Inglés, Francés, Alemán..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          isRequired
        />

        <GlobalTextArea
          label="Descripción"
          placeholder="Descripción detallada del idioma..."
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
            text="Crear Idioma"
            color="primary"
            type="submit"
            isLoading={createLanguageMutation.isPending}
          />
        </div>
      </form>
    </GlobalModal>
  );
}
