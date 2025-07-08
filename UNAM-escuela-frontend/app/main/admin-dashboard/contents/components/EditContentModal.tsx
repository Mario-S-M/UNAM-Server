import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateContent } from "@/app/actions/content-actions";
import { addToast } from "@heroui/toast";
import GlobalModal from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import GlobalTextArea from "@/components/global/globalTextArea";

interface EditContentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  content: any;
}

export default function EditContentModal({
  isOpen,
  onOpenChange,
  content,
}: EditContentModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (content && isOpen) {
      setName(content.name || "");
      setDescription(content.description || "");
    }
  }, [content, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
    }
  }, [isOpen]);

  const updateContentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await updateContent(content.id, formData);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentsPaginated"] });
      addToast({
        title: "¡Éxito!",
        description: "Contenido actualizado exitosamente",
        color: "success",
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "Error al actualizar el contenido",
        color: "danger",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      addToast({
        title: "Error de validación",
        description: "El nombre y la descripción son obligatorios",
        color: "danger",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    updateContentMutation.mutate(formData);
  };

  if (!content) return null;

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Editar Contenido"
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

        <div className="flex justify-end gap-2 pt-4">
          <GlobalButton
            text="Cancelar"
            variant="light"
            onPress={() => onOpenChange(false)}
          />
          <GlobalButton
            text="Actualizar Contenido"
            color="primary"
            type="submit"
            isLoading={updateContentMutation.isPending}
          />
        </div>
      </form>
    </GlobalModal>
  );
}
