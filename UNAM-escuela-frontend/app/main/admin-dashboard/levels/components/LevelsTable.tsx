import React from "react";
import LevelsTableHeader from "./LevelsTableHeader";
import LevelsEmptyState from "./LevelsEmptyState";
import LevelRow from "./LevelRow";

interface LevelsTableProps {
  levels: any[];
  searchTerm: string;
  onEdit: (level: any) => void;
  onDelete: (id: string) => void;
  getDifficultyColor: (difficulty: string) => string;
  getDifficultyLabel: (difficulty: string) => string;
  onCreateLevel?: () => void;
}

const LevelsTable: React.FC<LevelsTableProps> = ({
  levels,
  searchTerm,
  onEdit,
  onDelete,
  getDifficultyColor,
  getDifficultyLabel,
  onCreateLevel,
}) => (
  <div className="overflow-x-auto">
    {!levels || levels.length === 0 ? (
      <LevelsEmptyState
        searchTerm={searchTerm}
        onCreate={onCreateLevel || (() => {})}
      />
    ) : (
      <table className="w-full">
        <LevelsTableHeader />
        <tbody>
          {levels.map((level) => (
            <LevelRow
              key={level.id}
              level={level}
              onEdit={onEdit}
              onDelete={onDelete}
              getDifficultyColor={getDifficultyColor}
              getDifficultyLabel={getDifficultyLabel}
            />
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default LevelsTable;
