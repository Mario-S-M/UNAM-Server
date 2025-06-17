"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import { addToast } from "@heroui/react";
import { createLevel } from "@/app/actions/level-actions";

interface CreateLevelModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  languageId: string;
}

export function CreateLevelModal({
  isOpen,
  onOpenChange,
  languageId,
}: CreateLevelModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const createLevelMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createLevel(formData);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["levels"] });
      addToast({
        title: "Nivel creado",
        description: "El nivel se ha creado exitosamente",
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
        description: error.message || "No se pudo crear el nivel",
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
    formData.append("lenguageId", languageId);

    await createLevelMutation.mutateAsync(formData);
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Crear Nuevo Nivel"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <GlobalInput
          label="Nombre del Nivel"
          placeholder="Ej: Nivel Básico"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <GlobalInput
          label="Descripción"
          placeholder="Describe el contenido y objetivos del nivel"
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
            isLoading={createLevelMutation.isPending}
            text="Crear Nivel"
          />
        </div>
      </form>
    </GlobalModal>
  );
}
