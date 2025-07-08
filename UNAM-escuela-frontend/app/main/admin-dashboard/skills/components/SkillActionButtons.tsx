import React from "react";
import { Button } from "@heroui/react";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface SkillActionButtonsProps {
  isActive: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

const SkillActionButtons: React.FC<SkillActionButtonsProps> = ({
  isActive,
  onEdit,
  onDelete,
  onToggleActive,
}) => (
  <div className="flex items-center gap-2">
    <Button
      isIconOnly
      size="sm"
      variant="light"
      color="primary"
      title="Editar skill"
      onPress={onEdit}
    >
      <Edit className="h-4 w-4" />
    </Button>
    <Button
      isIconOnly
      size="sm"
      variant="light"
      color="danger"
      title="Eliminar skill"
      onPress={onDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
    <Button
      isIconOnly
      size="sm"
      variant="light"
      color={isActive ? "warning" : "success"}
      title={isActive ? "Desactivar skill" : "Activar skill"}
      onPress={onToggleActive}
    >
      {isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  </div>
);

export default SkillActionButtons;
