import React, { useState } from "react";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalInput from "@/components/global/globalInput";
import GlobalTextArea from "@/components/global/globalTextArea";
import { Button, Input } from "@heroui/react";
import { Plus } from "lucide-react";
import GlobalButton from "@/components/global/globalButton";
import { CreateSkillInput } from "@/app/interfaces/skill-interfaces";

interface CreateSkillModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateSkillInput) => void;
  isLoading: boolean;
}

const CreateSkillModal: React.FC<CreateSkillModalProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CreateSkillInput>({
    name: "",
    description: "",
    color: "#3B82F6",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({ name: "", description: "", color: "#3B82F6" });
    onOpenChange(false);
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Nueva Skill"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <GlobalInput
          label="Nombre"
          placeholder="Ingresa el nombre de la skill"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <GlobalTextArea
          label="Descripción"
          placeholder="Describe la skill"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="w-12 h-10 rounded border border-default-300"
            />
            <Input
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              placeholder="#3B82F6"
              className="font-mono"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="light" onPress={handleClose}>
            Cancelar
          </Button>
          <GlobalButton
            type="submit"
            color="primary"
            isLoading={isLoading}
            startContent={<Plus className="h-4 w-4" />}
          >
            Crear Skill
          </GlobalButton>
        </div>
      </form>
    </GlobalModal>
  );
};

export default CreateSkillModal;
