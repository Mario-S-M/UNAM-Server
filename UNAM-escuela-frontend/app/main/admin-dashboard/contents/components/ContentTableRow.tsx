import React from "react";
import { TableRow, TableCell } from "@heroui/react";
import { BookOpen } from "lucide-react";
import ContentValidationChip from "./ContentValidationChip";
import SkillBadge from "./SkillBadge";
import TeacherCount from "./TeacherCount";
import ActionButtons from "./ActionButtons";

interface ContentTableRowProps {
  content: any;
  onValidate: (id: string) => void;
  onInvalidate: (id: string) => void;
  onEdit: (content: any) => void;
  onManageTeachers: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview?: (id: string) => void;
}

const ContentTableRow: React.FC<ContentTableRowProps> = ({
  content,
  onValidate,
  onInvalidate,
  onEdit,
  onManageTeachers,
  onDelete,
  onPreview,
}) => {
  // Add defensive checks
  if (!content || !content.id) {
    
    return null;
  }

  // Ensure validationStatus exists with fallback
  const validationStatus =
    (content.data as any)?.validationStatus ||
    content.validationStatus ||
    "pending";

  // Ensure skill data exists with fallback
  const skill = (content.data as any)?.skill || content.skill;

  return (
    <TableRow key={content.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium">{content.name || "Sin nombre"}</p>
            <p className="text-xs text-foreground/50">ID: {content.id}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-sm text-foreground/70 max-w-xs">
          {content.description && content.description.length > 80
            ? `${content.description.substring(0, 80)}...`
            : content.description || "Sin descripción"}
        </p>
      </TableCell>
      <TableCell>
        {skill ? (
          <SkillBadge color={skill.color} name={skill.name} />
        ) : (
          <span className="text-sm text-foreground/50">Sin skill</span>
        )}
      </TableCell>
      <TableCell>
        <ContentValidationChip validationStatus={validationStatus} />
      </TableCell>
      <TableCell>
        <TeacherCount count={content.assignedTeachers?.length || 0} />
      </TableCell>
      <TableCell>
        <ActionButtons
          validationStatus={validationStatus}
          onValidate={() => onValidate(content.id)}
          onInvalidate={() => onInvalidate(content.id)}
          onEdit={() => onEdit(content)}
          onManageTeachers={() => onManageTeachers(content.id)}
          onDelete={() => onDelete(content.id)}
          onPreview={onPreview ? () => onPreview(content.id) : undefined}
        />
      </TableCell>
    </TableRow>
  );
};

export default ContentTableRow;
