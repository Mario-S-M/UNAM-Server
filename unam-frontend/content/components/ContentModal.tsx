import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Content, CreateContentFormData as ContentFormData, Level, Skill, Teacher } from '../../types';
import { ContentForm } from './ContentForm';

interface ContentModalProps {
  isOpen: boolean;
  editingContent: Content | null;
  formData: ContentFormData;
  onFormDataChange: (data: ContentFormData) => void;
  onClose: () => void;
  onSubmit: () => void;
  levels: Level[];
  skills: Skill[];
  teachers: Teacher[];
  isLoading: boolean;
}

export function ContentModal({
  isOpen,
  editingContent,
  formData,
  onFormDataChange,
  onClose,
  onSubmit,
  levels,
  skills,
  teachers,
  isLoading
}: ContentModalProps) {
  const isFormValid = formData.name && formData.description && formData.levelId && formData.skillId;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {editingContent ? 'Editar Contenido' : 'Crear Nuevo Contenido'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {editingContent ? 'Modifica los datos del contenido' : 'Completa la información para crear un nuevo contenido'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <ContentForm
          formData={formData}
          onFormDataChange={onFormDataChange}
          levels={levels}
          skills={skills}
          teachers={teachers}
        />
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onSubmit}
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? 'Guardando...' : (editingContent ? 'Actualizar' : 'Crear')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}