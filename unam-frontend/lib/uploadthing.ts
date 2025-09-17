import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { writeFile } from 'fs/promises';
import crypto from 'crypto';

// Función para crear la estructura de carpetas
const createDirectoryStructure = (idioma: string, nivel: string, skill: string, contenido: string) => {
  const basePath = path.join(process.cwd(), 'public');
  const fullPath = path.join(basePath, idioma, nivel, skill, contenido);
  
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  
  return fullPath;
};

// Función para manejar la subida de archivos
export async function handleFileUpload(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Obtener metadata de los headers
    const idioma = request.headers.get('x-idioma') || 'default';
    const nivel = request.headers.get('x-nivel') || 'default';
    const skill = request.headers.get('x-skill') || 'default';
    const contenido = request.headers.get('x-contenido') || 'default';

    // Crear estructura de directorios
    const uploadDir = createDirectoryStructure(idioma, nivel, skill, contenido);
    
    // Generar nombre único para el archivo
    const fileExtension = path.extname(file.name);
    const fileName = `${crypto.randomUUID()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);
    
    // Guardar archivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // Generar URL pública usando la ruta API
    const publicPath = path.relative(path.join(process.cwd(), 'public'), filePath);
    const publicUrl = `/api/files/${publicPath.replace(/\\/g, '/')}`;
    
    return NextResponse.json({
      key: fileName,
      name: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
      url: publicUrl,
      publicUrl: publicUrl,
      serverPath: filePath,
      metadata: {
        idioma,
        nivel,
        skill,
        contenido
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
