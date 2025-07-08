import React from "react";
import { Button } from "@heroui/react";
import { BookOpen, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface LevelActionButtonsProps {
  levelId: string;
  onEdit: () => void;
  onDelete: () => void;
}

const LevelActionButtons: React.FC<LevelActionButtonsProps> = ({
  levelId,
  onEdit,
  onDelete,
}) => (
  <div className="flex items-center gap-1">
    <Link href={`/main/admin-dashboard/contents?level=${levelId}`}>
      <Button isIconOnly size="sm" variant="light">
        <BookOpen className="h-4 w-4 text-foreground" />
      </Button>
    </Link>
    <Button isIconOnly size="sm" variant="light" onPress={onEdit}>
      <Edit className="h-4 w-4 text-foreground" />
    </Button>
    <Button
      isIconOnly
      size="sm"
      variant="light"
      color="danger"
      onPress={onDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

export default LevelActionButtons;
