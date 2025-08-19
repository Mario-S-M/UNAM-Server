'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  visible: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  deleteLoading?: boolean;
  className?: string;
  rowClassName?: (item: T) => string;
  getItemId: (item: T) => string;
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  onEdit,
  onDelete,
  deleteLoading = false,
  className,
  rowClassName,
  getItemId
}: DataTableProps<T>) {
  const visibleColumns = columns.filter(col => col.visible);

  if (loading) {
    return (
      <div className={cn('rounded-md border', className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead key={String(column.key)} className={column.className}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {visibleColumns.map((column) => (
                  <TableCell key={String(column.key)} className={column.className}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn('rounded-md border p-8 text-center', className)}>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('rounded-md border', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map((column) => (
              <TableHead key={String(column.key)} className={column.className}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const itemId = getItemId(item);
            return (
              <TableRow 
                key={itemId} 
                className={rowClassName ? rowClassName(item) : undefined}
              >
                {visibleColumns.map((column) => (
                  <TableCell key={String(column.key)} className={column.className}>
                    {column.key === 'actions' ? (
                      <div className="flex items-center gap-2">
                        {onEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(item)}
                            disabled={deleteLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(item)}
                            disabled={deleteLoading}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ) : column.render ? (
                      column.render(item)
                    ) : (
                      String(item[column.key as keyof T] || '')
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;