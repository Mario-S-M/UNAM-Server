import React from "react";
import { Chip, Button } from "@heroui/react";
import { Edit2, ToggleLeft, ToggleRight } from "lucide-react";
import { Skill } from "@/app/interfaces/skill-interfaces";

interface SkillRowProps {
  skill: Skill;
  onEdit?: (skill: Skill) => void;
  onToggleActive?: (id: string) => void;
}

export const SkillRow: React.FC<SkillRowProps> = ({
  skill,
  onEdit,
  onToggleActive,
}) => (
  <tr className="border-b border-divider hover:bg-default-50 transition-colors">
    <td className="py-3 px-4">
      <div className="font-medium text-foreground">{skill.name}</div>
    </td>
    <td className="py-3 px-4">
      <div className="text-foreground/70 max-w-xs truncate">
        {skill.description || "Sin descripción"}
      </div>
    </td>
    <td className="py-3 px-4">
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full border border-divider"
          style={{ backgroundColor: skill.color }}
        />
        <span className="text-sm text-foreground/70">{skill.color}</span>
      </div>
    </td>
    <td className="py-3 px-4">
      <Chip
        size="sm"
        variant="flat"
        color={skill.isActive ? "success" : "default"}
      >
        {skill.isActive ? "Activa" : "Inactiva"}
      </Chip>
    </td>
    <td className="py-3 px-4">
      <div className="flex items-center gap-2">
        {onEdit && (
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onPress={() => onEdit(skill)}
            aria-label="Editar skill"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
        {onToggleActive && (
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onPress={() => onToggleActive(skill.id)}
            aria-label={skill.isActive ? "Desactivar skill" : "Activar skill"}
          >
            {skill.isActive ? (
              <ToggleRight className="h-4 w-4 text-success" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-default-400" />
            )}
          </Button>
        )}
      </div>
    </td>
  </tr>
);
