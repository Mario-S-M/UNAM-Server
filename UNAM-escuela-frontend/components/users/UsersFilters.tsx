import React from "react";
import { UsersFiltersProps } from "@/app/interfaces/users-interfaces";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { Search, Plus } from "lucide-react";

export const UsersFilters: React.FC<UsersFiltersProps> = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  onCreateUser,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Input
      label="Buscar"
      placeholder="Buscar usuarios..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      startContent={<Search className="h-4 w-4" />}
    />
    <Select
      label="Filtrar por Rol"
      placeholder="Todos los roles"
      selectedKeys={roleFilter ? new Set([roleFilter]) : new Set()}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0] as string;
        onRoleFilterChange(selected || "");
      }}
      color="default"
      classNames={{
        trigger: "border-default-200 hover:border-default-300 !bg-default-50",
        value: "text-default-700",
        label: "text-default-600",
        selectorIcon: "text-default-600 !text-default-600",
        listbox: "bg-content1",
        popoverContent: "bg-content1",
      }}
    >
      <SelectItem key="superUser">Super Usuario</SelectItem>
      <SelectItem key="admin">Administrador</SelectItem>
      <SelectItem key="docente">Docente</SelectItem>
      <SelectItem key="alumno">Alumno</SelectItem>
      <SelectItem key="mortal">Usuario Normal</SelectItem>
    </Select>
    <Button
      color="primary"
      startContent={<Plus className="h-4 w-4" />}
      className="h-14"
      onPress={onCreateUser}
    >
      Crear Usuario
    </Button>
  </div>
);
