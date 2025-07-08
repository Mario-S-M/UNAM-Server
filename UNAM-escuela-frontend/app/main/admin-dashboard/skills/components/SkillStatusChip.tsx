import React from "react";
import { Chip } from "@heroui/react";

interface SkillStatusChipProps {
  isActive: boolean;
}

const SkillStatusChip: React.FC<SkillStatusChipProps> = ({ isActive }) => (
  <Chip size="sm" color={isActive ? "success" : "danger"} variant="dot">
    {isActive ? "Activa" : "Inactiva"}
  </Chip>
);

export default SkillStatusChip;
