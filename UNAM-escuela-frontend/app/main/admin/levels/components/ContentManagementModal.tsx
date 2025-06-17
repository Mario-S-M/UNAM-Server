"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  useDisclosure,
  Chip,
  SelectItem,
  Avatar,
  Spinner,
  addToast,
} from "@heroui/react";
import { Plus, Edit, Trash2, Users, UserMinus, UserPlus } from "lucide-react";
import Link from "next/link";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import GlobalSelect from "@/components/global/globalSelect";
import { Level } from "@/app/interfaces";
import { Content as ContentActionContent } from "@/app/actions/content-actions";
import { User } from "@/app/actions/user-actions";
import {
  getContentsByLevel,
  createContent,
  deleteContent,
  assignTeachersToContent,
} from "@/app/actions/content-actions";
import { getTeachers } from "@/app/actions/user-actions";

interface ContentManagementModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  level: Level;
}

interface CreateContentFormProps {
  levelId: string;
  onSuccess: () => void;
}

interface AssignTeachersFormProps {
  content: ContentActionContent;
  onSuccess: () => void;
}

export function ContentManagementModal({
  isOpen,
  onOpenChange,
  level,
}: ContentManagementModalProps) {
  const createContentModal = useDisclosure();
  const assignTeachersModal = useDisclosure();
  const [selectedContent, setSelectedContent] =
    useState<ContentActionContent | null>(null);
  const queryClient = useQueryClient();

  // Obtener contenidos del nivel
  const { data: contents, isLoading: contentsLoading } = useQuery({
    queryKey: ["contents", level.id],
    queryFn: () => getContentsByLevel(level.id),
    enabled: isOpen,
  });

  const handleAssignTeachers = (content: ContentActionContent) => {
    setSelectedContent(content);
    assignTeachersModal.onOpen();
  };

  const handleDeleteContent = async (contentId: string) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este contenido?")
    ) {
      try {
        await deleteContent(contentId);
        queryClient.invalidateQueries({ queryKey: ["contents"] });
        addToast({
          title: "Contenido eliminado",
          description: "El contenido se ha eliminado exitosamente",
          color: "success",
          timeout: 3000,
        });
      } catch (error) {
        addToast({
          title: "Error",
          description: "No se pudo eliminar el contenido",
          color: "danger",
          timeout: 3000,
        });
      }
    }
  };

  return (
    <>
      <GlobalModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={`Gestión de Contenido - ${level.name}`}
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Contenidos del Nivel</h3>
            <GlobalButton
              onPress={createContentModal.onOpen}
              startContent={<Plus className="h-4 w-4" />}
              color="primary"
              size="sm"
              text="Crear Contenido"
            />
          </div>

          {contentsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : contents?.data?.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No hay contenidos creados para este nivel
            </div>
          ) : (
            <Table aria-label="Tabla de contenidos">
              <TableHeader>
                <TableColumn>TÍTULO</TableColumn>
                <TableColumn>DESCRIPCIÓN</TableColumn>
                <TableColumn>PROFESORES</TableColumn>
                <TableColumn>ESTADO</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No hay contenido creado para este nivel">
                {(contents?.data || []).map((content: ContentActionContent) => (
                  <TableRow key={content.id}>
                    <TableCell>
                      <div className="font-medium">{content.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground/70 max-w-xs truncate">
                        {content.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {content.assignedTeachers &&
                        content.assignedTeachers.length > 0 ? (
                          <div className="flex -space-x-2">
                            {content.assignedTeachers
                              .slice(0, 3)
                              .map((teacher: any, index: number) => (
                                <Avatar
                                  key={teacher.id}
                                  size="sm"
                                  name={teacher.fullName}
                                  className="border-2 border-white"
                                  title={teacher.fullName}
                                />
                              ))}
                            {content.assignedTeachers.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                +{content.assignedTeachers.length - 3}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Chip size="sm" variant="flat" color="warning">
                            Sin asignar
                          </Chip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={
                          content.status === "published"
                            ? "success"
                            : content.status === "draft"
                            ? "warning"
                            : "default"
                        }
                        size="sm"
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
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleAssignTeachers(content)}
                          title="Gestionar profesores"
                        >
                          <Users className="h-4 w-4 text-foreground" />
                        </Button>
                        <Link href={`/main/teacher/content/${content.id}/edit`}>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            title="Editar contenido"
                          >
                            <Edit className="h-4 w-4 text-foreground" />
                          </Button>
                        </Link>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() => handleDeleteContent(content.id)}
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
          )}
        </div>
      </GlobalModal>

      {/* Modal para crear contenido */}
      <CreateContentForm
        isOpen={createContentModal.isOpen}
        onOpenChange={createContentModal.onOpenChange}
        levelId={level.id}
        onSuccess={() => {
          createContentModal.onClose();
          queryClient.invalidateQueries({ queryKey: ["contents"] });
        }}
      />

      {/* Modal para asignar profesores */}
      {selectedContent && (
        <AssignTeachersForm
          isOpen={assignTeachersModal.isOpen}
          onOpenChange={assignTeachersModal.onOpenChange}
          content={selectedContent}
          onSuccess={() => {
            assignTeachersModal.onClose();
            queryClient.invalidateQueries({ queryKey: ["contents"] });
          }}
        />
      )}
    </>
  );
}

function CreateContentForm({
  isOpen,
  onOpenChange,
  levelId,
  onSuccess,
}: CreateContentFormProps & {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createContentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createContent(formData);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      addToast({
        title: "Contenido creado",
        description:
          "El contenido se ha creado exitosamente con su carpeta markdown",
        color: "success",
        timeout: 3000,
      });
      onSuccess();
      setName("");
      setDescription("");
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
    formData.append("status", "draft");

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
          placeholder="Ej: Introducción a los verbos"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <GlobalInput
          label="Descripción"
          placeholder="Describe el contenido y objetivos"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="flex justify-end gap-3 pt-4">
          <GlobalButton
            type="button"
            variant="bordered"
            onPress={() => onOpenChange(false)}
            text="Cancelar"
          />
          <GlobalButton
            type="submit"
            color="primary"
            isLoading={createContentMutation.isPending}
            text="Crear Contenido"
          />
        </div>
      </form>
    </GlobalModal>
  );
}

function AssignTeachersForm({
  isOpen,
  onOpenChange,
  content,
  onSuccess,
}: AssignTeachersFormProps & {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Obtener lista de profesores
  const { data: teachers, isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => getTeachers(),
    enabled: isOpen,
  });

  // Inicializar con profesores ya asignados
  useEffect(() => {
    if (content.assignedTeachers) {
      setSelectedTeacherIds(content.assignedTeachers.map((t: any) => t.id));
    }
  }, [content.assignedTeachers]);

  // Filtrar profesores basados en la búsqueda
  const filteredTeachers = teachers?.data?.filter((teacher: User) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      teacher.fullName?.toLowerCase().includes(searchLower) ||
      teacher.email?.toLowerCase().includes(searchLower)
    );
  });

  const assignTeachersMutation = useMutation({
    mutationFn: async ({
      contentId,
      teacherIds,
    }: {
      contentId: string;
      teacherIds: string[];
    }) => {
      const result = await assignTeachersToContent(contentId, teacherIds);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      addToast({
        title: "Profesores asignados",
        description: "Los profesores se han asignado exitosamente al contenido",
        color: "success",
        timeout: 3000,
      });
      onSuccess();
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: "No se pudieron asignar los profesores al contenido",
        color: "danger",
        timeout: 3000,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await assignTeachersMutation.mutateAsync({
      contentId: content.id,
      teacherIds: selectedTeacherIds,
    });
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`Asignar Profesores - ${content.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">
            Buscar y seleccionar profesores:
          </label>
          <GlobalInput
            label="Buscar por nombre o correo"
            placeholder="Buscar profesores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={
              <div className="pointer-events-none flex items-center">
                <svg
                  className="h-4 w-4 text-default-400"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            }
            className="mb-4"
            isClearable
          />
          {teachersLoading ? (
            <div className="flex justify-center py-4">
              <Spinner size="sm" />
              <span className="ml-2 text-sm text-gray-600">
                Cargando profesores...
              </span>
            </div>
          ) : (
            <>
              <div className="text-xs text-gray-500 mb-2">
                {content.assignedTeachers?.length
                  ? `${content.assignedTeachers.length} profesor(es) asignado(s) actualmente`
                  : "No hay profesores asignados a este contenido"}
              </div>
              <GlobalSelect
                label="Profesores"
                placeholder="Selecciona uno o más profesores"
                selectionMode="multiple"
                selectedKeys={selectedTeacherIds}
                onSelectionChange={(keys: any) =>
                  setSelectedTeacherIds(Array.from(keys) as string[])
                }
              >
                {filteredTeachers?.map((teacher: User) => (
                  <SelectItem
                    key={teacher.id}
                    textValue={`${teacher.fullName} (${teacher.email})`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-sm">{teacher.fullName}</span>
                        <span className="text-xs text-default-500">
                          {teacher.email}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                )) || []}
              </GlobalSelect>
              {filteredTeachers?.length === 0 && (
                <div className="text-center py-2 text-gray-500 text-sm">
                  No se encontraron profesores con ese criterio de búsqueda
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-t pt-4 mt-6">
          <div className="text-sm text-gray-600 mb-4">
            Los profesores asignados podrán ver y editar este contenido desde su
            panel de profesor. El contenido se almacena en archivos markdown y
            se guarda automáticamente cada 5 segundos cuando se está editando.
          </div>
          <div className="flex justify-end gap-3">
            <GlobalButton
              type="button"
              variant="bordered"
              onPress={() => onOpenChange(false)}
              text="Cancelar"
            />
            <GlobalButton
              type="submit"
              color="primary"
              isLoading={assignTeachersMutation.isPending}
              text="Asignar Profesores"
            />
          </div>
        </div>
      </form>
    </GlobalModal>
  );
}
