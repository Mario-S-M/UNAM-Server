'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface FileUploadMetadata {
  idioma: string;
  nivel: string;
  skill: string;
  contenido: string;
}

interface UploadedFile {
  key: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
  publicUrl: string;
  serverPath: string;
  metadata: FileUploadMetadata;
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (
    file: File,
    metadata: FileUploadMetadata
  ): Promise<UploadedFile | null> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/uploadthing', {
        method: 'POST',
        headers: {
          'x-idioma': metadata.idioma,
          'x-nivel': metadata.nivel,
          'x-skill': metadata.skill,
          'x-contenido': metadata.contenido,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Archivo subido correctamente');
        return result;
      } else {
        toast.error('Error al subir el archivo');
        return null;
      }
    } catch (error) {
      console.error('Error in uploadFile:', error);
      toast.error('Error al subir el archivo');
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteFile = async (filePath: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/delete-file?path=${encodeURIComponent(filePath)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Archivo eliminado correctamente');
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error al eliminar el archivo');
        return false;
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Error al eliminar el archivo');
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    isUploading,
    uploadProgress,
  };
};

export type { FileUploadMetadata, UploadedFile };