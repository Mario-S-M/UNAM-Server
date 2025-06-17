"use client";

import React, { useState, useEffect } from "react";
import {
  getContentsByLevel,
  createContent,
  assignTeachersToContent,
  getContentById,
} from "@/app/actions/content-actions";
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
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Users,
  Search,
  ArrowLeft,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getActiveLenguages } from "@/app/actions/lenguage-actions";
import { getLevelsByLenguage } from "@/app/actions/level-actions";
import { getTeachers } from "@/app/actions/user-actions";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import GlobalTextArea from "@/components/global/globalTextArea";
import GlobalSelect from "@/components/global/globalSelect";
import { addToast } from "@heroui/react";

export default function ContentsManagementPage() {
  return (
    <RouteGuard requiredPage="/main/admin">
      <ContentsManagementContent />
    </RouteGuard>
  );
}

function ContentsManagementContent() {
  const { canManageContent } = usePermissions();
  const searchParams = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState(
    searchParams.get("language") || ""
  );
  const [selectedLevel, setSelectedLevel] = useState(
    searchParams.get("level") || ""
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTeachersModalOpen, setIsTeachersModalOpen] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState("");

  // Queries
  const { data: languages, isLoading: languagesLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: getActiveLenguages,
  });

  const { data: levels, isLoading: levelsLoading } = useQuery({
    queryKey: ["levels", selectedLanguage],
    queryFn: () => getLevelsByLenguage(selectedLanguage),
    enabled: !!selectedLanguage,
  });

  const { data: contents, isLoading: contentsLoading } = useQuery({
    queryKey: ["contents", selectedLevel],
    queryFn: () => getContentsByLevel(selectedLevel),
    enabled: !!selectedLevel,
  });

  const filteredContents = contents?.data?.filter(
    (content: any) =>
      content.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(searchTerm.toLowerCase())
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  label="Seleccionar Lenguaje"
                  placeholder="Elige un lenguaje"
                  selectedKeys={
                    selectedLanguage ? new Set([selectedLanguage]) : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setSelectedLanguage(selected || "");
                    setSelectedLevel("");
                  }}
                  isLoading={languagesLoading}
                >
                  {(languages?.data || []).map((lang: any) => (
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
                >
                  {(levels?.data || []).map((level: any) => (
                    <SelectItem key={level.id}>
                      {level.name} - {level.difficulty}
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
                  {selectedLevel && filteredContents && (
                    <span className="text-sm font-normal text-foreground/60 ml-2">
                      ({filteredContents.length} contenidos)
                    </span>
                  )}
                </h2>
              </div>
            </CardHeader>
            <CardBody>
              {!selectedLevel ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-default-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-default-500 mb-2">
                    Selecciona un Nivel
                  </h3>
                  <p className="text-default-400">
                    Primero selecciona un lenguaje y un nivel para ver los
                    contenidos
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
                      : "Este nivel aún no tiene contenidos creados"}
                  </p>
                  <Button
                    color="primary"
                    startContent={<Plus className="h-4 w-4" />}
                    onPress={() => setIsCreateModalOpen(true)}
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
                      <TableColumn>ESTADO</TableColumn>
                      <TableColumn>PROFESORES</TableColumn>
                      <TableColumn>ACCIONES</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {filteredContents.map((content: any) => (
                        <TableRow key={content.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{content.name}</p>
                              <p className="text-xs text-foreground/50">
                                ID: {content.id}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-foreground/70 max-w-xs truncate">
                              {content.description}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="sm"
                              color={
                                content.status === "published"
                                  ? "success"
                                  : content.status === "draft"
                                  ? "warning"
                                  : "default"
                              }
                            >
                              {content.status === "published"
                                ? "Publicado"
                                : content.status === "draft"
                                ? "Borrador"
                                : "Archivado"}
                            </Chip>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-foreground/50" />
                              <span className="text-sm">
                                {content.teachers?.length || 0}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => {
                                  setSelectedContentId(content.id);
                                  setIsTeachersModalOpen(true);
                                }}
                              >
                                <Users className="h-4 w-4 text-foreground" />
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
                      ))}
                    </TableBody>
                  </Table>
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
  const [status, setStatus] = useState("draft");
  const queryClient = useQueryClient();

  const createContentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createContent(formData);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      addToast({
        title: "Contenido creado",
        description: "El contenido se ha creado exitosamente",
        color: "success",
        timeout: 3000,
      });
      onOpenChange(false);
      setName("");
      setDescription("");
      setStatus("draft");
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "No se pudo crear el contenido",
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
    formData.append("levelId", levelId);
    formData.append("status", status);

    await createContentMutation.mutateAsync(formData);
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Crear Nuevo Contenido"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <GlobalInput
          label="Nombre del Contenido"
          placeholder="Ej: Introducción a Gramática Básica"
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
          minRows={4}
        />

        <GlobalSelect
          label="Estado"
          placeholder="Selecciona el estado del contenido"
          selectedKeys={new Set([status])}
          onSelectionChange={(keys: any) => {
            const selectedArray = Array.from(keys);
            setStatus(selectedArray[0] as string);
          }}
        >
          <SelectItem key="draft">Borrador</SelectItem>
          <SelectItem key="published">Publicado</SelectItem>
          <SelectItem key="archived">Archivado</SelectItem>
        </GlobalSelect>

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
  const queryClient = useQueryClient();
  const [assigningTeacher, setAssigningTeacher] = useState<string | null>(null);

  // Obtener datos del contenido
  const { data: contentData, isLoading: contentLoading } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => getContentById(contentId),
    enabled: isOpen && !!contentId,
  });

  const {
    data: teachers,
    isLoading: teachersLoading,
    error,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => getTeachers(),
    enabled: isOpen,
  });

  const assignTeacherMutation = useMutation({
    mutationFn: async (teacherId: string) => {
      // Asignamos un solo profesor
      const result = await assignTeachersToContent(contentId, [teacherId]);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      addToast({
        title: "Profesor asignado",
        description:
          "El profesor ha sido asignado exitosamente al contenido y ahora puede verlo y editarlo",
        color: "success",
        timeout: 3000,
      });
      // Actualizamos tanto la lista de contenidos como el contenido específico
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      queryClient.invalidateQueries({ queryKey: ["content", contentId] });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "No se pudo asignar el profesor",
        color: "danger",
        timeout: 3000,
      });
    },
    onSettled: () => {
      setAssigningTeacher(null);
    },
  });

  const handleAssignTeacher = (teacherId: string) => {
    setAssigningTeacher(teacherId);

    // Verificamos si el profesor ya está asignado
    const isAlreadyAssigned = contentData?.data?.assignedTeachers?.some(
      (t: any) => t.id === teacherId
    );

    // Si ya está asignado, podríamos mostrar un diálogo de confirmación o simplemente reasignar
    if (isAlreadyAssigned) {
      // En este caso, simplemente reasignamos (lo que es equivalente a mantener la asignación)
      addToast({
        title: "Profesor ya asignado",
        description: "Este profesor ya tiene acceso al contenido",
        color: "warning",
        timeout: 3000,
      });
    }

    // En cualquier caso, asignamos el profesor (si ya está asignado, no cambiará nada)
    assignTeacherMutation.mutate(teacherId);
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Gestionar Profesores"
    >
      <div className="space-y-4">
        <p className="text-foreground/70">
          Asigna o desasigna profesores a este contenido
        </p>

        {contentLoading ? (
          <div className="flex justify-center py-4">
            <Spinner size="sm" />
            <p className="ml-2">Cargando información del contenido...</p>
          </div>
        ) : contentData?.error ? (
          <div className="text-center py-4 text-danger-500">
            <p>Error: {contentData.error}</p>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-1">{contentData?.data?.name}</h4>
            <p className="text-sm text-gray-600">
              {contentData?.data?.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {contentData?.data?.assignedTeachers?.length ? (
                <>
                  <p className="text-xs text-gray-500 w-full mb-1">
                    Profesores actualmente asignados:
                  </p>
                  {contentData.data.assignedTeachers.map((teacher: any) => (
                    <Chip
                      key={teacher.id}
                      size="sm"
                      variant="flat"
                      color="primary"
                      className="mr-1"
                    >
                      {teacher.fullName}
                    </Chip>
                  ))}
                </>
              ) : (
                <p className="text-xs text-gray-500">
                  No hay profesores asignados actualmente
                </p>
              )}
            </div>
          </div>
        )}

        {teachersLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-danger">
            <p>Error al cargar los profesores</p>
          </div>
        ) : !teachers?.data || teachers.data.length === 0 ? (
          <div className="text-center py-8 text-foreground/50">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No hay profesores disponibles</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {teachers.data
              .filter((teacher: any) => teacher.roles?.includes("docente"))
              .map((teacher: any) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-content1 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                      <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">{teacher.fullName}</p>
                      <p className="text-sm text-foreground/60">
                        {teacher.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="bordered"
                    color="primary"
                    onPress={() => handleAssignTeacher(teacher.id)}
                    isLoading={assigningTeacher === teacher.id}
                  >
                    {contentData?.data?.assignedTeachers?.some(
                      (t: any) => t.id === teacher.id
                    )
                      ? "Reasignar"
                      : "Asignar"}
                  </Button>
                </div>
              ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <GlobalButton
            text="Cerrar"
            variant="light"
            onPress={() => onOpenChange(false)}
          />
        </div>
      </div>
    </GlobalModal>
  );
}
