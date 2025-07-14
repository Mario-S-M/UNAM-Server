"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
} from "@heroui/react";
import {
  ArrowLeft,
  Calendar,
  Upload,
  Save,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAutoSave } from "@/app/hooks/use-auto-save";
import dynamic from "next/dynamic";

// Import dinámico del editor fijo
const MilkdownEditorClientFixed = dynamic(
  () => import("@/components/global/milkdown-editor-client-fixed"),
  { ssr: false }
);

const DocxUploader = dynamic(
  () => import("@/components/content/docx-uploader"),
  { ssr: false }
);

interface EditContentClientPageProps {
  contentId: string;
  content: any;
  initialMarkdown: string;
}

export default function EditContentClientPage({
  contentId,
  content,
  initialMarkdown,
}: EditContentClientPageProps) {
  const queryClient = useQueryClient();

  // Estados para el autoguardado
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "changes" | "saving" | "saved" | "error"
  >("idle");
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentContent, setCurrentContent] = useState(initialMarkdown);

  // Modal para subir Word
  const {
    isOpen: isWordModalOpen,
    onOpen: onWordModalOpen,
    onOpenChange: onWordModalOpenChange,
  } = useDisclosure();

  // Auto-save con nuevos estados
  const autoSave = useAutoSave({
    contentId,
    enabled: true,
    interval: 3000,
    onSave: (success: boolean, content: string) => {
      if (success) {
        setAutoSaveStatus("saved");
        setLastSaveTime(new Date());
        setHasUnsavedChanges(false);
        queryClient.invalidateQueries({
          queryKey: ["contentMarkdown", contentId],
        });
        // Resetear a "idle" después de 2 segundos
        setTimeout(() => setAutoSaveStatus("idle"), 2000);
      } else {
        setAutoSaveStatus("error");
        setTimeout(() => setAutoSaveStatus("idle"), 3000);
      }
    },
    onError: () => {
      setAutoSaveStatus("error");
      setTimeout(() => setAutoSaveStatus("idle"), 3000);
    },
  });

  // Detectar cambios en el contenido
  useEffect(() => {
    if (autoSaveStatus === "idle" && hasUnsavedChanges) {
      setAutoSaveStatus("changes");
    }
  }, [hasUnsavedChanges, autoSaveStatus]);

  // Función para forzar guardado manual
  const handleManualSave = useCallback(() => {
    try {
      const editorInstance = (window as any).milkdownEditorInstance;
      if (editorInstance && editorInstance.getMarkdown) {
        const content = editorInstance.getMarkdown();
        console.log("🔄 Guardado manual iniciado");
        setAutoSaveStatus("saving");
        autoSave.scheduleAutoSave(content);
      } else {
        console.log("❌ No se pudo acceder al editor para guardado manual");
        setAutoSaveStatus("error");
        setTimeout(() => setAutoSaveStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Error en guardado manual:", error);
      setAutoSaveStatus("error");
      setTimeout(() => setAutoSaveStatus("idle"), 3000);
    }
  }, [autoSave]);

  // Handler para auto-save desde el editor
  const handleEditorSave = useCallback(
    async (content: string) => {
      console.log("💾 Auto-save desde editor único:", content.length);

      // Actualizar contenido actual
      setCurrentContent(content);

      // Solo marcar cambios si el contenido es diferente al inicial
      if (content !== initialMarkdown) {
        setHasUnsavedChanges(true);
        setAutoSaveStatus("saving");
        autoSave.scheduleAutoSave(content);
      } else {
        // Si el contenido vuelve a ser igual al inicial, no hay cambios pendientes
        setHasUnsavedChanges(false);
        setAutoSaveStatus("idle");
      }
    },
    [autoSave, initialMarkdown]
  );

  // Manejadores para Word upload
  const handleDocxSuccess = useCallback(() => {
    setAutoSaveStatus("saved");
    setLastSaveTime(new Date());
    setHasUnsavedChanges(false);
    setTimeout(() => setAutoSaveStatus("idle"), 3000);
    // Recargar la página para mostrar el nuevo contenido
    window.location.reload();
  }, []);

  const handleDocxError = useCallback((error: string) => {
    setAutoSaveStatus("error");
    setTimeout(() => setAutoSaveStatus("idle"), 5000);
  }, []);

  // Función para renderizar el chip de estado elegante
  const renderAutoSaveChip = () => {
    const getChipConfig = () => {
      switch (autoSaveStatus) {
        case "changes":
          return {
            color: "warning" as const,
            variant: "dot" as const,
            icon: <AlertCircle className="w-3 h-3" />,
            text: "Cambios por guardar",
          };
        case "saving":
          return {
            color: "primary" as const,
            variant: "dot" as const,
            icon: <Clock className="w-3 h-3 animate-spin" />,
            text: "Guardando...",
          };
        case "saved":
          return {
            color: "success" as const,
            variant: "dot" as const,
            icon: <CheckCircle2 className="w-3 h-3" />,
            text: lastSaveTime
              ? `Guardado ${lastSaveTime.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Guardado",
          };
        case "error":
          return {
            color: "danger" as const,
            variant: "dot" as const,
            icon: <AlertCircle className="w-3 h-3" />,
            text: "Error al guardar",
          };
        case "idle":
        default:
          if (!hasUnsavedChanges) {
            return {
              color: "default" as const,
              variant: "flat" as const,
              icon: <Save className="w-3 h-3" />,
              text: "Sin cambios",
            };
          }
          return null;
      }
    };

    const config = getChipConfig();
    if (!config) return null;

    return (
      <Chip
        color={config.color}
        variant={config.variant}
        size="sm"
        startContent={config.icon}
        className="animate-in fade-in-0 duration-200"
      >
        {config.text}
      </Chip>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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
                  {content.name}
                </h1>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>Editor de Contenido</span>
                  <span>•</span>
                  <span>Markdown</span>
                  {content.updatedAt && (
                    <>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs">
                          Última actualización:{" "}
                          {new Date(content.updatedAt).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Chip de estado de autoguardado */}
              {renderAutoSaveChip()}

              {/* Botón de guardado manual */}
              {hasUnsavedChanges && (
                <Button
                  color="success"
                  variant="flat"
                  size="sm"
                  startContent={<Save className="h-4 w-4" />}
                  onPress={handleManualSave}
                  isLoading={autoSaveStatus === "saving"}
                >
                  Guardar ahora
                </Button>
              )}

              <Button
                color="primary"
                variant="flat"
                size="sm"
                startContent={<Upload className="h-4 w-4" />}
                onPress={onWordModalOpen}
              >
                Importar Word
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor - ÚNICO GARANTIZADO */}
      <div className="flex-1 relative">
        {/* Editor único con componente fijo */}
        <MilkdownEditorClientFixed
          defaultValue={initialMarkdown}
          contentId={contentId}
          onSave={handleEditorSave}
        />
      </div>

      {/* Modal para importar Word */}
      <Modal
        isOpen={isWordModalOpen}
        onOpenChange={onWordModalOpenChange}
        size="2xl"
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">Importar desde Word</h3>
                <p className="text-sm text-gray-600 font-normal">
                  Sube un archivo Word (.docx) para convertirlo a Markdown
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="py-4">
                  <DocxUploader
                    contentId={contentId}
                    onSuccess={() => {
                      handleDocxSuccess();
                      onClose();
                    }}
                    onError={handleDocxError}
                    className="w-full"
                  />
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>⚠️ Advertencia:</strong> Este proceso{" "}
                      <strong>reemplazará completamente</strong> el contenido
                      actual del editor. Asegúrate de haber guardado cualquier
                      cambio importante antes de continuar.
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
