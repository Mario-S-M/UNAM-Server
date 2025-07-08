import React from "react";
import SkillsTableHeader from "./SkillsTableHeader";
import SkillsEmptyState from "./SkillsEmptyState";
import SkillRow from "./SkillRow";

interface SkillsTableProps {
  skills: any[];
  searchTerm: string;
  onEdit: (skill: any) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onCreateSkill?: () => void;
}

const SkillsTable: React.FC<SkillsTableProps> = ({
  skills,
  searchTerm,
  onEdit,
  onDelete,
  onToggleActive,
  onCreateSkill,
}) => (
  <div className="overflow-x-auto">
    {!skills || skills.length === 0 ? (
      <SkillsEmptyState searchTerm={searchTerm} onCreateSkill={onCreateSkill} />
    ) : (
      <table className="w-full">
        <SkillsTableHeader />
        <tbody>
          {skills.map((skill) => (
            <SkillRow
              key={skill.id}
              skill={skill}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
            />
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default SkillsTable;
