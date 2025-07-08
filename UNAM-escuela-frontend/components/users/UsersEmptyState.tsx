import React from "react";
import { Users, Plus } from "lucide-react";
import { Button } from "@heroui/react";

interface UsersEmptyStateProps {
  searchTerm?: string;
  roleFilter?: string;
  onCreateUser?: () => void;
}

const UsersEmptyState: React.FC<UsersEmptyStateProps> = ({
  searchTerm,
  roleFilter,
  onCreateUser,
}) => (
  <div className="text-center py-12">
    <Users className="h-16 w-16 text-default-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-default-500 mb-2">
      No hay usuarios
    </h3>
    <p className="text-default-400 mb-4">
      {searchTerm || roleFilter
        ? "No se encontraron usuarios con los filtros aplicados"
        : "Aún no hay usuarios en el sistema"}
    </p>
    {onCreateUser && (
      <Button
        color="primary"
        startContent={<Plus className="h-4 w-4" />}
        onPress={onCreateUser}
      >
        Crear Primer Usuario
      </Button>
    )}
  </div>
);

export default UsersEmptyState;
