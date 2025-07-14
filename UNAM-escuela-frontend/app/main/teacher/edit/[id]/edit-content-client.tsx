"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Card, CardHeader, CardBody } from "@heroui/react";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { useAutoSave } from "@/app/hooks/use-auto-save";
import dynamic from "next/dynamic";

// Import dinámico del editor fijo
const MilkdownEditorClientFixed = dynamic(
  () => import("@/components/global/milkdown-editor-client-fixed"),
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

  // Auto-save con configuración optimizada
  const autoSave = useAutoSave({
    contentId,
    enabled: true,
    interval: 2000, // 2 segundos para testing
    onSave: (success: boolean, content: string) => {
      if (success) {
        setAutoSaveStatus("saved");
        setLastSaveTime(new Date());
        setHasUnsavedChanges(false);
        queryClient.invalidateQueries({
          queryKey: ["contentMarkdown", contentId],
        });
        // Resetear a "idle" después de 2 segundos
        setTimeout(() => {
          setAutoSaveStatus("idle");
        }, 2000);
      } else {
        setAutoSaveStatus("error");
        setTimeout(() => setAutoSaveStatus("idle"), 4000);
      }
    },
    onError: (error: string) => {
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
      // Verificar si hay cambios ANTES de actualizar el estado
      const hasChanges = content.trim() !== "" && content !== currentContent;

      // Actualizar contenido actual
      setCurrentContent(content);

      // Marcar cambios y programar auto-save si hay cambios válidos
      if (hasChanges) {
        setHasUnsavedChanges(true);
        setAutoSaveStatus("saving");

        // Programar auto-save inmediatamente
        autoSave.scheduleAutoSave(content);
      } else if (content.trim() === "") {
        setHasUnsavedChanges(false);
        setAutoSaveStatus("idle");
      } else {
        setHasUnsavedChanges(false);
      }
    },
    [autoSave, currentContent]
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <Link href="/main/teacher">
                  <div className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </div>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-primary">
                    {content.name}
                  </h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Editor de Contenido</span>
                    <span>•</span>
                    <span>Markdown</span>
                    {content.updatedAt && (
                      <>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
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
                  </div>{" "}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Editor Card */}
        <Card>
          <CardBody className="p-0">
            <MilkdownEditorClientFixed
              defaultValue={initialMarkdown}
              contentId={contentId}
              onSave={handleEditorSave}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
