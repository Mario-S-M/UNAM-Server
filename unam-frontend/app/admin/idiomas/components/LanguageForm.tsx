import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormField, ImageUpload, IconManager } from '@/components/forms';
import { LanguageFormData } from '@/types';
import { Loader2 } from 'lucide-react';

interface LanguageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: LanguageFormData;
  onFormDataChange: (data: Partial<LanguageFormData>) => void;
  isEditing: boolean;
  loading: boolean;
  uploadingImage: boolean;
}

export function LanguageForm({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormDataChange,
  isEditing,
  loading,
  uploadingImage
}: LanguageFormProps) {
  const handleFieldChange = (field: keyof LanguageFormData) => (value: string | boolean | string[]) => {
    onFormDataChange({ [field]: value });
  };

  const handleStringFieldChange = (field: keyof LanguageFormData) => (value: string | number | boolean) => {
    onFormDataChange({ [field]: value as string });
  };

  const handleBooleanFieldChange = (field: keyof LanguageFormData) => (value: string | number | boolean) => {
    onFormDataChange({ [field]: value as boolean });
  };

  const handleArrayFieldChange = (field: keyof LanguageFormData) => (value: string[]) => {
    onFormDataChange({ [field]: value });
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.code.trim() !== '' &&
      formData.nativeName.trim() !== ''
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Idioma' : 'Crear Nuevo Idioma'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="name"
              label="Nombre"
              type="text"
              value={formData.name}
              onChange={handleStringFieldChange('name')}
              placeholder="Español"
              required
              disabled={loading}
            />

            <FormField
              id="code"
              label="Código"
              type="text"
              value={formData.code}
              onChange={handleStringFieldChange('code')}
              placeholder="es"
              required
              disabled={loading}
              description="Código ISO 639-1 del idioma"
            />
          </div>

          <FormField
            id="nativeName"
            label="Nombre Nativo"
            type="text"
            value={formData.nativeName}
            onChange={handleStringFieldChange('nativeName')}
            placeholder="Español"
            required
            disabled={loading}
            description="Nombre del idioma en su forma nativa"
          />

          {/* Bandera */}
          <ImageUpload
            id="flag"
            label="Bandera"
            value={formData.flag}
            onChange={(value) => onFormDataChange({ flag: value })}
            disabled={loading || uploadingImage}
            description="Imagen de la bandera del país/región"
            maxSize={2}
            acceptedTypes={['image/png', 'image/svg+xml', 'image/jpeg']}
            entityType="language"
            entityData={{
              languageName: formData.name
            }}
          />

          {/* Iconos */}
          <IconManager
            id="icons"
            label="Iconos"
            value={formData.icons || []}
            onChange={handleArrayFieldChange('icons')}
            disabled={loading}
            description="URLs de iconos adicionales para el idioma"
            maxIcons={5}
            placeholder="https://ejemplo.com/icono.png"
          />

          {/* Estado activo */}
          <FormField
            id="isActive"
            label="Idioma activo"
            type="checkbox"
            value={formData.isActive}
            onChange={handleBooleanFieldChange('isActive')}
            disabled={loading}
            description="Los idiomas inactivos no aparecerán en las opciones de selección"
          />

          {/* Botones */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !isFormValid() || uploadingImage}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                isEditing ? 'Actualizar Idioma' : 'Crear Idioma'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default LanguageForm;