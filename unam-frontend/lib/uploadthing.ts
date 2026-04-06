import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { writeFile } from 'fs/promises';
import crypto from 'crypto';

const UPLOAD_BASE = path.resolve(process.cwd(), 'public');

const ALLOWED_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg',
  '.mp4', '.webm', '.ogg', '.mp3', '.wav', '.flac',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
]);

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

/** Permite solo alfanuméricos, guiones y guiones bajos. Trunca a 50 caracteres. */
const sanitizePathComponent = (value: string): string =>
  value.replace(/[^a-zA-Z0-9\-_]/g, '_').slice(0, 50) || 'default';

// Función para crear la estructura de carpetas
const createDirectoryStructure = (idioma: string, nivel: string, skill: string, contenido: string) => {
  const fullPath = path.resolve(UPLOAD_BASE, idioma, nivel, skill, contenido);

  // Prevent path traversal — resolved path must stay inside public/
  if (!fullPath.startsWith(UPLOAD_BASE + path.sep)) {
    throw new Error('Invalid upload path');
  }

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

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 50 MB)' }, { status: 413 });
    }

    // Validate file extension
    const fileExtension = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(fileExtension)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 415 });
    }

    // Sanitize metadata from headers — never use raw header values in paths
    const idioma = sanitizePathComponent(request.headers.get('x-idioma') || 'default');
    const nivel = sanitizePathComponent(request.headers.get('x-nivel') || 'default');
    const skill = sanitizePathComponent(request.headers.get('x-skill') || 'default');
    const contenido = sanitizePathComponent(request.headers.get('x-contenido') || 'default');

    // Crear estructura de directorios
    const uploadDir = createDirectoryStructure(idioma, nivel, skill, contenido);
    
    // Generar nombre único para el archivo
    const ext = path.extname(file.name);
    const fileName = `${crypto.randomUUID()}${ext}`;
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
