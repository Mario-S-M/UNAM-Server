import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreHorizontal, Eye, EyeOff, Power, Languages } from 'lucide-react';
import { LanguageEntity, LanguageColumnVisibility } from '@/types';

interface LanguageTableProps {
  languages: LanguageEntity[];
  columnVisibility: LanguageColumnVisibility;
  onEdit: (language: LanguageEntity) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  loading: boolean;
  formatDate: (dateString: string) => string;
}

export function LanguageTable({
  languages,
  columnVisibility,
  onEdit,
  onDelete,
  onToggleStatus,
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
            {columnVisibility.name && <TableHead className="text-center">Nombre</TableHead>}
            {columnVisibility.code && <TableHead className="text-center">Código</TableHead>}
            {columnVisibility.nativeName && <TableHead className="text-center">Nombre Nativo</TableHead>}
            {columnVisibility.flag && <TableHead className="text-center">Bandera</TableHead>}
            {columnVisibility.icons && <TableHead className="text-center">Iconos</TableHead>}
            {columnVisibility.isActive && <TableHead className="text-center">Estado</TableHead>}
            {columnVisibility.createdAt && <TableHead className="text-center">Creado</TableHead>}
            {columnVisibility.updatedAt && <TableHead className="text-center">Actualizado</TableHead>}
            {columnVisibility.actions && <TableHead className="text-center">Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {languages.map((language) => (
            <TableRow key={language.id}>
              {columnVisibility.name && (
                <TableCell className="font-medium text-center">
                  {language.name}
                </TableCell>
              )}
              
              {columnVisibility.code && (
                <TableCell className="text-center">
                  <Badge variant="outline" className="font-mono">
                    {language.code || 'N/A'}
                  </Badge>
                </TableCell>
              )}
              
              {columnVisibility.nativeName && (
                <TableCell className="text-center">
                  {language.nativeName || 'N/A'}
                </TableCell>
              )}
              
              {columnVisibility.flag && (
                <TableCell className="text-center">
                  <div className="flex justify-center">
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
                  </div>
                </TableCell>
              )}
              
              {columnVisibility.icons && (
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1 flex-wrap">
                    {language.icons && language.icons.length > 0 ? (
                      language.icons.map((iconUrl, index) => (
                        <img
                          key={index}
                          src={iconUrl}
                          alt={`Icono ${index + 1}`}
                          className="h-6 w-6 object-contain rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ))
                    ) : (
                      <Languages className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
              )}
              
              {columnVisibility.isActive && (
                <TableCell className="text-center">
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
                <TableCell className="text-sm text-muted-foreground text-center">
                  {formatDate(language.createdAt)}
                </TableCell>
              )}
              
              {columnVisibility.updatedAt && (
                <TableCell className="text-sm text-muted-foreground text-center">
                  {formatDate(language.updatedAt)}
                </TableCell>
              )}
              
              {columnVisibility.actions && (
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant={language.isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => onToggleStatus(language.id)}
                      title={language.isActive ? "Desactivar idioma" : "Activar idioma"}
                    >
                      <Power className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(language)}
                    >
                      <Edit className="h-4 w-4" />
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
                  </div>
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