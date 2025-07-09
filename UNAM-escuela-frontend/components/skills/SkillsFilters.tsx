import React from "react";
import {
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";
import { Search, Plus, Filter } from "lucide-react";

interface SkillsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: boolean | undefined;
  onStatusFilterChange: (value: boolean | undefined) => void;
  onCreateSkill: () => void;
}

export const SkillsFilters: React.FC<SkillsFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onCreateSkill,
}) => {
  const statusOptions = [
    { key: "all", label: "Todos los estados" },
    { key: "active", label: "Solo activas" },
    { key: "inactive", label: "Solo inactivas" },
  ];

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      onStatusFilterChange(undefined);
    } else if (value === "active") {
      onStatusFilterChange(true);
    } else if (value === "inactive") {
      onStatusFilterChange(false);
    }
  };

  const getCurrentStatusValue = () => {
    if (statusFilter === undefined) return "all";
    return statusFilter ? "active" : "inactive";
  };

  return (
    <Card className="mb-6">
      <CardBody>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-1">
            <Input
              placeholder="Buscar skills..."
              value={searchTerm}
              onValueChange={onSearchChange}
              startContent={<Search className="h-4 w-4 text-default-400" />}
              className="sm:max-w-xs"
              isClearable
            />
            <Select
              placeholder="Filtrar por estado"
              selectedKeys={[getCurrentStatusValue()]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                handleStatusChange(value);
              }}
              startContent={<Filter className="h-4 w-4 text-default-400" />}
              className="sm:max-w-xs"
            >
              {statusOptions.map((option) => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>
          <Button
            color="primary"
            startContent={<Plus className="h-4 w-4" />}
            onPress={onCreateSkill}
          >
            Crear Skill
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
