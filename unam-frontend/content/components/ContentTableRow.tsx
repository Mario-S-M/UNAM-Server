import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { Content } from '../../types';
import { ValidationStatusBadge } from './ValidationStatusBadge';

import { ContentColumnVisibility as ColumnVisibility } from '../../types';

interface ContentTableRowProps {
  content: Content;
  columnVisibility: ColumnVisibility;
  formatDate: (dateString: string) => string;
  onEdit: (content: Content) => void;
  onDelete: (id: string) => void;
  deleteLoading: boolean;
}

export function ContentTableRow({ content, columnVisibility, formatDate, onEdit, onDelete, deleteLoading }: ContentTableRowProps) {
  return (
    <TableRow key={content.id}>
      {columnVisibility.name && (
        <TableCell className="w-[200px] text-center">
          <div>
            <div className="font-medium truncate" title={content.name}>{content.name}</div>
            <div className="text-sm text-gray-500 max-w-xs truncate" title={content.description}>{content.description}</div>
          </div>
        </TableCell>
      )}
      {columnVisibility.level && (
        <TableCell className="w-[120px] text-center">
          {content.levelId ? (
            <Badge variant="outline">{content.levelId}</Badge>
          ) : (
            <span className="text-gray-400">Sin nivel</span>
          )}
        </TableCell>
      )}
      {columnVisibility.skill && (
        <TableCell className="w-[150px] text-center">
          {content.skill ? (
            <div className="flex items-center justify-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: content.skill.color || '#6B7280' }}
              />
              <span className="text-sm truncate" title={content.skill.name}>{content.skill.name}</span>
            </div>
          ) : (
            <span className="text-gray-400">Sin skill</span>
          )}
        </TableCell>
      )}
      {columnVisibility.status && (
        <TableCell className="w-[100px] text-center">
          <ValidationStatusBadge status={content.validationStatus} />
        </TableCell>
      )}
      {columnVisibility.teachers && (
        <TableCell className="w-[150px] text-center">
          <div className="flex flex-wrap gap-1 justify-center">
            {content.assignedTeachers && content.assignedTeachers.length > 0 ? (
              content.assignedTeachers.slice(0, 2).map((teacher) => (
                <Badge key={teacher.id} variant="secondary" className="text-xs">
                  {teacher.fullName}
                </Badge>
              ))
            ) : (
              <span className="text-gray-400 text-sm">Sin profesores</span>
            )}
            {content.assignedTeachers && content.assignedTeachers.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{content.assignedTeachers.length - 2}
              </Badge>
            )}
          </div>
        </TableCell>
      )}
      {columnVisibility.createdAt && (
        <TableCell className="w-[120px] text-center">
          <span className="text-sm text-gray-600">
            {content.createdAt ? formatDate(content.createdAt) : 'N/A'}
          </span>
        </TableCell>
      )}
      {columnVisibility.updatedAt && (
        <TableCell className="w-[120px] text-center">
          <span className="text-sm text-gray-600">
            {content.updatedAt ? formatDate(content.updatedAt) : 'N/A'}
          </span>
        </TableCell>
      )}
      {columnVisibility.actions && (
        <TableCell className="w-[120px] text-center">
          <div className="flex justify-center space-x-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(content)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará permanentemente el contenido "{content.name}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(content.id)}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}