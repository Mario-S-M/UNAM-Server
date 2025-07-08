import React from "react";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@heroui/react";

interface EmptyStateProps {
  searchTerm?: string;
  onCreate?: () => void;
  isCreateDisabled?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  searchTerm,
  onCreate,
  isCreateDisabled,
}) => (
  <div className="text-center py-12">
    <BookOpen className="h-16 w-16 text-default-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-default-500 mb-2">
      No hay contenidos
    </h3>
    <p className="text-default-400 mb-4">
      {searchTerm
        ? "No se encontraron contenidos con ese término de búsqueda"
        : "Este filtro aún no tiene contenidos creados"}
    </p>
    {onCreate && (
      <Button
        color="primary"
        startContent={<Plus className="h-4 w-4" />}
        onPress={onCreate}
        isDisabled={isCreateDisabled}
      >
        Crear Primer Contenido
      </Button>
    )}
  </div>
);

export default EmptyState;
