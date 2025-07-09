import React from "react";
import { Card, CardBody } from "@heroui/react";
import { BookOpen } from "lucide-react";
import ContentValidationChip from "./ContentValidationChip";
import SkillBadge from "./SkillBadge";
import TeacherCount from "./TeacherCount";
import ActionButtons from "./ActionButtons";

interface SimpleContentTableProps {
  contents: any[];
  onValidate: (id: string) => void;
  onInvalidate: (id: string) => void;
  onEdit: (content: any) => void;
  onManageTeachers: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview?: (id: string) => void;
}

const SimpleContentTable: React.FC<SimpleContentTableProps> = ({
  contents,
  onValidate,
  onInvalidate,
  onEdit,
  onManageTeachers,
  onDelete,
  onPreview,
}) => {
  // Ensure contents is always an array
  const safeContents = Array.isArray(contents) ? contents : [];

  // If no contents, show empty state
  if (safeContents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-default-500">No hay contenidos disponibles</p>
      </div>
    );
  }

  // Validate that each content has required properties
  const validatedContents = safeContents.filter((content) => {
    return content && content.id && content.name && content.description;
  });

  if (validatedContents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-default-500">
          No hay contenidos válidos disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-default-600 bg-default-100 rounded-lg">
        <div className="col-span-3">NOMBRE</div>
        <div className="col-span-2">DESCRIPCIÓN</div>
        <div className="col-span-2">SKILL</div>
        <div className="col-span-2">VALIDACIÓN</div>
        <div className="col-span-1">PROFESORES</div>
        <div className="col-span-2">ACCIONES</div>
      </div>

      {/* Content Rows */}
      {validatedContents.map((content: any) => {
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
          <Card key={content.id} className="shadow-sm">
            <CardBody className="p-4">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Name */}
                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {content.name || "Sin nombre"}
                      </p>
                      <p className="text-xs text-foreground/50">
                        ID: {content.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <p className="text-sm text-foreground/70 max-w-xs">
                    {content.description && content.description.length > 80
                      ? `${content.description.substring(0, 80)}...`
                      : content.description || "Sin descripción"}
                  </p>
                </div>

                {/* Skill */}
                <div className="col-span-2">
                  {skill ? (
                    <SkillBadge color={skill.color} name={skill.name} />
                  ) : (
                    <span className="text-sm text-foreground/50">
                      Sin skill
                    </span>
                  )}
                </div>

                {/* Validation Status */}
                <div className="col-span-2">
                  <ContentValidationChip validationStatus={validationStatus} />
                </div>

                {/* Teacher Count */}
                <div className="col-span-1">
                  <TeacherCount count={content.assignedTeachers?.length || 0} />
                </div>

                {/* Actions */}
                <div className="col-span-2">
                  <ActionButtons
                    validationStatus={validationStatus}
                    onValidate={() => onValidate(content.id)}
                    onInvalidate={() => onInvalidate(content.id)}
                    onEdit={() => onEdit(content)}
                    onManageTeachers={() => onManageTeachers(content.id)}
                    onDelete={() => onDelete(content.id)}
                    onPreview={
                      onPreview ? () => onPreview(content.id) : undefined
                    }
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};

export default SimpleContentTable;
