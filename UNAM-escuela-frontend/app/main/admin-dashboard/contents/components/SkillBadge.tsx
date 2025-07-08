import React from "react";

interface SkillBadgeProps {
  color: string;
  name: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ color, name }) => (
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-sm">{name}</span>
  </div>
);

export default SkillBadge;
