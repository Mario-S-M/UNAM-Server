import React from "react";
import {
  getContentById,
  getContentMarkdown,
} from "@/app/actions/content-actions";
import EditContentClientPage from "./edit-content-client";

interface EditContentServerProps {
  contentId: string;
}

export default async function EditContentServer({
  contentId,
}: EditContentServerProps) {
  try {
    // Cargar datos en el servidor
    const [content, markdownData] = await Promise.allSettled([
      getContentById(contentId),
      getContentMarkdown(contentId),
    ]);

    // Preparar datos para el cliente
    const contentData = content.status === "fulfilled" ? content.value : null;
    const markdownContent =
      markdownData.status === "fulfilled" ? markdownData.value : null;

    // Crear contenido por defecto si no hay markdown
    let finalContent = markdownContent;

    if (!finalContent && contentData) {
      finalContent = `# ${contentData.name}

## Descripcion

${contentData.description || "Descripcion pendiente de completar."}

## Informacion del Contenido

- **Nombre**: ${contentData.name}
- **Fecha de creacion**: ${new Date().toLocaleDateString("es-ES")}

## Objetivos de Aprendizaje

- [ ] Objetivo 1: Pendiente de definir
- [ ] Objetivo 2: Pendiente de definir

## Contenido Educativo

Aqui puedes agregar el contenido educativo principal...

---

*Ultima actualizacion: ${new Date().toLocaleDateString("es-ES")}*`;
    }

    if (!contentData) {
      throw new Error("Contenido no encontrado");
    }

    return (
      <EditContentClientPage
        contentId={contentId}
        content={contentData}
        initialMarkdown={finalContent || ""}
      />
    );
  } catch (error) {
    console.error("Error en EditContentServer:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">No se pudo cargar el contenido</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
}
