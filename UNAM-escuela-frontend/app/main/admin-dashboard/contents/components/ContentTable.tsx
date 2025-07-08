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
}

const ContentTable: React.FC<ContentTableProps> = ({
  contents,
  onValidate,
  onInvalidate,
  onEdit,
  onManageTeachers,
  onDelete,
}) => (
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
      {contents.map((content: any) => (
        <ContentTableRow
          key={content.id}
          content={content}
          onValidate={onValidate}
          onInvalidate={onInvalidate}
          onEdit={onEdit}
          onManageTeachers={onManageTeachers}
          onDelete={onDelete}
        />
      ))}
    </TableBody>
  </Table>
);

export default ContentTable;
