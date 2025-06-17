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

// Importar Milkdown de forma dinámica para evitar SSR issues
const EditorWithChanges = dynamic(
  () => import("@/components/global/editor-with-changes"),
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
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);

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

  // Mutation para actualizar contenido
  const updateContentMutation = useMutation({
    mutationFn: (content: string) => updateContentMarkdown(contentId, content),
    onSuccess: () => {
      addToast({
        title: "Éxito",
        description: "Contenido guardado exitosamente",
        color: "success",
      });
      setHasChanges(false);
      queryClient.invalidateQueries({
        queryKey: ["contentMarkdown", contentId],
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error.message || "Error al guardar el contenido",
        color: "danger",
      });
    },
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

  const handleSave = () => {
    if (!markdownContent.trim()) {
      addToast({
        title: "Error",
        description: "El contenido no puede estar vacío",
        color: "danger",
      });
      return;
    }
    updateContentMutation.mutate(markdownContent);
  };

  const handleEditorChange = (content: string) => {
    setMarkdownContent(content);
    setHasChanges(true);
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
        <Card className="p-8 max-w-md">
          <CardBody className="text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Error al cargar el contenido
            </h3>
            <p className="text-gray-500 mb-4">
              {contentError?.message ||
                markdownError?.message ||
                "Contenido no encontrado"}
            </p>
            <Link href="/main/teacher/content">
              <Button color="primary" variant="light">
                Volver al contenido
              </Button>
            </Link>
          </CardBody>
        </Card>
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

          <div className="flex items-center justify-between mt-4">
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
              <Button
                color="primary"
                onPress={handleSave}
                isLoading={updateContentMutation.isPending}
                disabled={!hasChanges}
                startContent={<Save className="h-4 w-4" />}
              >
                {hasChanges ? "Guardar Cambios" : "Guardado"}
              </Button>
            </div>
          </div>
        </div>

        {/* Editor */}
        <Card className="min-h-[600px]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-xl font-semibold">Editor de Contenido</h2>
              <div className="text-sm text-gray-600">Formato: Markdown</div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-[600px]">
              {markdownContent && (
                <EditorWithChanges
                  defaultValue={markdownContent}
                  onChange={handleEditorChange}
                  onReady={() => setIsEditorReady(true)}
                />
              )}
            </div>
          </CardBody>
        </Card>

        {/* Footer con información */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Los cambios se guardan en el archivo markdown correspondiente en la
            carpeta /Markdown. Asegúrate de guardar tu trabajo frecuentemente.
          </p>
        </div>
      </div>
    </div>
  );
}
