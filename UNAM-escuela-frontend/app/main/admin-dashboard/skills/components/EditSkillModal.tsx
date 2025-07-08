import React, { useState, useEffect } from "react";
import GlobalModal from "@/components/global/globalModal";
import GlobalInput from "@/components/global/globalInput";
import GlobalTextArea from "@/components/global/globalTextArea";
import { Button, Input } from "@heroui/react";
import { Edit } from "lucide-react";
import GlobalButton from "@/components/global/globalButton";
import { UpdateSkillInput, Skill } from "@/app/interfaces/skill-interfaces";

interface EditSkillModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  skill: Skill | null;
  onSubmit: (data: UpdateSkillInput) => void;
  isLoading: boolean;
}

const EditSkillModal: React.FC<EditSkillModalProps> = ({
  isOpen,
  onOpenChange,
  skill,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<UpdateSkillInput>({
    id: "",
    name: "",
    description: "",
    color: "#3B82F6",
  });

  useEffect(() => {
    if (skill) {
      setFormData({
        id: skill.id,
        name: skill.name,
        description: skill.description,
        color: skill.color,
      });
    }
  }, [skill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Editar Skill"
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
          <Button variant="light" onPress={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <GlobalButton
            type="submit"
            color="primary"
            isLoading={isLoading}
            startContent={<Edit className="h-4 w-4" />}
          >
            Actualizar Skill
          </GlobalButton>
        </div>
      </form>
    </GlobalModal>
  );
};

export default EditSkillModal;
