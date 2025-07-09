import React from "react";
import { Edit, Trash2, Users, CheckCircle, XCircle, Eye } from "lucide-react";
import GlobalButton from "@/components/global/globalButton";

interface ActionButtonsProps {
  validationStatus: string;
  onValidate: () => void;
  onInvalidate: () => void;
  onEdit: () => void;
  onManageTeachers: () => void;
  onDelete: () => void;
  onPreview?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  validationStatus,
  onValidate,
  onInvalidate,
  onEdit,
  onManageTeachers,
  onDelete,
  onPreview,
}) => (
  <div className="flex items-center gap-2">
    {onPreview && (
      <GlobalButton
        isIconOnly
        size="sm"
        variant="light"
        color="default"
        onPress={onPreview}
      >
        <Eye className="h-4 w-4" />
      </GlobalButton>
    )}
    {validationStatus === "validado" ? (
      <GlobalButton
        isIconOnly
        size="sm"
        variant="light"
        color="warning"
        onPress={onInvalidate}
      >
        <XCircle className="h-4 w-4" />
      </GlobalButton>
    ) : (
      <GlobalButton
        isIconOnly
        size="sm"
        variant="light"
        color="success"
        onPress={onValidate}
      >
        <CheckCircle className="h-4 w-4" />
      </GlobalButton>
    )}
    <GlobalButton
      isIconOnly
      size="sm"
      variant="light"
      color="primary"
      onPress={onEdit}
    >
      <Edit className="h-4 w-4" />
    </GlobalButton>
    <GlobalButton
      isIconOnly
      size="sm"
      variant="light"
      color="secondary"
      onPress={onManageTeachers}
    >
      <Users className="h-4 w-4" />
    </GlobalButton>
    <GlobalButton
      isIconOnly
      size="sm"
      variant="light"
      color="danger"
      onPress={onDelete}
    >
      <Trash2 className="h-4 w-4" />
    </GlobalButton>
  </div>
);

export default ActionButtons;
