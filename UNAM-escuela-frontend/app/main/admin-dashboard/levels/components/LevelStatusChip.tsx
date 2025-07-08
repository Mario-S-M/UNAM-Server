import React from "react";
import { Chip } from "@heroui/react";

interface LevelStatusChipProps {
  isActive: boolean;
}

const LevelStatusChip: React.FC<LevelStatusChipProps> = ({ isActive }) => (
  <Chip size="sm" color={isActive ? "success" : "default"}>
    {isActive ? "Activo" : "Inactivo"}
  </Chip>
);

export default LevelStatusChip;
