import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { writeFile, mkdir } from 'fs/promises';
import crypto from 'crypto';

const UPLOAD_BASE = path.resolve(process.cwd(), 'uploads');

const ALLOWED_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg',
  '.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv',
  '.mp3', '.wav', '.flac', '.m4a', '.aac', '.opus', '.oga', '.weba',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
]);

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

/** Permite solo alfanuméricos, guiones y guiones bajos. Trunca a 50 caracteres. */
const sanitizePathComponent = (value: string): string =>
  value.replace(/[^a-zA-Z0-9\-_]/g, '_').slice(0, 50) || 'default';

// Función para crear la estructura de carpetas
const ensureDirectory = async (fullPath: string) => {
  // Prevent path traversal — resolved path must stay inside UPLOAD_BASE
  if (!fullPath.startsWith(UPLOAD_BASE + path.sep) && fullPath !== UPLOAD_BASE) {
    throw new Error('Invalid upload path');
  }

  await mkdir(fullPath, { recursive: true });
};

// Función para manejar la subida de archivos
export async function handleFileUpload(request: NextRequest) {
  let step = 'init';
  try {
    step = 'formData';
    const formData = await request.formData();

    step = 'getFile';
    const file = formData.get('file') as File;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 50 MB)' }, { status: 413 });
    }

    // Validate file extension
    const fileExtension = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(fileExtension)) {
      return NextResponse.json({ error: `File type not allowed: ${fileExtension}` }, { status: 415 });
    }

    // Sanitize metadata from headers — never use raw header values in paths
    const idioma = sanitizePathComponent(request.headers.get('x-idioma') || 'default');
    const nivel = sanitizePathComponent(request.headers.get('x-nivel') || 'default');
    const skill = sanitizePathComponent(request.headers.get('x-skill') || 'default');
    const contenido = sanitizePathComponent(request.headers.get('x-contenido') || 'default');

    const uploadDir = path.resolve(UPLOAD_BASE, idioma, nivel, skill, contenido);

    step = 'mkdir';
    await ensureDirectory(uploadDir);

    // Generar nombre único para el archivo
    const ext = path.extname(file.name);
    const fileName = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    step = 'readFile';
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    step = 'writeFile';
    await writeFile(filePath, buffer);

    // Generar URL pública usando la ruta API
    const publicPath = path.relative(UPLOAD_BASE, filePath);
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
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error uploading file at step [${step}]:`, error);
    return NextResponse.json(
      { error: 'Upload failed', detail: message, step },
      { status: 500 }
    );
  }
}
