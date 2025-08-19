import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreHorizontal, Eye, EyeOff } from 'lucide-react';
import { LanguageEntity, LanguageColumnVisibility } from '@/types';

interface LanguageTableProps {
  languages: LanguageEntity[];
  columnVisibility: LanguageColumnVisibility;
  onEdit: (language: LanguageEntity) => void;
  onDelete: (id: string) => void;
  loading: boolean;
  formatDate: (dateString: string) => string;
}

export function LanguageTable({
  languages,
  columnVisibility,
  onEdit,
  onDelete,
  loading,
  formatDate
}: LanguageTableProps) {
  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Cargando...</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (languages.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">No hay idiomas disponibles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-center py-8 text-muted-foreground">
                No se encontraron idiomas que coincidan con los criterios de búsqueda.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columnVisibility.name && <TableHead>Nombre</TableHead>}
            {columnVisibility.code && <TableHead>Código</TableHead>}
            {columnVisibility.nativeName && <TableHead>Nombre Nativo</TableHead>}
            {columnVisibility.flag && <TableHead>Bandera</TableHead>}
            {columnVisibility.icons && <TableHead>Iconos</TableHead>}
            {columnVisibility.isActive && <TableHead>Estado</TableHead>}
            {columnVisibility.createdAt && <TableHead>Creado</TableHead>}
            {columnVisibility.updatedAt && <TableHead>Actualizado</TableHead>}
            {columnVisibility.actions && <TableHead className="text-right">Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {languages.map((language) => (
            <TableRow key={language.id}>
              {columnVisibility.name && (
                <TableCell className="font-medium">
                  {language.name}
                </TableCell>
              )}
              
              {columnVisibility.code && (
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {language.code || 'N/A'}
                  </Badge>
                </TableCell>
              )}
              
              {columnVisibility.nativeName && (
                <TableCell>
                  {language.nativeName || 'N/A'}
                </TableCell>
              )}
              
              {columnVisibility.flag && (
                <TableCell>
                  {language.flag ? (
                    <img
                      src={language.flag}
                      alt={`Bandera de ${language.name}`}
                      className="w-8 h-6 object-cover rounded border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<span class="text-xs text-muted-foreground">Sin imagen</span>';
                        }
                      }}
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin bandera</span>
                  )}
                </TableCell>
              )}
              
              {columnVisibility.icons && (
                <TableCell>
                  {language.icons && language.icons.length > 0 ? (
                    <div className="flex space-x-1">
                      {language.icons.slice(0, 3).map((icon, index) => (
                        <img
                          key={index}
                          src={icon}
                          alt={`Icono ${index + 1}`}
                          className="w-5 h-5 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ))}
                      {language.icons.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{language.icons.length - 3}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin iconos</span>
                  )}
                </TableCell>
              )}
              
              {columnVisibility.isActive && (
                <TableCell>
                  <Badge variant={language.isActive ? 'default' : 'secondary'}>
                    {language.isActive ? (
                      <>
                        <Eye className="mr-1 h-3 w-3" />
                        Activo
                      </>
                    ) : (
                      <>
                        <EyeOff className="mr-1 h-3 w-3" />
                        Inactivo
                      </>
                    )}
                  </Badge>
                </TableCell>
              )}
              
              {columnVisibility.createdAt && (
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(language.createdAt)}
                </TableCell>
              )}
              
              {columnVisibility.updatedAt && (
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(language.updatedAt)}
                </TableCell>
              )}
              
              {columnVisibility.actions && (
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(language)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Esto eliminará permanentemente el idioma
                              "{language.name}" y todos los datos asociados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(language.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default LanguageTable;