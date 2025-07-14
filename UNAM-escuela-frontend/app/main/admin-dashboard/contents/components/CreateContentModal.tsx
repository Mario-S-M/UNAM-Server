import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getActiveSkills } from "@/app/actions/skill-actions";
import { getTeachers } from "@/app/actions/user-actions";
import { filterTeachersForLanguageCompatibility } from "@/app/actions/level-language-utils";
import { useAuthorization } from "@/app/hooks/use-authorization";
import { createContent } from "@/app/actions/content-actions";
import { addToast } from "@heroui/toast";
import { Spinner, Button } from "@heroui/react";
import Link from "next/link";
import { AlertCircle, Users } from "lucide-react";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import GlobalTextArea from "@/components/global/globalTextArea";
import GlobalSelect from "@/components/global/globalSelect";
import { SelectItem } from "@heroui/react";

interface CreateContentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  levelId: string;
}

export default function CreateContentModal({
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
  const { userAssignedLanguage } = useAuthorization();

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

    if (!selectedSkill) {
      addToast({
        title: "Error de validación",
        description: "Debes seleccionar una skill para el contenido",
        color: "danger",
      });
      return;
    }

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
