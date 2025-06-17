"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
  Breadcrumbs,
  BreadcrumbItem,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { Save, ArrowLeft, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";
import {
  getContentById,
  getContentMarkdown,
  updateContentMarkdown,
} from "@/app/actions/content-actions";
import dynamic from "next/dynamic";
import { ContentErrorDisplay } from "@/components/content/content-error-display";

// Importar Milkdown de forma dinámica para evitar SSR issues
const MilkdownEditorClient = dynamic(
  () => import("@/components/global/milkdown-editor-client"),
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

  // Cargar contenido markdown cuando esté disponible
  useEffect(() => {
    if (markdownData?.data) {
      setMarkdownContent(markdownData.data);
    } else if (markdownData?.error && content?.data) {
      // Si hay error, crear contenido por defecto
      const defaultContent = createDefaultMarkdownContent(content.data);
      setMarkdownContent(defaultContent);
    }
  }, [markdownData, content]);

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ContentErrorDisplay
          error={
            contentError?.message ||
            markdownError?.message ||
            "Error al cargar el contenido para edición"
          }
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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumbs>
            <BreadcrumbItem>
              <Link href="/main/teacher">Dashboard</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link href="/main/teacher/content">Contenido</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>Editar</BreadcrumbItem>
          </Breadcrumbs>

          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Editar Contenido
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="font-medium">{content.data.name}</span>
                {content.data.updatedAt && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Última actualización:{" "}
                      {new Date(content.data.updatedAt).toLocaleDateString(
                        "es-ES"
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <Link href="/main/teacher/content">
                <Button
                  color="default"
                  variant="light"
                  startContent={<ArrowLeft className="h-4 w-4" />}
                >
                  Volver
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Editor */}
        <Card className="min-h-[600px]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-xl font-semibold">Editor de Contenido</h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">Formato: Markdown</div>
                {isSaving && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span>Guardando...</span>
                  </div>
                )}
                {lastSaved && !hasChanges && !isSaving && (
                  <div className="text-sm text-green-600">
                    ✓ Guardado {lastSaved.toLocaleTimeString()}
                  </div>
                )}
                {hasChanges && !isSaving && (
                  <div className="text-sm text-orange-600">
                    • Cambios sin guardar
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-[600px]">
              {markdownContent && (
                <MilkdownEditorClient
                  defaultValue={markdownContent}
                  onChange={handleEditorChange}
                  contentId={contentId}
                  autoSaveInterval={5000}
                  downloadFileName={`${content.data.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}.md`}
                  onAutoSave={(success: boolean, content: string) => {
                    if (success) {
                      setHasChanges(false);
                      setLastSaved(new Date());
                    }
                  }}
                  onAutoSaveError={(error: string) => {
                    console.error("Auto-save error:", error);
                  }}
                />
              )}
            </div>
          </CardBody>
        </Card>

        {/* Footer con información */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Los cambios se guardan automáticamente cada 5 segundos. El contenido
            se almacena en archivos markdown en la carpeta /Markdown
            correspondiente al nivel y lenguaje.
          </p>
          {lastSaved && (
            <p className="mt-1">
              Último guardado: {lastSaved.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
