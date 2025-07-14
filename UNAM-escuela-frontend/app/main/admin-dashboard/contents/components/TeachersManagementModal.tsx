import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContentById,
  assignTeachersToContent,
  removeTeacherFromContent,
} from "@/app/actions/content-actions";
import { getTeachers } from "@/app/actions/user-actions";
// Eliminado: import { createTestTeachers } from "@/app/actions/create-test-teachers";
import { filterTeachersForLanguageCompatibility } from "@/app/actions/level-language-utils";
import { usePermissions } from "@/app/hooks/use-authorization";
import { useAuthorization } from "@/app/hooks/use-authorization";
import { addToast } from "@heroui/toast";
import { Spinner, Button } from "@heroui/react";
import { AlertCircle, Users, Trash2, Search, UserPlus } from "lucide-react";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import GlobalSelect from "@/components/global/globalSelect";
import { SelectItem } from "@heroui/react";
import { TeachersDebugModal } from "./TeachersDebugModal";

interface TeachersManagementModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
}

export default function TeachersManagementModal({
  isOpen,
  onOpenChange,
  contentId,
}: TeachersManagementModalProps) {
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTeachersForLanguage, setFilteredTeachersForLanguage] =
    useState<any[]>([]);
  const [isFilteringTeachers, setIsFilteringTeachers] = useState(false);
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { userRole } = usePermissions();
  const { userAssignedLanguage } = useAuthorization();

  const { data: content, isLoading: contentLoading } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => getContentById(contentId),
    enabled: !!contentId && isOpen,
  });

  const {
    data: teachers,
    isLoading: teachersLoading,
    error: teachersError,
    refetch: refetchTeachers,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => getTeachers(),
    enabled: isOpen,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 30000, // 30 segundos
  });

  useEffect(() => {
    const applyLanguageFiltering = async () => {
      if (!teachers?.data) {
        setFilteredTeachersForLanguage([]);
        return;
      }

      setIsFilteringTeachers(true);
      try {
        // Usar directamente los profesores activos con rol docente
        const directTeachers = teachers.data.filter(
          (teacher: any) =>
            teacher.roles?.includes("docente") && teacher.isActive
        );

        setFilteredTeachersForLanguage(directTeachers);
      } catch (error) {
        console.error("Error applying language filtering:", error);
        setFilteredTeachersForLanguage(teachers.data || []);
      } finally {
        setIsFilteringTeachers(false);
      }
    };

    applyLanguageFiltering();
  }, [
    teachers?.data,
    content?.levelId,
    userAssignedLanguage?.isAdminWithLanguage,
    userAssignedLanguage?.assignedLanguageId,
  ]);

  useEffect(() => {
    if (content?.assignedTeachers) {
      setSelectedTeacherIds(
        content.assignedTeachers.map((teacher: any) => teacher.id)
      );
    }
  }, [content?.assignedTeachers]);

  const searchFilteredTeachers = (() => {
    if (!searchQuery) {
      return filteredTeachersForLanguage;
    }

    const searchLower = searchQuery.toLowerCase();
    const filtered = filteredTeachersForLanguage.filter((teacher: any) => {
      // Manejar el caso donde fullName puede ser undefined
      const fullName = teacher.fullName || teacher.email || "";
      const email = teacher.email || "";

      const matchesName = fullName.toLowerCase().includes(searchLower);
      const matchesEmail = email.toLowerCase().includes(searchLower);

      return matchesName || matchesEmail;
    });

    return filtered;
  })();

  const assignTeachersMutation = useMutation({
    mutationFn: async (teacherIds: string[]) => {
      const result = await assignTeachersToContent(contentId, teacherIds);

      if (result.error) {
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

    addToast({
      title: "Procesando asignación",
      description: `Asignando ${selectedTeacherIds.length} profesores al contenido`,
      color: "primary",
      timeout: 3000,
    });

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
      title={`Gestionar Profesores - ${content?.name || "Contenido"}`}
    >
      {/* Info de diagnóstico simplificada */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-4 w-4" />
          <strong>Estado del sistema:</strong>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p>
              <strong>Rol de usuario:</strong> {userRole}
            </p>
            <p>
              <strong>Profesores cargados:</strong>{" "}
              {teachers?.data?.length || 0}
            </p>
          </div>
          <div>
            <p>
              <strong>Profesores disponibles:</strong>{" "}
              {filteredTeachersForLanguage?.length || 0}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {teachersLoading
                ? "Cargando..."
                : isFilteringTeachers
                ? "Filtrando..."
                : teachersError
                ? "Error"
                : "Completado"}
            </p>
          </div>
        </div>
        {teachersError && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-red-700 text-xs">
              <strong>Error:</strong>{" "}
              {teachersError instanceof Error
                ? teachersError.message
                : "Error desconocido"}
            </p>
          </div>
        )}
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
                <strong>Nombre:</strong> {content?.name}
              </p>
              <p>
                <strong>Descripción:</strong> {content?.description}
              </p>
            </div>
          </div>

          {/* Profesores actualmente asignados */}
          {content?.assignedTeachers && content.assignedTeachers.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Profesores Actualmente Asignados (
                {content.assignedTeachers.length})
              </h4>
              <div className="space-y-2">
                {content.assignedTeachers.map((teacher: any) => (
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
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 mx-auto text-red-400 mb-3" />
                  <p className="text-sm text-red-600 font-medium mb-2">
                    Error al cargar profesores
                  </p>
                  <p className="text-xs text-red-500 mb-3">
                    {teachersError instanceof Error
                      ? teachersError.message
                      : "Error desconocido"}
                  </p>
                  <p className="text-xs text-red-500 mb-3">
                    Tu rol actual: {userRole}. Puede ser un problema de
                    permisos.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      color="primary"
                      size="sm"
                      onPress={() => {
                        refetchTeachers();
                      }}
                    >
                      Reintentar
                    </Button>
                    <Button
                      color="secondary"
                      size="sm"
                      onPress={() => {
                        queryClient.invalidateQueries({
                          queryKey: ["teachers"],
                        });
                        refetchTeachers();
                      }}
                    >
                      Forzar recarga
                    </Button>
                  </div>
                </div>
              </div>
            ) : filteredTeachersForLanguage.length === 0 ? (
              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto text-yellow-400 mb-3" />
                  <p className="text-sm text-yellow-800 font-medium mb-2">
                    No hay profesores disponibles para asignar
                  </p>
                  <div className="text-xs text-yellow-700 space-y-1 mb-4">
                    <p>Posibles razones:</p>
                    <ul className="list-disc list-inside text-left max-w-md mx-auto">
                      <li>No hay usuarios con rol de docente en el sistema</li>
                      <li>
                        Los profesores existentes ya están asignados a otros
                        idiomas
                      </li>
                      <li>Restricciones de permisos por tu rol: {userRole}</li>
                      <li>Error en el sistema de filtrado por idioma</li>
                    </ul>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      color="primary"
                      size="sm"
                      onPress={() => {
                        refetchTeachers();
                      }}
                    >
                      Reintentar
                    </Button>
                    <Button
                      color="secondary"
                      size="sm"
                      onPress={() => {
                        setFilteredTeachersForLanguage([]);
                        queryClient.invalidateQueries({
                          queryKey: ["teachers"],
                        });
                        refetchTeachers();
                      }}
                    >
                      Limpiar filtros
                    </Button>
                    <Button
                      color="warning"
                      size="sm"
                      onPress={() => setIsDebugModalOpen(true)}
                    >
                      Debug Avanzado
                    </Button>
                  </div>
                </div>
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
                  {searchFilteredTeachers?.map((teacher: any) => {
                    const displayName =
                      teacher.fullName ||
                      teacher.email ||
                      `Usuario ${teacher.id}`;
                    return (
                      <SelectItem
                        key={teacher.id}
                        textValue={`${displayName} (${teacher.email})`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {displayName}
                            </span>
                            <span className="text-xs text-default-500">
                              {teacher.email}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  }) || []}
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

      {/* Modal de Debug */}
      <TeachersDebugModal
        isOpen={isDebugModalOpen}
        onClose={() => setIsDebugModalOpen(false)}
      />
    </GlobalModal>
  );
}
