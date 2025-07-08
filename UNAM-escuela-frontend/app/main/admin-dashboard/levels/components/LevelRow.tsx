import React from "react";
import { Button, Chip } from "@heroui/react";
import { Edit, Trash2 } from "lucide-react";
import LevelDifficultyChip from "./LevelDifficultyChip";
import LevelStatusChip from "./LevelStatusChip";
import LevelActionButtons from "./LevelActionButtons";

interface LevelRowProps {
  level: any;
  onEdit: (level: any) => void;
  onDelete: (id: string) => void;
  getDifficultyColor: (difficulty: string) => string;
  getDifficultyLabel: (difficulty: string) => string;
}

const LevelRow: React.FC<LevelRowProps> = ({
  level,
  onEdit,
  onDelete,
  getDifficultyColor,
  getDifficultyLabel,
}) => (
  <tr>
    <td className="px-4 py-2 font-medium">{level.name}</td>
    <td className="px-4 py-2">{level.description}</td>
    <td className="px-4 py-2">
      <LevelDifficultyChip
        difficulty={level.difficulty}
        getDifficultyColor={getDifficultyColor}
        getDifficultyLabel={getDifficultyLabel}
      />
    </td>
    <td className="px-4 py-2 text-center">{level.contentsCount ?? 0}</td>
    <td className="px-4 py-2">
      <LevelStatusChip isActive={level.isActive} />
    </td>
    <td className="px-4 py-2">
      <div className="flex gap-2">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={() => onEdit(level)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          color="danger"
          onPress={() => onDelete(level.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </td>
  </tr>
);

export default LevelRow;
