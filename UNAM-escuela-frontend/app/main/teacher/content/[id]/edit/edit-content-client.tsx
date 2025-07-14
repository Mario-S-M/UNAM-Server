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
} from "@heroui/react";
import { ArrowLeft, Calendar, Upload } from "lucide-react";
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

  // Auto-save con configuración optimizada
  const autoSave = useAutoSave({
    contentId,
    enabled: true,
    interval: 2000, // 2 segundos para testing
    onSave: (success: boolean, content: string) => {
      console.log("🔄 Auto-save callback:", {
        success,
        contentLength: content.length,
        contentId,
      });

      if (success) {
        console.log("✅ Auto-save exitoso - actualizando estado UI");
        setAutoSaveStatus("saved");
        setLastSaveTime(new Date());
        setHasUnsavedChanges(false);
        queryClient.invalidateQueries({
          queryKey: ["contentMarkdown", contentId],
        });
        // Resetear a "idle" después de 2 segundos
        setTimeout(() => {
          setAutoSaveStatus("idle");
          console.log("🔄 Auto-save: Estado reseteado a idle");
        }, 2000);
      } else {
        console.error("❌ Auto-save falló - actualizando estado UI");
        setAutoSaveStatus("error");
        setTimeout(() => setAutoSaveStatus("idle"), 4000);
      }
    },
    onError: (error: string) => {
      console.error("❌ Auto-save error:", error);
      setAutoSaveStatus("error");
      setTimeout(() => setAutoSaveStatus("idle"), 4000);
    },
  });

  // Detectar cambios en el contenido
  useEffect(() => {
    if (autoSaveStatus === "idle" && hasUnsavedChanges) {
      setAutoSaveStatus("changes");
    }
  }, [hasUnsavedChanges, autoSaveStatus]);

  // Handler para auto-save desde el editor con mejor logging
  const handleEditorSave = useCallback(
    async (content: string) => {
      console.log("📝 Editor save callback EJECUTADO:", {
        contentLength: content.length,
        isDifferentFromInitial: content !== initialMarkdown,
        isDifferentFromCurrent: content !== currentContent,
        timestamp: new Date().toISOString(),
        contentPreview: content.substring(0, 100) + "...",
      });

      // Verificar si hay cambios ANTES de actualizar el estado
      const hasChanges = content.trim() !== "" && content !== currentContent;

      // Actualizar contenido actual
      setCurrentContent(content);

      // Marcar cambios y programar auto-save si hay cambios válidos
      if (hasChanges) {
        console.log("✏️ Contenido modificado, programando auto-save");
        setHasUnsavedChanges(true);
        setAutoSaveStatus("saving");

        // Programar auto-save inmediatamente
        autoSave.scheduleAutoSave(content);
      } else if (content.trim() === "") {
        console.log("↩️ Contenido vacío, no guardando");
        setHasUnsavedChanges(false);
        setAutoSaveStatus("idle");
      } else {
        console.log("↩️ Sin cambios detectados");
        setHasUnsavedChanges(false);
      }
    },
    [autoSave, currentContent]
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
