import React from "react";
import { Chip } from "@heroui/react";

interface LevelDifficultyChipProps {
  difficulty: string;
  getDifficultyColor: (difficulty: string) => string;
  getDifficultyLabel: (difficulty: string) => string;
}

const LevelDifficultyChip: React.FC<LevelDifficultyChipProps> = ({
  difficulty,
  getDifficultyColor,
  getDifficultyLabel,
}) => (
  <Chip
    color={
      getDifficultyColor(difficulty) as
        | "default"
        | "primary"
        | "secondary"
        | "success"
        | "warning"
        | "danger"
    }
    size="sm"
  >
    {getDifficultyLabel(difficulty)}
  </Chip>
);

export default LevelDifficultyChip;
