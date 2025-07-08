"use client";

import React, { useState, useEffect } from "react";
import { Button, Chip, Select, SelectItem, Divider } from "@heroui/react";
import { User, Globe, Languages, UserCheck, Plus, X } from "lucide-react";
import { usePermissions } from "@/app/hooks/use-authorization";
import { useActiveLenguages } from "@/app/hooks/use-lenguages";
import { assignMultipleLanguagesToUser } from "@/app/actions/user-actions";
import { addToast } from "@heroui/react";
import { GlobalModal } from "@/components/global/globalModal";
import { useAuthorization } from "@/app/hooks/use-authorization";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AssignMultipleLanguagesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}

export function AssignMultipleLanguagesModal({
  isOpen,
  onOpenChange,
  user,
}: AssignMultipleLanguagesModalProps) {
  const { userRole } = usePermissions();
  const { data: languages, isLoading: languagesLoading } =
    useActiveLenguages(false);
  const { user: currentUser } = useAuthorization();
  const queryClient = useQueryClient();

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const isSuperUser = currentUser?.roles?.includes("superUser");

  // Mutation para asignar múltiples idiomas
  const assignLanguagesMutation = useMutation({
    mutationFn: ({
      userId,
      languageIds,
    }: {
      userId: string;
      languageIds: string[];
    }) => assignMultipleLanguagesToUser(userId, languageIds),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["usersPaginated"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });

      if (response.data) {
        const user = response.data as any;
        const languageNames =
          user.assignedLanguages?.map((lang: any) => lang.name).join(", ") ||
          "ninguno";
        addToast({
          title: "Idiomas asignados",
          description: `Idiomas asignados: ${languageNames}`,
          color: "success",
          timeout: 3000,
        });
      }
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "No se pudieron asignar los idiomas",
        color: "danger",
        timeout: 5000,
      });
    },
  });

  // Reset selections when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedLanguages([]);
    } else if (user?.assignedLanguages) {
      // Pre-seleccionar idiomas ya asignados
      setSelectedLanguages(user.assignedLanguages.map((lang: any) => lang.id));
    }
  }, [isOpen, user]);

  const handleAssignLanguages = async () => {
    if (!user?.id) return;

    try {
      await assignLanguagesMutation.mutateAsync({
        userId: user.id,
        languageIds: selectedLanguages,
      });

      onOpenChange(false);
      setSelectedLanguages([]);
    } catch (error) {
      console.error("Error assigning languages:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAssignLanguages();
  };

  if (!isSuperUser) {
    return null;
  }

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Asignar Múltiples Idiomas"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del usuario */}
        <div className="bg-content2 p-4 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">
            Usuario a modificar:
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user?.fullName}</p>
              <p className="text-sm text-foreground/70">{user?.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-default-600">Rol:</span>
              <Chip
                color="primary"
                size="sm"
                startContent={<UserCheck className="h-4 w-4" />}
              >
                {user?.roles?.find((role: string) => role !== "mortal") ||
                  "Usuario"}
              </Chip>
            </div>
          </div>
        </div>

        {/* Selección de idiomas múltiples */}
        <div className="space-y-3">
          <div className="bg-info-50 border border-info-200 text-info-800 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Languages className="h-4 w-4" />
              <span className="font-medium">
                Asignación Múltiple de Idiomas
              </span>
            </div>
            <p className="text-sm">
              Los profesores pueden tener múltiples idiomas asignados. Esto les
              permite gestionar contenido en diferentes idiomas según sea
              necesario.
            </p>
          </div>

          <Select
            label="Idiomas a Asignar"
            placeholder="Selecciona los idiomas"
            selectionMode="multiple"
            selectedKeys={new Set(selectedLanguages)}
            onSelectionChange={(keys) => {
              setSelectedLanguages(Array.from(keys) as string[]);
            }}
            startContent={<Globe className="h-4 w-4" />}
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
            {(languages ?? []).map((language: any) => (
              <SelectItem key={language.id} textValue={language.name}>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span>{language.name}</span>
                </div>
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Información de idiomas seleccionados */}
        {selectedLanguages.length > 0 && (
          <div className="bg-content2 p-4 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">
              Idiomas seleccionados ({selectedLanguages.length}):
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedLanguages.map((languageId) => {
                const language = languages?.find(
                  (l: any) => l.id === languageId
                );
                return (
                  <Chip
                    key={languageId}
                    color="primary"
                    size="sm"
                    startContent={<Globe className="h-4 w-4" />}
                    onClose={() => {
                      setSelectedLanguages((prev) =>
                        prev.filter((id) => id !== languageId)
                      );
                    }}
                  >
                    {language?.name || languageId}
                  </Chip>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="light" onPress={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleAssignLanguages}
            isLoading={assignLanguagesMutation.isPending}
          >
            Asignar Idiomas
          </Button>
        </div>
      </form>
    </GlobalModal>
  );
}
