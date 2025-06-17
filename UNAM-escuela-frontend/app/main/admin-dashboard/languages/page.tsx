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
  Trash2,
  GraduationCap,
  Search,
  ArrowLeft,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";
import Link from "next/link";
import {
  getActiveLenguages,
  createLenguage,
} from "@/app/actions/lenguage-actions";
import { getLevelsByLenguage } from "@/app/actions/level-actions";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import GlobalTextArea from "@/components/global/globalTextArea";
import { addToast } from "@heroui/react";

export default function LanguagesManagementPage() {
  return (
    <RouteGuard requiredPage="/main/admin">
      <LanguagesManagementContent />
    </RouteGuard>
  );
}

function LanguagesManagementContent() {
  const { canManageContent } = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Queries
  const { data: languages, isLoading: languagesLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: getActiveLenguages,
  });

  const filteredLanguages = languages?.data?.filter(
    (language: any) =>
      language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      language.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  Gestión de Lenguajes
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
                  placeholder="Buscar lenguajes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startContent={<Search className="h-4 w-4" />}
                  className="max-w-md"
                />

                <Button
                  color="primary"
                  startContent={<Plus className="h-4 w-4" />}
                  onPress={() => setIsCreateModalOpen(true)}
                >
                  Crear Lenguaje
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Tabla de Lenguajes */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  Lista de Lenguajes
                  {filteredLanguages && (
                    <span className="text-sm font-normal text-foreground/60 ml-2">
                      ({filteredLanguages.length} lenguajes)
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
                    No hay lenguajes
                  </h3>
                  <p className="text-default-400 mb-4">
                    {searchTerm
                      ? "No se encontraron lenguajes con ese término de búsqueda"
                      : "Aún no hay lenguajes creados en el sistema"}
                  </p>
                  <Button
                    color="primary"
                    startContent={<Plus className="h-4 w-4" />}
                    onPress={() => setIsCreateModalOpen(true)}
                  >
                    Crear Primer Lenguaje
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table aria-label="Tabla de lenguajes">
                    <TableHeader>
                      <TableColumn>LENGUAJE</TableColumn>
                      <TableColumn>DESCRIPCIÓN</TableColumn>
                      <TableColumn>NIVELES</TableColumn>
                      <TableColumn>ESTADO</TableColumn>
                      <TableColumn>ACCIONES</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="No hay lenguajes disponibles">
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
                                  title="Editar lenguaje"
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
                                No hay lenguajes disponibles
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

      {/* Modal de crear lenguaje */}
      <CreateLanguageModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </>
  );
}

// Componente para mostrar los niveles de un lenguaje
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

// Modal para crear lenguaje
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
      const result = await createLenguage(formData);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["languages"] });
      addToast({
        title: "Lenguaje creado",
        description: "El lenguaje se ha creado exitosamente",
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
        description: error.message || "No se pudo crear el lenguaje",
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
      title="Crear Nuevo Lenguaje"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <GlobalInput
          label="Nombre del Lenguaje"
          placeholder="Ej: Inglés, Francés, Alemán..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          isRequired
        />

        <GlobalTextArea
          label="Descripción"
          placeholder="Descripción detallada del lenguaje..."
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
            text="Crear Lenguaje"
            color="primary"
            type="submit"
            isLoading={createLanguageMutation.isPending}
          />
        </div>
      </form>
    </GlobalModal>
  );
}
