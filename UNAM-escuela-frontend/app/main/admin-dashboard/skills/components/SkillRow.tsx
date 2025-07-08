import React from "react";
import SkillStatusChip from "./SkillStatusChip";
import SkillActionButtons from "./SkillActionButtons";

interface SkillRowProps {
  skill: any;
  onEdit: (skill: any) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

const SkillRow: React.FC<SkillRowProps> = ({
  skill,
  onEdit,
  onDelete,
  onToggleActive,
}) => (
  <tr>
    <td className="py-3 px-4">{skill.name}</td>
    <td className="py-3 px-4">{skill.description}</td>
    <td className="py-3 px-4">
      <div
        className="w-6 h-6 rounded-full"
        style={{ backgroundColor: skill.color }}
      />
    </td>
    <td className="py-3 px-4">
      <SkillStatusChip isActive={skill.isActive} />
    </td>
    <td className="py-3 px-4">
      <SkillActionButtons
        isActive={skill.isActive}
        onEdit={() => onEdit(skill)}
        onDelete={() => onDelete(skill.id)}
        onToggleActive={() => onToggleActive(skill.id)}
      />
    </td>
  </tr>
);

export default SkillRow;
