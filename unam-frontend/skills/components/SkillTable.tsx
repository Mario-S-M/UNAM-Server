'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Skill, ColumnVisibility } from '../types';

interface SkillTableProps {
  skills: Skill[];
  loading: boolean;
  columnVisibility: ColumnVisibility;
  onEdit: (skill: Skill) => void;
  onDelete: (skillId: string) => void;
  formatDate?: (dateString: string) => string;
}

export const SkillTable: React.FC<SkillTableProps> = ({
  skills,
  loading,
  columnVisibility,
  onEdit,
  onDelete,
  formatDate
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columnVisibility.name && <TableHead className="text-center">Nombre</TableHead>}
          {columnVisibility.description && <TableHead className="text-center">Descripción</TableHead>}
          {columnVisibility.difficulty && <TableHead className="text-center">Dificultad</TableHead>}
          {columnVisibility.level && <TableHead className="text-center">Nivel</TableHead>}
          {columnVisibility.color && <TableHead className="text-center">Color</TableHead>}
          {columnVisibility.imageUrl && <TableHead className="text-center">Imagen</TableHead>}
          {columnVisibility.icon && <TableHead className="text-center">Icono</TableHead>}
          {columnVisibility.objectives && <TableHead className="text-center">Objetivos</TableHead>}
          {columnVisibility.prerequisites && <TableHead className="text-center">Prerrequisitos</TableHead>}

          {columnVisibility.isActive && <TableHead className="text-center">Estado</TableHead>}
          {columnVisibility.createdAt && <TableHead className="text-center">Creado</TableHead>}
          {columnVisibility.updatedAt && <TableHead className="text-center">Actualizado</TableHead>}
          {columnVisibility.actions && <TableHead className="text-center">Acciones</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {skills.map((skill) => (
          <TableRow key={skill.id}>
            {columnVisibility.name && (
              <TableCell className="font-medium text-center">
                <div className="flex items-center gap-2 justify-center">
                  {skill.color && (
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: skill.color }}
                    />
                  )}
                  {skill.name}
                </div>
              </TableCell>
            )}
            {columnVisibility.description && (
              <TableCell className="max-w-xs text-center">
                <div className="truncate" title={skill.description}>
                  {skill.description}
                </div>
              </TableCell>
            )}
            {columnVisibility.difficulty && (
              <TableCell className="text-center">
                <Badge variant={skill.difficulty === 'Avanzado' ? 'destructive' : skill.difficulty === 'Intermedio' ? 'default' : 'secondary'}>
                  {skill.difficulty}
                </Badge>
              </TableCell>
            )}
            {columnVisibility.level && (
              <TableCell className="text-center">
                {skill.level ? (
                  <div>
                    <div className="font-medium">{skill.level.name}</div>
                    <div className="text-sm text-gray-500">{skill.lenguage?.name}</div>
                  </div>
                ) : (
                  <span className="text-gray-400">Sin nivel</span>
                )}
              </TableCell>
            )}
            {columnVisibility.color && (
              <TableCell className="text-center">
                {skill.color && (
                  <div className="flex items-center gap-2 justify-center">
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: skill.color }}
                    />
                    <span className="text-sm font-mono">{skill.color}</span>
                  </div>
                )}
              </TableCell>
            )}
            {columnVisibility.imageUrl && (
              <TableCell className="text-center">
                {skill.imageUrl ? (
                  <div className="relative w-12 h-12 rounded overflow-hidden mx-auto">
                    <Image
                      src={skill.imageUrl}
                      alt={skill.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <span className="text-gray-400">Sin imagen</span>
                )}
              </TableCell>
            )}
            {columnVisibility.icon && (
              <TableCell>
                {skill.icon ? (
                  <span className="text-sm">{skill.icon}</span>
                ) : (
                  <span className="text-gray-400">Sin icono</span>
                )}
              </TableCell>
            )}
            {columnVisibility.objectives && (
              <TableCell className="max-w-xs">
                {skill.objectives ? (
                  <div className="text-sm">
                    {skill.objectives.split('\n').slice(0, 2).map((obj, idx) => (
                      <div key={idx} className="truncate">• {obj}</div>
                    ))}
                    {skill.objectives.split('\n').length > 2 && (
                      <div className="text-gray-500">+{skill.objectives.split('\n').length - 2} más</div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">Sin objetivos</span>
                )}
              </TableCell>
            )}
            {columnVisibility.prerequisites && (
              <TableCell className="max-w-xs">
                {skill.prerequisites ? (
                  <div className="text-sm">
                    {skill.prerequisites.split('\n').slice(0, 2).map((pre, idx) => (
                      <div key={idx} className="truncate">• {pre}</div>
                    ))}
                    {skill.prerequisites.split('\n').length > 2 && (
                      <div className="text-gray-500">+{skill.prerequisites.split('\n').length - 2} más</div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">Sin prerrequisitos</span>
                )}
              </TableCell>
            )}

            {columnVisibility.isActive && (
              <TableCell>
                <Badge variant={skill.isActive ? 'default' : 'secondary'}>
                  {skill.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
            )}
            {columnVisibility.createdAt && (
              <TableCell className="text-sm text-gray-500 text-center">
                {formatDate ? formatDate(skill.createdAt) : new Date(skill.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
            )}
            {columnVisibility.updatedAt && (
              <TableCell className="text-sm text-gray-500 text-center">
                {formatDate ? formatDate(skill.updatedAt) : new Date(skill.updatedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
            )}
            {columnVisibility.actions && (
              <TableCell className="text-center">
                <div className="flex items-center gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(skill)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente el skill
                          "{skill.name}" del sistema.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(skill.id)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SkillTable;