"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Spinner } from "@heroui/react";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";
import {
  getContentById,
  getContentMarkdown,
} from "@/app/actions/content-actions";
import dynamic from "next/dynamic";
import { ContentErrorDisplay } from "@/components/content/content-error-display";

// Importar componentes de forma dinámica para evitar SSR issues
const MilkdownEditorClient = dynamic(
  () => import("@/components/global/milkdown-editor-client"),
  { ssr: false }
);

const DocxUploader = dynamic(
  () => import("@/components/content/docx-uploader"),
  { ssr: false }
);

export default function EditContentPage() {
  return (
    <RouteGuard requiredPage="/main/teacher">
      <EditContentPageContent />
    </RouteGuard>
  );
}

function EditContentPageContent() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { canTeach } = usePermissions();

  const contentId = params.id as string;

  const [markdownContent, setMarkdownContent] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("");

  // Debug content ID
  console.log("🔍 EditContentPageContent - contentId:", contentId);
  console.log("🔍 EditContentPageContent - canTeach:", canTeach);

  // Obtener información del contenido
  const {
    data: content,
    isLoading: contentLoading,
    error: contentError,
  } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => getContentById(contentId),
    enabled: !!contentId,
  });

  // Obtener contenido markdown
  const {
    data: markdownData,
    isLoading: markdownLoading,
    error: markdownError,
  } = useQuery({
    queryKey: ["contentMarkdown", contentId],
    queryFn: () => getContentMarkdown(contentId),
    enabled: !!contentId,
  });

  // Debug query results
  console.log("🔍 EditContentPageContent - Query States:", {
    contentLoading,
    markdownLoading,
    contentError,
    markdownError,
    contentData: content,
    markdownData: markdownData,
  });

  // Cargar contenido markdown cuando esté disponible
  useEffect(() => {
    if (markdownData?.data) {
      console.log(
        "📝 Contenido markdown recibido:",
        markdownData.data.substring(0, 100) + "..."
      );
      setMarkdownContent(markdownData.data);
    } else if (markdownData?.error && content?.data) {
      console.log("⚠️ Error cargando markdown, creando contenido por defecto");
      // Si hay error, crear contenido por defecto
      const defaultContent = createDefaultMarkdownContent(content.data);
      setMarkdownContent(defaultContent);
    } else if (content?.data && !markdownLoading && !markdownData?.data) {
      // Si no hay datos de markdown pero sí info del contenido, crear contenido por defecto
      console.log(
        "🔧 No hay markdown, creando contenido por defecto para:",
        content.data.name
      );
      const defaultContent = createDefaultMarkdownContent(content.data);
      setMarkdownContent(defaultContent);
    }
  }, [markdownData, content, markdownLoading]);

  // Función para obtener el contenido del editor SIEMPRE
  const getEditorContent = () => {
    // Si ya tenemos contenido cargado, usarlo
    if (markdownContent) {
      return markdownContent;
    }

    // Si tenemos info del contenido pero no markdown, crear contenido por defecto
    if (content?.data) {
      return createDefaultMarkdownContent(content.data);
    }

    // Contenido mínimo por defecto si no hay nada
    return `# Nuevo Contenido

## Descripción

Escribe aquí la descripción del contenido...

## Información del Contenido

- **Fecha de creación**: ${new Date().toLocaleDateString("es-ES")}
- **Estado**: Borrador

## Objetivos de Aprendizaje

- [ ] Objetivo 1: Pendiente de definir
- [ ] Objetivo 2: Pendiente de definir
- [ ] Objetivo 3: Pendiente de definir

## Contenido Educativo

Aquí puedes agregar el contenido educativo principal...

### Ejemplos

### Ejercicios

### Recursos Adicionales

---
*Comenzando a editar...*
`;
  };

  const createDefaultMarkdownContent = (contentData: any) => {
    return `# ${contentData.name}

## Descripción

${contentData.description || "Descripción pendiente de completar."}

## Información del Contenido

- **Nombre**: ${contentData.name}
- **Estado**: ${contentData.status || "draft"}
- **Fecha de creación**: ${new Date().toLocaleDateString("es-ES")}

## Objetivos de Aprendizaje

- [ ] Objetivo 1: Pendiente de definir
- [ ] Objetivo 2: Pendiente de definir
- [ ] Objetivo 3: Pendiente de definir

## Contenido Educativo

Aquí puedes agregar el contenido educativo principal...

### Ejemplos

### Ejercicios

### Recursos Adicionales

## Notas para el Profesor

- Notas importantes sobre la implementación
- Sugerencias didácticas
- Tiempo estimado de clase

---

*Última actualización: ${new Date().toLocaleDateString("es-ES")}*
`;
  };

  // Callbacks para auto-save
  const handleAutoSave = (success: boolean, content: string) => {
    if (success) {
      setLastSaved(new Date());
      setAutoSaveStatus("✅ Contenido guardado exitosamente");
      // Invalidar queries para refrescar datos
      queryClient.invalidateQueries({
        queryKey: ["contentMarkdown", contentId],
      });
    } else {
      setAutoSaveStatus("❌ Error al guardar el contenido");
    }
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setAutoSaveStatus(""), 3000);
  };

  const handleAutoSaveError = (error: string) => {
    setAutoSaveStatus(`❌ Error: ${error}`);
    setTimeout(() => setAutoSaveStatus(""), 5000);
  };

  // Callback para conversión exitosa de DOCX
  const handleDocxConversionSuccess = () => {
    setAutoSaveStatus("✅ Archivo Word convertido exitosamente");
    // El hook ya invalida las queries automáticamente
    setTimeout(() => setAutoSaveStatus(""), 3000);
  };

  const handleDocxConversionError = (error: string) => {
    setAutoSaveStatus(`❌ Error al convertir: ${error}`);
    setTimeout(() => setAutoSaveStatus(""), 5000);
  };

  if (contentLoading || markdownLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  if (contentError || markdownError || !content?.data) {
    // Mejorar el manejo de errores
    const getErrorMessage = (error: any) => {
      console.log("🔍 getErrorMessage - Analyzing error:", error);
      console.log("🔍 getErrorMessage - Error type:", typeof error);
      console.log("🔍 getErrorMessage - Error keys:", Object.keys(error || {}));

      if (!error) return "Error desconocido";
      if (typeof error === "string") return error;
      if (error.message && typeof error.message === "string")
        return error.message;
      if (error.error && typeof error.error === "string") return error.error;
      return "Error al cargar el contenido";
    };

    const errorMessage = contentError
      ? getErrorMessage(contentError)
      : markdownError
      ? getErrorMessage(markdownError)
      : "Error al cargar el contenido para edición";

    console.log(
      "🔍 EditContentPageContent - Final error message:",
      errorMessage
    );
    console.log("🔍 EditContentPageContent - ContentError:", contentError);
    console.log("🔍 EditContentPageContent - MarkdownError:", markdownError);
    console.log("🔍 EditContentPageContent - Content data:", content);

    return (
      <div className="min-h-screen flex items-center justify-center">
        <ContentErrorDisplay
          error={errorMessage}
          onRetry={() => {
            window.location.reload();
          }}
          backUrl="/main/teacher/content"
          context="contenido"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header compacto */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-full mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/main/teacher/content">
                <Button
                  color="default"
                  variant="light"
                  size="sm"
                  startContent={<ArrowLeft className="h-4 w-4" />}
                >
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-primary">
                  {content.data.name}
                </h1>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>Editor de Contenido</span>
                  <span>•</span>
                  <span>Markdown</span>
                  {content.data.updatedAt && (
                    <>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">
                          Última actualización:{" "}
                          {(() => {
                            try {
                              const date = new Date(content.data.updatedAt);
                              return isNaN(date.getTime())
                                ? "Fecha no válida"
                                : date.toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  });
                            } catch {
                              return "Fecha no disponible";
                            }
                          })()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Uploader de archivos Word */}
      <div className="border-b bg-gray-50/50 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Importar desde Word
            </h3>
            <DocxUploader
              contentId={contentId}
              onSuccess={handleDocxConversionSuccess}
              onError={handleDocxConversionError}
              className="w-full max-w-md"
            />
            <p className="text-xs text-gray-500 mt-3 max-w-md">
              Sube un archivo Word (.docx) para convertirlo automáticamente a
              Markdown y <strong>reemplazar completamente</strong> el contenido
              actual.
            </p>
          </div>
        </div>
      </div>

      {/* Editor de pantalla completa */}
      <div className="flex-1 relative">
        <MilkdownEditorClient
          defaultValue={getEditorContent()}
          contentId={contentId}
          autoSaveInterval={5000}
          onAutoSave={handleAutoSave}
          onAutoSaveError={handleAutoSaveError}
          showButtons={false}
          showStatusIndicator={true}
          statusPosition="top"
        />
      </div>
    </div>
  );
}
