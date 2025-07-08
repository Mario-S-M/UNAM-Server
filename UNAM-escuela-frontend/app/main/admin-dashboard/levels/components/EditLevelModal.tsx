import React, { useState, useEffect } from "react";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import GlobalTextArea from "@/components/global/globalTextArea";
import { addToast } from "@heroui/react";

interface EditLevelModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  level: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const EditLevelModal: React.FC<EditLevelModalProps> = ({
  isOpen,
  onOpenChange,
  level,
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    if (level && isOpen) {
      setName(level.name || "");
      setDescription(level.description || "");
      setDifficulty(level.difficulty || "");
    }
  }, [level, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !difficulty) {
      addToast({
        title: "Error de validación",
        description: "Todos los campos son obligatorios",
        color: "danger",
      });
      return;
    }
    onSubmit({ ...level, name, description, difficulty });
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setDifficulty("");
    onOpenChange(false);
  };

  if (!level) return null;

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={handleClose}
      title="Editar Nivel"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <GlobalInput
          label="Nombre del Nivel"
          placeholder="Ej: Básico, Intermedio, Avanzado"
          value={name}
          onChange={(e) => setName(e.target.value)}
          isRequired
        />
        <GlobalTextArea
          label="Descripción"
          placeholder="Descripción del nivel"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          isRequired
        />
        <GlobalInput
          label="Dificultad"
          placeholder="Ej: fácil, medio, difícil"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          isRequired
        />
        <div className="flex justify-end gap-2 pt-4">
          <GlobalButton text="Cancelar" variant="light" onPress={handleClose} />
          <GlobalButton
            text="Actualizar Nivel"
            color="primary"
            type="submit"
            isLoading={isLoading}
          />
        </div>
      </form>
    </GlobalModal>
  );
};

export default EditLevelModal;
