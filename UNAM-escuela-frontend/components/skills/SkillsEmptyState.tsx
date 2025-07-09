import React from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { Search, Plus } from "lucide-react";

interface SkillsEmptyStateProps {
  searchTerm?: string;
  statusFilter?: boolean;
  onCreateSkill?: () => void;
}

const SkillsEmptyState: React.FC<SkillsEmptyStateProps> = ({
  searchTerm,
  statusFilter,
  onCreateSkill,
}) => {
  const hasFilters = searchTerm || statusFilter !== undefined;

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-default-100 rounded-full p-4 mb-4">
        {hasFilters ? (
          <Search className="h-8 w-8 text-default-400" />
        ) : (
          <Plus className="h-8 w-8 text-default-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {hasFilters ? "No se encontraron skills" : "No hay skills creadas"}
      </h3>
      <p className="text-foreground/60 mb-6 max-w-sm">
        {hasFilters
          ? "Intenta ajustar los filtros de búsqueda para encontrar las skills que buscas."
          : "Comienza creando tu primera skill para organizar el contenido."}
      </p>
      {!hasFilters && onCreateSkill && (
        <Button
          color="primary"
          startContent={<Plus className="h-4 w-4" />}
          onPress={onCreateSkill}
        >
          Crear primera skill
        </Button>
      )}
    </div>
  );
};

export default SkillsEmptyState;
