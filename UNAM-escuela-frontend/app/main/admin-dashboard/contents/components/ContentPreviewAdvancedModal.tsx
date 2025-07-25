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
  X,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Monitor,
  Code,
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
import { useAutoSave } from "@/app/hooks/use-auto-save";
import dynamic from "next/dynamic";


// Importar componentes de Milkdown de forma dinámica
const MilkdownEditorClientFixed = dynamic(
  () => import("@/components/global/milkdown-editor-client-fixed"),
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
  const [lastSaveIndicator, setLastSaveIndicator] = useState<string>("");
  const queryClient = useQueryClient();

  // Auto-guardado sutil cada 3 segundos (más rápido que el modal normal)
  const autoSave = useAutoSave({
    contentId: contentId || undefined,
    enabled: !!contentId, // Siempre habilitado cuando hay contentId
    interval: 3000, // 3 segundos para modal avanzado
    onSave: (success: boolean) => {
      if (success) {
        setHasChanges(false);
        // Indicador MUY sutil
        setLastSaveIndicator("✓");
        setTimeout(() => setLastSaveIndicator(""), 2000);
        queryClient.invalidateQueries({
          queryKey: ["contentMarkdown", contentId],
        });
      }
    },
    onError: () => {
      setLastSaveIndicator("!");
      setTimeout(() => setLastSaveIndicator(""), 3000);
    },
  });

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
      setHasChanges(false); // El contenido cargado no tiene cambios
    } else {
      // Si no hay contenido, inicializar con un contenido de ejemplo
      const defaultContent = "# Comienza a escribir aquí\n\nEste es el editor avanzado de contenido. Puedes usar **Markdown** para formatear tu texto.\n\n- Lista de elementos\n- Otro elemento\n\n> Cita de ejemplo\n\n```javascript\n// Código de ejemplo\n\n```";
      setEditedContent(defaultContent);
      setHasChanges(false); // Contenido por defecto no tiene cambios
    }
  }, [markdownContent]);

  useEffect(() => {
    if (!isOpen) {
      setHasChanges(false);
    }
  }, [isOpen]);

  // Handlers

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

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh] m-4",
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
                    Editor avanzado de contenido con vista completa
                  </p>
                </div>
                <div className="flex items-center gap-4">
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
                          <Button
                            color="warning"
                            onPress={handleInvalidate}
                            isLoading={invalidateMutation.isPending}
                            startContent={<XCircle className="h-4 w-4" />}
                            size="sm"
                          >
                            Invalidar
                          </Button>
                        ) : (
                          <Button
                            color="success"
                            onPress={handleValidate}
                            isLoading={validateMutation.isPending}
                            startContent={<CheckCircle className="h-4 w-4" />}
                            size="sm"
                          >
                            Validar
                          </Button>
                        )}
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
                    <Button
                      color="primary"
                      onPress={() => {
                        refetchMarkdown();
                      }}
                      startContent={<AlertCircle className="h-4 w-4" />}
                    >
                      Reintentar
                    </Button>
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

                  {/* Header del editor */}
                  <div className="px-6 py-4 border-b bg-white">
                    <div className="flex items-center gap-2">
                      <Edit className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">
                        Editor Avanzado de Contenido
                      </h3>
                      {hasChanges && (
                        <div className="flex items-center gap-1 text-sm text-orange-600">
                          <div className="w-2 h-2 bg-orange-500 rounded-full" />
                          <span>Cambios sin guardar</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                    Editor avanzado con auto-guardado. Los cambios se guardan automáticamente cada 3 segundos.
                  </p>
                  </div>

                  {/* Editor */}
                  <div className="flex-1 overflow-hidden">
                    <div className="h-full min-h-[400px] w-full relative">
                      {/* Indicador de guardado MUY sutil */}
                      {lastSaveIndicator && (
                        <div
                          className="absolute top-4 right-4 z-10 w-3 h-3 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm"
                          style={{
                            backgroundColor:
                              lastSaveIndicator === "✓" ? "#22c55e" : "#ef4444",
                            color: "white",
                            opacity: 0.7,
                          }}
                        >
                          {lastSaveIndicator}
                        </div>
                      )}

                      <MilkdownEditorClientFixed
                        key={`advanced-editor-${contentId}-${
                          editedContent ? "with-content" : "empty"
                        }`}
                        defaultValue={
                          editedContent ||
                          "# Comienza a escribir aquí\n\nEste es el editor avanzado de contenido. Puedes usar **Markdown** para formatear tu texto.\n\n- Lista de elementos\n- Otro elemento\n\n> Cita de ejemplo\n\n```javascript\n// Código de ejemplo\n\n```"
                        }
                        contentId={contentId!}
                        onSave={async (content) => {
                          setEditedContent(content);
                          setHasChanges(true);
                          // Programar auto-guardado sutil
                          autoSave.scheduleAutoSave(content);
                        }}
                        className="h-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <div className="flex justify-between items-center w-full">
                <div className="text-sm text-gray-500">
                  {hasChanges ? (
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                      Auto-guardando cambios...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Cambios guardados automáticamente
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    color="default"
                    variant="light"
                    onPress={onClose}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
