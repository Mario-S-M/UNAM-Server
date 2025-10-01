'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import mammoth from 'mammoth';

interface DocumentImporterProps {
  onContentImported: (content: any[]) => void;
}

export function DocumentImporter({ onContentImported }: DocumentImporterProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [googleDriveUrl, setGoogleDriveUrl] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Función para convertir archivo Word a contenido del editor
  const convertWordToContent = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          
          // Para archivos .docx, necesitamos usar mammoth.js
          if (file.name.endsWith('.docx')) {
            // Usar mammoth importado estáticamente
            const result = await mammoth.convertToHtml({ arrayBuffer });
            
            // Convertir HTML a contenido del editor
            const content = convertHtmlToEditorContent(result.value);
            resolve(content);
          } else {
            // Para archivos .doc o texto plano
            const text = new TextDecoder().decode(arrayBuffer);
            const content = convertTextToEditorContent(text);
            resolve(content);
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Función para convertir HTML a contenido del editor
  const convertHtmlToEditorContent = (html: string): any[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const content: any[] = [];

    const processNode = (node: Node): any => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        return text ? { text } : null;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toLowerCase();
        const children: any[] = [];

        // Procesar hijos
        for (const child of element.childNodes) {
          const processedChild = processNode(child);
          if (processedChild) {
            children.push(processedChild);
          }
        }

        // Mapear elementos HTML a elementos del editor
        switch (tagName) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            return { type: tagName, children: children.length ? children : [{ text: '' }] };
          case 'p':
            return { type: 'p', children: children.length ? children : [{ text: '' }] };
          case 'strong':
          case 'b':
            return children.map(child => ({ ...child, bold: true }));
          case 'em':
          case 'i':
            return children.map(child => ({ ...child, italic: true }));
          case 'u':
            return children.map(child => ({ ...child, underline: true }));
          case 'ul':
            return { type: 'ul', children: children };
          case 'ol':
            return { type: 'ol', children: children };
          case 'li':
            return { type: 'li', children: children.length ? children : [{ text: '' }] };
          case 'blockquote':
            return { type: 'blockquote', children: children.length ? children : [{ text: '' }] };
          default:
            return children.length === 1 ? children[0] : children;
        }
      }

      return null;
    };

    // Procesar el body del documento
    const body = doc.body;
    for (const child of body.childNodes) {
      const processedNode = processNode(child);
      if (processedNode) {
        if (Array.isArray(processedNode)) {
          content.push(...processedNode);
        } else {
          content.push(processedNode);
        }
      }
    }

    return content.length ? content : [{ type: 'p', children: [{ text: '' }] }];
  };

  // Función para convertir texto plano a contenido del editor
  const convertTextToEditorContent = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return [{ type: 'p', children: [{ text: '' }] }];
    }

    return lines.map(line => ({
      type: 'p',
      children: [{ text: line.trim() }]
    }));
  };

  // Función para manejar la carga de archivos
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['.doc', '.docx', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      toast.error('Tipo de archivo no soportado. Use archivos .doc, .docx o .txt');
      return;
    }

    setIsLoading(true);
    
    try {
      const content = await convertWordToContent(file);
      onContentImported(content);
      toast.success('Archivo importado exitosamente');
      setIsOpen(false);
    } catch (error) {
      console.error('Error importing file:', error);
      toast.error('Error al importar el archivo');
    } finally {
      setIsLoading(false);
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Función para manejar enlaces de Google Drive
  const handleGoogleDriveImport = async () => {
    if (!googleDriveUrl.trim()) {
      toast.error('Por favor ingrese un enlace válido');
      return;
    }

    // Validar que sea un enlace de Google Drive
    if (!googleDriveUrl.includes('drive.google.com')) {
      toast.error('Por favor ingrese un enlace válido de Google Drive');
      return;
    }

    setIsLoading(true);
    
    try {
      // Convertir enlace de Google Drive a enlace de descarga directa
      const fileId = extractGoogleDriveFileId(googleDriveUrl);
      if (!fileId) {
        throw new Error('No se pudo extraer el ID del archivo');
      }

      const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      
      // Descargar el archivo
      const response = await fetch(downloadUrl, { mode: 'cors' });
      if (!response.ok) {
        throw new Error('Error al descargar el archivo');
      }

      const blob = await response.blob();
      const file = new File([blob], 'document.docx', { type: blob.type });
      
      const content = await convertWordToContent(file);
      onContentImported(content);
      toast.success('Documento de Google Drive importado exitosamente');
      setIsOpen(false);
      setGoogleDriveUrl('');
    } catch (error) {
      console.error('Error importing from Google Drive:', error);
      toast.error('Error al importar desde Google Drive. Verifique que el archivo sea público.');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para extraer el ID del archivo de Google Drive
  const extractGoogleDriveFileId = (url: string): string | null => {
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9-_]+)/,
      /id=([a-zA-Z0-9-_]+)/,
      /\/d\/([a-zA-Z0-9-_]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Importar Documento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Documento</DialogTitle>
          <DialogDescription>
            Cargue un archivo Word o pegue un enlace de Google Drive para importar contenido al editor.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="gap-2">
              <FileText className="h-4 w-4" />
              Archivo
            </TabsTrigger>
            <TabsTrigger value="drive" className="gap-2">
              <Link className="h-4 w-4" />
              Google Drive
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="file" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Seleccionar archivo</Label>
              <Input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                accept=".doc,.docx,.txt"
                onChange={handleFileUpload}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Formatos soportados: .doc, .docx, .txt
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="drive" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="drive-url">Enlace de Google Drive</Label>
              <Input
                id="drive-url"
                type="url"
                placeholder="https://drive.google.com/file/d/..."
                value={googleDriveUrl}
                onChange={(e) => setGoogleDriveUrl(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Asegúrese de que el archivo sea público o tenga permisos de visualización.
              </p>
            </div>
            
            <Button 
              onClick={handleGoogleDriveImport}
              disabled={isLoading || !googleDriveUrl.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Importando...
                </>
              ) : (
                'Importar desde Google Drive'
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}