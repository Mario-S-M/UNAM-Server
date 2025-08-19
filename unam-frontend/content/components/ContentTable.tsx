import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Content } from '../../types';
import { ContentTableRow } from './ContentTableRow';

import { ContentColumnVisibility as ColumnVisibility } from '../../types';

interface ContentTableProps {
  contents: Content[];
  columnVisibility: ColumnVisibility;
  formatDate: (dateString: string) => string;
  onEdit: (content: Content) => void;
  onDelete: (id: string) => void;
  deleteLoading: boolean;
  contentsLoading: boolean;
}

export function ContentTable({ 
  contents, 
  columnVisibility, 
  formatDate, 
  onEdit, 
  onDelete, 
  deleteLoading, 
  contentsLoading 
}: ContentTableProps) {
  const visibleColumns = Object.entries(columnVisibility).filter(([_, visible]) => visible);
  const colSpan = visibleColumns.length;

  return (
    <div className="border rounded-lg overflow-hidden mx-auto" style={{width: '100%'}}>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {columnVisibility.name && (
              <TableHead className="w-[200px] text-center">Nombre</TableHead>
            )}
            {columnVisibility.level && (
              <TableHead className="w-[120px] text-center">Nivel</TableHead>
            )}
            {columnVisibility.skill && (
              <TableHead className="w-[150px] text-center">Skill</TableHead>
            )}
            {columnVisibility.status && (
              <TableHead className="w-[100px] text-center">Estado</TableHead>
            )}
            {columnVisibility.teachers && (
              <TableHead className="w-[150px] text-center">Profesores</TableHead>
            )}
            {columnVisibility.createdAt && (
              <TableHead className="w-[120px] text-center">Fecha de Creación</TableHead>
            )}
            {columnVisibility.updatedAt && (
              <TableHead className="w-[120px] text-center">Última Actualización</TableHead>
            )}
            {columnVisibility.actions && (
              <TableHead className="w-[120px] text-center">Acciones</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {contentsLoading ? (
            <TableRow>
              <TableCell colSpan={colSpan} className="text-center py-8 text-gray-500">
                Cargando contenido...
              </TableCell>
            </TableRow>
          ) : contents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colSpan} className="text-center py-8 text-gray-500">
                No se encontró contenido
              </TableCell>
            </TableRow>
          ) : (
            contents.map((content) => (
              <ContentTableRow
                key={content.id}
                content={content}
                columnVisibility={columnVisibility}
                formatDate={formatDate}
                onEdit={onEdit}
                onDelete={onDelete}
                deleteLoading={deleteLoading}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}