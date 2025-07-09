import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  Chip,
  Button,
} from "@heroui/react";
import {
  BookOpen,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import ContentTableRow from "./ContentTableRow";

interface ContentTableProps {
  contents: any[];
  onValidate: (id: string) => void;
  onInvalidate: (id: string) => void;
  onEdit: (content: any) => void;
  onManageTeachers: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview?: (id: string) => void;
}

const ContentTable: React.FC<ContentTableProps> = ({
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

  // Add debug logging
  console.log("ContentTable - safeContents:", safeContents);

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

  console.log("ContentTable - validatedContents:", validatedContents);

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
    <Table aria-label="Tabla de contenidos">
      <TableHeader>
        <TableColumn>NOMBRE</TableColumn>
        <TableColumn>DESCRIPCIÓN</TableColumn>
        <TableColumn>SKILL</TableColumn>
        <TableColumn>VALIDACIÓN</TableColumn>
        <TableColumn>PROFESORES</TableColumn>
        <TableColumn>ACCIONES</TableColumn>
      </TableHeader>
      <TableBody>
        {validatedContents.map((content: any) => (
          <ContentTableRow
            key={content.id}
            content={content}
            onValidate={onValidate}
            onInvalidate={onInvalidate}
            onEdit={onEdit}
            onManageTeachers={onManageTeachers}
            onDelete={onDelete}
            onPreview={onPreview}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default ContentTable;
