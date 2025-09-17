import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'Ruta del archivo requerida' },
        { status: 400 }
      );
    }

    // Validar que la ruta esté dentro del directorio público permitido
    const publicDir = path.join(process.cwd(), 'public');
    const fullPath = path.join(publicDir, filePath);
    
    // Verificar que el archivo esté dentro del directorio público
    if (!fullPath.startsWith(publicDir)) {
      return NextResponse.json(
        { error: 'Ruta no permitida' },
        { status: 403 }
      );
    }

    // Verificar que el archivo existe
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el archivo
    fs.unlinkSync(fullPath);

    return NextResponse.json(
      { message: 'Archivo eliminado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}