import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { readFile } from 'fs/promises';

const ALLOWED_DIR = path.resolve(process.cwd(), 'public');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  try {
    // Sanitize each segment to prevent path traversal
    const sanitizedSegments = pathSegments.map((segment) =>
      segment.replace(/\.\./g, '').replace(/[^\w\-. ]/g, '')
    );

    const filePath = path.resolve(ALLOWED_DIR, ...sanitizedSegments);

    // Ensure the resolved path stays within the public directory
    if (!filePath.startsWith(ALLOWED_DIR + path.sep) && filePath !== ALLOWED_DIR) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }
    
    // Leer el archivo
    const fileBuffer = await readFile(filePath);
    
    // Determinar el tipo de contenido basado en la extensión
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.avif':
        contentType = 'image/avif';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
      case '.mp4':
        contentType = 'video/mp4';
        break;
      case '.webm':
        contentType = 'video/webm';
        break;
      case '.ogg':
        contentType = 'video/ogg';
        break;
      case '.mp3':
        contentType = 'audio/mpeg';
        break;
      case '.wav':
        contentType = 'audio/wav';
        break;
      case '.flac':
        contentType = 'audio/flac';
        break;
    }
    
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}