import React from "react";
import { Button } from "@heroui/react";
import { Edit, Trash2, Users, CheckCircle, XCircle } from "lucide-react";

interface ActionButtonsProps {
  validationStatus: string;
  onValidate: () => void;
  onInvalidate: () => void;
  onEdit: () => void;
  onManageTeachers: () => void;
  onDelete: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  validationStatus,
  onValidate,
  onInvalidate,
  onEdit,
  onManageTeachers,
  onDelete,
}) => (
  <div className="flex items-center gap-2">
    {validationStatus === "validado" ? (
      <Button
        isIconOnly
        size="sm"
        variant="light"
        color="warning"
        title="Marcar como no validado"
        onPress={onInvalidate}
      >
        <XCircle className="h-4 w-4" />
      </Button>
    ) : (
      <Button
        isIconOnly
        size="sm"
        variant="light"
        color="success"
        title="Validar contenido"
        onPress={onValidate}
      >
        <CheckCircle className="h-4 w-4" />
      </Button>
    )}
    <Button
      isIconOnly
      size="sm"
      variant="light"
      color="primary"
      title="Editar contenido"
      onPress={onEdit}
    >
      <Edit className="h-4 w-4" />
    </Button>
    <Button
      isIconOnly
      size="sm"
      variant="light"
      color="secondary"
      title="Gestionar profesores"
      onPress={onManageTeachers}
    >
      <Users className="h-4 w-4" />
    </Button>
    <Button
      isIconOnly
      size="sm"
      variant="light"
      color="danger"
      title="Eliminar contenido"
      onPress={onDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

export default ActionButtons;
