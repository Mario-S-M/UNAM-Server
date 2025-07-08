import React from "react";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@heroui/react";

interface SkillsEmptyStateProps {
  searchTerm?: string;
  onCreateSkill?: () => void;
}

const SkillsEmptyState: React.FC<SkillsEmptyStateProps> = ({
  searchTerm,
  onCreateSkill,
}) => (
  <div className="text-center py-12">
    <BookOpen className="h-16 w-16 text-default-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-default-500 mb-2">No hay skills</h3>
    <p className="text-default-400 mb-4">
      {searchTerm
        ? "No se encontraron skills con ese término de búsqueda"
        : "Aún no hay skills en el sistema"}
    </p>
    {onCreateSkill && (
      <Button
        color="primary"
        startContent={<Plus className="h-4 w-4" />}
        onPress={onCreateSkill}
      >
        Crear Primer Skill
      </Button>
    )}
  </div>
);

export default SkillsEmptyState;
