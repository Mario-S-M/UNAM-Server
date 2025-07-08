import React from "react";
import { Users } from "lucide-react";

interface TeacherCountProps {
  count: number;
}

const TeacherCount: React.FC<TeacherCountProps> = ({ count }) => (
  <div className="flex items-center gap-1">
    <Users className="h-4 w-4 text-foreground/50" />
    <span className="text-sm">{count}</span>
  </div>
);

export default TeacherCount;
