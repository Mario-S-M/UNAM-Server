"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import GlobalTextArea from "@/components/global/globalTextArea";
import { addToast, SelectItem } from "@heroui/react";
import { createContent } from "@/app/actions/content-actions";
import GlobalSelect from "@/components/global/globalSelect";

interface CreateContentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  levelId: string;
}

export function CreateContentModal({
  isOpen,
  onOpenChange,
  levelId,
}: CreateContentModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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
