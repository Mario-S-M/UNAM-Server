"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
  ScrollShadow,
  ButtonGroup,
  Switch,
} from "@heroui/react";
import {
  Edit,
  Save,
  X,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Monitor,
  Code,
  Eye,
  SplitSquareHorizontal,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContentById,
  getContentMarkdown,
  updateContentMarkdown,
  validateContent,
  invalidateContent,
} from "@/app/actions/content-actions";
import { addToast } from "@heroui/react";
import dynamic from "next/dynamic";
import GlobalButton from "@/components/global/globalButton";

// Importar componentes de Milkdown de forma dinámica
const MilkdownEditorClientFixed = dynamic(
  () => import("@/components/global/milkdown-editor-client-fixed"),
  { ssr: false }
);

const MilkdownReadOnlyViewer = dynamic(
  () => import("@/components/global/milkdown-readonly-viewer"),
  { ssr: false }
);

interface ContentPreviewAdvancedModalProps {
  contentId: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContentPreviewAdvancedModal({
  contentId,
  isOpen,
  onOpenChange,
}: ContentPreviewAdvancedModalProps) {
  const [editedContent, setEditedContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "edit" | "split">(
    "preview"
  );
  const [isLivePreview, setIsLivePreview] = useState(true);
  const queryClient = useQueryClient();

  // Queries
  const {
    data: content,
    isLoading: contentLoading,
    error: contentError,
  } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => getContentById(contentId!),
    enabled: !!contentId,
  });

  const {
    data: markdownContent,
    isLoading: markdownLoading,
    error: markdownError,
    refetch: refetchMarkdown,
  } = useQuery({
    queryKey: ["contentMarkdown", contentId],
    queryFn: () => getContentMarkdown(contentId!),
    enabled: !!contentId,
  });

  // Mutations
  const saveMarkdownMutation = useMutation({
    mutationFn: (content: string) => updateContentMarkdown(contentId!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contentMarkdown", contentId],
      });
      queryClient.invalidateQueries({ queryKey: ["contentsPaginated"] });
      setHasChanges(false);
      addToast({
        title: "¡Éxito!",
        description: "Contenido guardado exitosamente",
        color: "success",
      });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error al guardar",
        description: error.message || "No se pudo guardar el contenido",
        color: "danger",
      });
    },
  });

  const validateMutation = useMutation({
    mutationFn: (id: string) => validateContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", contentId] });
      queryClient.invalidateQueries({ queryKey: ["contentsPaginated"] });
      addToast({
        title: "¡Éxito!",
        description: "Contenido validado exitosamente",
        color: "success",
      });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error al validar",
        description: error.message || "No se pudo validar el contenido",
        color: "danger",
      });
    },
  });

  const invalidateMutation = useMutation({
    mutationFn: (id: string) => invalidateContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", contentId] });
      queryClient.invalidateQueries({ queryKey: ["contentsPaginated"] });
      addToast({
        title: "¡Éxito!",
        description: "Contenido marcado como no validado",
        color: "success",
      });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "No se pudo invalidar el contenido",
        color: "danger",
      });
    },
  });

  // Effects
  useEffect(() => {
    if (markdownContent) {
      setEditedContent(markdownContent);
    } else {
      // Si no hay contenido, inicializar con un contenido de ejemplo
      setEditedContent(
        "# Comienza a escribir aquí\n\nEste es el editor de contenido. Puedes usar **Markdown** para formatear tu texto.\n\n- Lista de elementos\n- Otro elemento\n\n> Cita de ejemplo\n\n```javascript\n// Código de ejemplo\nconsole.log('Hola mundo');\n```"
      );
    }
  }, [markdownContent]);

  useEffect(() => {
    if (!isOpen) {
      setViewMode("preview");
      setHasChanges(false);
      setIsLivePreview(true);
    }
  }, [isOpen]);

  // Handlers
  const handleSave = () => {
    if (editedContent.trim()) {
      saveMarkdownMutation.mutate(editedContent);
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(markdownContent || "");
    setHasChanges(false);
  };

  const handleValidate = () => {
    if (contentId) {
      validateMutation.mutate(contentId);
    }
  };

  const handleInvalidate = () => {
    if (contentId) {
      invalidateMutation.mutate(contentId);
    }
  };

  const handleContentChange = (newContent: string) => {
    setEditedContent(newContent);
    setHasChanges(newContent !== markdownContent);
  };

  const handleAutoSave = (success: boolean, content: string) => {
    if (success) {
      setHasChanges(false);
    }
  };

  const getValidationColor = (status: string) => {
    switch (status) {
      case "validado":
        return "success";
      case "sin validar":
        return "warning";
      default:
        return "default";
    }
  };

  const getValidationIcon = (status: string) => {
    switch (status) {
      case "validado":
        return <CheckCircle className="h-4 w-4" />;
      case "sin validar":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const isLoading = contentLoading || markdownLoading;
  const hasError = contentError || markdownError;

  const previewContent =
    isLivePreview && viewMode === "split" ? editedContent : markdownContent;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="full"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[95vh] m-2",
        body: "p-0",
        header: "px-6 py-4 border-b",
        footer: "px-6 py-4 border-t",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {content?.name || "Contenido"}
                  </h2>
                  <p className="text-sm text-default-500">
                    Editor avanzado de contenido con vista previa en tiempo real
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {/* View Mode Selector */}
                  <ButtonGroup size="sm" variant="flat">
                    <GlobalButton
                      color={viewMode === "preview" ? "primary" : "default"}
                      onPress={() => setViewMode("preview")}
                      startContent={<Eye className="h-4 w-4" />}
                      size="sm"
                    >
                      Vista Previa
                    </GlobalButton>
                    <GlobalButton
                      color={viewMode === "edit" ? "primary" : "default"}
                      onPress={() => setViewMode("edit")}
                      startContent={<Edit className="h-4 w-4" />}
                      size="sm"
                    >
                      Editar
                    </GlobalButton>
                    <GlobalButton
                      color={viewMode === "split" ? "primary" : "default"}
                      onPress={() => setViewMode("split")}
                      startContent={
                        <SplitSquareHorizontal className="h-4 w-4" />
                      }
                      size="sm"
                    >
                      Dividido
                    </GlobalButton>
                  </ButtonGroup>

                  {/* Live Preview Switch */}
                  {viewMode === "split" && (
                    <div className="flex items-center gap-2">
                      <Switch
                        size="sm"
                        isSelected={isLivePreview}
                        onValueChange={setIsLivePreview}
                      />
                      <span className="text-sm text-gray-600">
                        Vista en vivo
                      </span>
                    </div>
                  )}

                  {/* Status and Actions */}
                  {content && (
                    <div className="flex items-center gap-2">
                      <Chip
                        color={getValidationColor(
                          (content as any)?.validationStatus || "sin validar"
                        )}
                        variant="flat"
                        startContent={getValidationIcon(
                          (content as any)?.validationStatus || "sin validar"
                        )}
                        size="sm"
                      >
                        {(content as any)?.validationStatus || "sin validar"}
                      </Chip>
                      <ButtonGroup size="sm" variant="flat">
                        {((content as any)?.validationStatus ||
                          "sin validar") === "validado" ? (
                          <GlobalButton
                            color="warning"
                            onPress={handleInvalidate}
                            isLoading={invalidateMutation.isPending}
                            startContent={<XCircle className="h-4 w-4" />}
                            size="sm"
                          >
                            Invalidar
                          </GlobalButton>
                        ) : (
                          <GlobalButton
                            color="success"
                            onPress={handleValidate}
                            isLoading={validateMutation.isPending}
                            startContent={<CheckCircle className="h-4 w-4" />}
                            size="sm"
                          >
                            Validar
                          </GlobalButton>
                        )}
                        <GlobalButton
                          color="default"
                          onPress={() => refetchMarkdown()}
                          startContent={<RefreshCw className="h-4 w-4" />}
                          size="sm"
                        >
                          Recargar
                        </GlobalButton>
                      </ButtonGroup>
                    </div>
                  )}
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="px-0 py-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Spinner size="lg" />
                    <p className="mt-4 text-gray-600">Cargando contenido...</p>
                  </div>
                </div>
              ) : hasError ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center max-w-md">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-red-600 mb-2">
                      Error al cargar el contenido
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {contentError?.message ||
                        markdownError?.message ||
                        "Error desconocido"}
                    </p>
                    <GlobalButton
                      color="primary"
                      onPress={() => {
                        refetchMarkdown();
                      }}
                      startContent={<RefreshCw className="h-4 w-4" />}
                    >
                      Reintentar
                    </GlobalButton>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Información del contenido */}
                  {content && (
                    <div className="px-6 py-4 bg-gray-50 border-b">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Descripción:
                          </span>
                          <p className="text-gray-600 mt-1">
                            {content.description}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Skill:
                          </span>
                          <p className="text-gray-600 mt-1">
                            {(content as any)?.skill?.name ||
                              "Sin skill asignado"}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Profesores:
                          </span>
                          <p className="text-gray-600 mt-1">
                            {content.assignedTeachers?.length || 0} asignados
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content Display */}
                  <div className="flex-1 overflow-hidden">
                    {viewMode === "preview" ? (
                      <div className="h-full px-6 py-4">
                        {markdownContent ? (
                          <ScrollShadow className="h-full">
                            <div className="prose prose-gray max-w-none pl-8">
                              <MilkdownReadOnlyViewer
                                content={markdownContent}
                              />
                            </div>
                          </ScrollShadow>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-500 mb-2">
                                No hay contenido disponible
                              </h3>
                              <p className="text-gray-400">
                                Este contenido aún no tiene material educativo.
                              </p>
                              <GlobalButton
                                color="primary"
                                onPress={() => setViewMode("edit")}
                                startContent={<Edit className="h-4 w-4" />}
                              >
                                Comenzar a editar
                              </GlobalButton>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : viewMode === "edit" ? (
                      <div className="h-full">
                        <MilkdownEditorClientFixed
                          key={`advanced-editor-${contentId}-${
                            editedContent ? "with-content" : "empty"
                          }`}
                          defaultValue={
                            editedContent ||
                            "# Comienza a escribir aquí\n\nEscribe tu contenido usando **Markdown**."
                          }
                          onSave={async (content: string) => {
                            // Simple save implementation for old component
                            if (contentId) {
                              try {
                                await updateContentMarkdown(contentId, content);
                                setHasChanges(false);
                              } catch (error) {
                                console.error("Save error:", error);
                              }
                            }
                          }}
                        />
                      </div>
                    ) : (
                      // Split view
                      <div className="flex h-full">
                        <div className="w-1/2 border-r">
                          <div className="bg-gray-100 px-4 py-2 border-b">
                            <div className="flex items-center gap-2">
                              <Code className="h-4 w-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">
                                Editor
                              </span>
                              {hasChanges && (
                                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                              )}
                            </div>
                          </div>
                          <div className="h-full">
                            <MilkdownEditorClientFixed
                              key={`split-editor-${contentId}-${
                                editedContent ? "with-content" : "empty"
                              }`}
                              defaultValue={
                                editedContent ||
                                "# Comienza a escribir aquí\n\nEscribe tu contenido usando **Markdown**."
                              }
                              onSave={async (content: string) => {
                                // Simple save implementation for old component
                                if (contentId) {
                                  try {
                                    await updateContentMarkdown(
                                      contentId,
                                      content
                                    );
                                    setHasChanges(false);
                                  } catch (error) {
                                    console.error("Save error:", error);
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className="w-1/2">
                          <div className="bg-gray-100 px-4 py-2 border-b">
                            <div className="flex items-center gap-2">
                              <Monitor className="h-4 w-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-700">
                                Vista Previa
                              </span>
                              {isLivePreview && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  En vivo
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="h-full px-4 py-4">
                            {previewContent ? (
                              <ScrollShadow className="h-full">
                                <div className="prose prose-gray max-w-none pl-8">
                                  <MilkdownReadOnlyViewer
                                    content={previewContent}
                                  />
                                </div>
                              </ScrollShadow>
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                                    Sin contenido para previsualizar
                                  </h3>
                                  <p className="text-gray-400">
                                    Escribe algo en el editor para ver la vista
                                    previa
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <div className="flex justify-between items-center w-full">
                <div className="text-sm text-gray-500">
                  {hasChanges && (
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                      Hay cambios sin guardar
                    </span>
                  )}
                  {viewMode === "preview" && markdownContent && (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Contenido cargado
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {(viewMode === "edit" || viewMode === "split") &&
                    hasChanges && (
                      <>
                        <GlobalButton
                          color="default"
                          variant="light"
                          onPress={handleCancelEdit}
                          isDisabled={saveMarkdownMutation.isPending}
                        >
                          Cancelar
                        </GlobalButton>
                        <GlobalButton
                          color="primary"
                          onPress={handleSave}
                          isLoading={saveMarkdownMutation.isPending}
                          startContent={<Save className="h-4 w-4" />}
                        >
                          Guardar Cambios
                        </GlobalButton>
                      </>
                    )}
                  <GlobalButton
                    color="default"
                    variant="light"
                    onPress={onClose}
                    isDisabled={saveMarkdownMutation.isPending}
                  >
                    Cerrar
                  </GlobalButton>
                </div>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
