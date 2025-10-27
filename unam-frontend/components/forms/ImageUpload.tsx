import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EntityData {
  languageId?: string;
  languageName?: string;
  levelId?: string;
  levelName?: string;
  skillId?: string;
  skillName?: string;
  contentId?: string;
  contentName?: string;
  activityId?: string;
  activityName?: string;
}

interface ImageUploadProps {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  description?: string;
  className?: string;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  entityType?: 'language' | 'level' | 'skill' | 'content' | 'activity';
  entityData?: EntityData;
  uploadEndpoint?: string;
}

export function ImageUpload({
  id,
  label,
  value,
  onChange,
  // placeholder = 'Seleccionar imagen...',
  required = false,
  disabled = false,
  error,
  description,
  className,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  entityType,
  entityData,
  uploadEndpoint
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  const validateFile = (file: File): boolean => {
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      toast.error(`Tipo de archivo no válido. Tipos permitidos: ${acceptedTypes.join(', ')}`);
      return false;
    }

    // Validate file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`El archivo es demasiado grande. Tamaño máximo: ${maxSize}MB`);
      return false;
    }

    return true;
  };

  // Función para obtener el endpoint correcto según el tipo de entidad
  const getUploadEndpoint = (): string => {
    if (uploadEndpoint) return uploadEndpoint;
    
    if (!entityType) {
      return `${API_BASE}/uploads/image/public`;
    }
    
    return `${API_BASE}/uploads/${entityType}-image`;
  };

  const handleFileSelect = async (file: File) => {
    if (!validateFile(file)) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('image', file);
      
      // Agregar datos de la entidad si están disponibles
      if (entityData) {
        Object.entries(entityData).forEach(([key, value]) => {
          if (value) {
            formData.append(key, value);
          }
        });
      }

      const endpoint = getUploadEndpoint();
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {};
      if (token && entityType) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const result = await response.json();
      onChange(result.url);
      toast.success('Imagen subida exitosamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeImage = async () => {
    if (!value) return;
    
    try {
      // Si tenemos información de la entidad, intentar eliminar del servidor
      if (entityType && entityData && value.includes('/images/')) {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Extraer el filename de la URL
          const urlParts = value.split('/');
          const filename = urlParts[urlParts.length - 1];
          
          // Construir la URL de eliminación según el tipo de entidad
          let deleteUrl = '';
          
          switch (entityType) {
            case 'language':
              deleteUrl = `${API_BASE}/uploads/language-image/${entityData.languageName || entityData.languageId}/${filename}`;
              break;
            case 'level':
              deleteUrl = `${API_BASE}/uploads/level-image/${entityData.languageName || entityData.languageId}/${entityData.levelName || entityData.levelId}/${filename}`;
              break;
            case 'skill':
              deleteUrl = `${API_BASE}/uploads/skill-image/${entityData.languageName || entityData.languageId}/${entityData.levelName || entityData.levelId}/${entityData.skillName || entityData.skillId}/${filename}`;
              break;
            case 'content':
              deleteUrl = `${API_BASE}/uploads/content-image/${entityData.languageName || entityData.languageId}/${entityData.levelName || entityData.levelId}/${entityData.skillName || entityData.skillId}/${entityData.contentName || entityData.contentId}/${filename}`;
              break;
            case 'activity':
              deleteUrl = `${API_BASE}/uploads/activity-image/${entityData.languageName || entityData.languageId}/${entityData.levelName || entityData.levelId}/${entityData.skillName || entityData.skillId}/${entityData.contentName || entityData.contentId}/${entityData.activityName || entityData.activityId}/${filename}`;
              break;
          }
          
          if (deleteUrl) {
            await fetch(deleteUrl, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
          }
        }
      }
    } catch (error) {
      console.error('Error deleting image from server:', error);
      // Continuar con la eliminación local aunque falle la del servidor
    }
    
    onChange('');
     if (fileInputRef.current) {
       fileInputRef.current.value = '';
     }
   };

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={id}
        className={cn(
          'text-sm font-medium',
          error && 'text-red-500',
          required && 'after:content-["*"] after:ml-0.5 after:text-red-500'
        )}
      >
        {label}
      </Label>

      <div className="space-y-3">
        {/* Preview */}
        {value && (
          <div className="relative inline-block">
            <Image
              src={value}
              alt="Preview"
              width={128}
              height={128}
              className="w-32 h-32 object-cover rounded-lg border border-gray-200"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={removeImage}
              disabled={disabled || uploading}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={cn(
            'border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors',
            'hover:border-gray-400 hover:bg-gray-50',
            error && 'border-red-300',
            disabled && 'opacity-50 cursor-not-allowed',
            uploading && 'pointer-events-none'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={!disabled && !uploading ? openFileDialog : undefined}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled || uploading}
          />

          <div className="flex flex-col items-center space-y-2">
            {uploading ? (
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            ) : (
              <ImageIcon className="h-8 w-8 text-gray-400" />
            )}
            
            <div className="text-sm text-gray-600">
              {uploading ? (
                'Subiendo imagen...'
              ) : (
                <>
                  <span className="font-medium text-blue-600">Haz clic para subir</span>
                  {' o arrastra y suelta'}
                </>
              )}
            </div>
            
            <div className="text-xs text-gray-500">
              {acceptedTypes.map(type => type.split('/')[1]).join(', ').toUpperCase()} hasta {maxSize}MB
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <Button
          type="button"
          variant="outline"
          onClick={openFileDialog}
          disabled={disabled || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {value ? 'Cambiar imagen' : 'Subir imagen'}
            </>
          )}
        </Button>
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

export default ImageUpload;
export type { ImageUploadProps };