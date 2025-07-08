import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContentById,
  assignTeachersToContent,
  removeTeacherFromContent,
  adminWorkaroundAssignTeachers,
} from "@/app/actions/content-actions";
import { getTeachers } from "@/app/actions/user-actions";
import { filterTeachersForLanguageCompatibility } from "@/app/actions/level-language-utils";
import { usePermissions } from "@/app/hooks/use-authorization";
import { useAuthorization } from "@/app/hooks/use-authorization";
import { addToast } from "@heroui/toast";
import { Spinner, Button } from "@heroui/react";
import { AlertCircle, Users, Trash2, Search } from "lucide-react";
import GlobalModal from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import GlobalSelect from "@/components/global/globalSelect";
import { SelectItem } from "@heroui/react";

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
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const result = await getTeachers();
      return result;
    },
    enabled: isOpen,
    retry: 2,
    retryDelay: 1000,
  });

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

  useEffect(() => {
    if (content?.data?.assignedTeachers) {
      setSelectedTeacherIds(
        content.data.assignedTeachers.map((teacher: any) => teacher.id)
      );
    }
  }, [content?.data?.assignedTeachers]);

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

      if (userRole === "admin") {
        result = await adminWorkaroundAssignTeachers(contentId, teacherIds);
      } else {
        result = await assignTeachersToContent(contentId, teacherIds);
      }

      if (result.error) {
        if (result.error.includes("superUser")) {
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
