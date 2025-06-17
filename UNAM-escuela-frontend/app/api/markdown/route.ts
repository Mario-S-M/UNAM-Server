import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Obtener la ruta base del proyecto
const MARKDOWN_BASE_PATH = path.join(process.cwd(), "..", "..", "Markdown");

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");

    if (!filePath) {
      return NextResponse.json(
        { error: "Path parameter is required" },
        { status: 400 }
      );
    }

    // Construir la ruta completa del archivo
    const fullPath = path.join(MARKDOWN_BASE_PATH, filePath);

    // Verificar que el archivo está dentro del directorio Markdown por seguridad
    if (!fullPath.startsWith(MARKDOWN_BASE_PATH)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    try {
      const content = await fs.readFile(fullPath, "utf-8");
      return new NextResponse(content, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    } catch (error) {
      // Si el archivo no existe, devolver un error 404
      if ((error as any).code === "ENOENT") {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error reading markdown file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { path: filePath, content } = await request.json();

    if (!filePath || typeof content !== "string") {
      return NextResponse.json(
        { error: "Path and content are required" },
        { status: 400 }
      );
    }

    // Construir la ruta completa del archivo
    const fullPath = path.join(MARKDOWN_BASE_PATH, filePath);

    // Verificar que el archivo está dentro del directorio Markdown por seguridad
    if (!fullPath.startsWith(MARKDOWN_BASE_PATH)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    // Crear el directorio si no existe
    const dirPath = path.dirname(fullPath);
    await fs.mkdir(dirPath, { recursive: true });

    // Escribir el archivo
    await fs.writeFile(fullPath, content, "utf-8");

    return NextResponse.json(
      { message: "File saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving markdown file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
