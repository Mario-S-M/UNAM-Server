import React from "react";
import { Button } from "@heroui/react";
import { GraduationCap, Plus } from "lucide-react";

interface LevelsEmptyStateProps {
  searchTerm: string;
  onCreate: () => void;
}

const LevelsEmptyState: React.FC<LevelsEmptyStateProps> = ({
  searchTerm,
  onCreate,
}) => (
  <div className="text-center py-12">
    <GraduationCap className="h-16 w-16 text-default-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-default-500 mb-2">
      No hay niveles
    </h3>
    <p className="text-default-400 mb-4">
      {searchTerm
        ? "No se encontraron niveles con ese término de búsqueda"
        : "Este idioma aún no tiene niveles creados"}
    </p>
    <Button
      color="primary"
      startContent={<Plus className="h-4 w-4" />}
      onPress={onCreate}
    >
      Crear Primer Nivel
    </Button>
  </div>
);

export default LevelsEmptyState;
