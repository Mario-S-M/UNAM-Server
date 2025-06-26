"use client";

import React, { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Spinner,
  Button,
  ScrollShadow,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@heroui/react";
import {
  ArrowLeft,
  FileText,
  PanelLeft,
  PanelRight,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";
import Link from "next/link";
import { getContentMarkdown } from "../../../actions/content-actions";
import MilkdownReadOnlyViewer from "../../../../components/global/milkdown-readonly-viewer";

export default function ContentViewPage() {
  const params = useParams();
  const contentId = params.id as string;

  // Estados para controlar la visibilidad de las columnas
  const [showMarkdown, setShowMarkdown] = useState(true);
  const [showExercises, setShowExercises] = useState(true);

  // Estado para el ancho de la columna del markdown (en porcentaje)
  const [markdownWidth, setMarkdownWidth] = useState(35);
  const [isDragging, setIsDragging] = useState(false);

  // Drawer para contenido markdown
  const {
    isOpen: isMarkdownOpen,
    onOpen: onMarkdownOpen,
    onOpenChange: onMarkdownOpenChange,
  } = useDisclosure();

  // Drawer para ejercicios
  const {
    isOpen: isExercisesOpen,
    onOpen: onExercisesOpen,
    onOpenChange: onExercisesOpenChange,
  } = useDisclosure();

  // Función para manejar el redimensionado
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.classList.add("resizing");

    const handleMouseMove = (e: MouseEvent) => {
      const container = document.getElementById("content-container");
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Limitar el ancho entre 20% y 80%
      const clampedWidth = Math.min(Math.max(newWidth, 20), 80);
      setMarkdownWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.classList.remove("resizing");
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  // Fetch markdown content
  const {
    data: markdownContent,
    isLoading: markdownLoading,
    error: markdownError,
  } = useQuery({
    queryKey: ["contentMarkdown", contentId],
    queryFn: () => getContentMarkdown(contentId),
    enabled: !!contentId,
  });

  if (markdownLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  if (markdownError || !markdownContent?.data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <FileText className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">
            Error al cargar el contenido
          </h3>
          <p className="text-gray-600 mb-4">
            No se pudo encontrar o cargar el contenido solicitado.
          </p>
          <Link href="/main/content">
            <Button color="primary" variant="flat">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a contenidos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header with Navigation */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link href="/main/content">
            <Button
              color="primary"
              variant="light"
              startContent={<ArrowLeft className="h-4 w-4" />}
              size="sm"
            >
              Volver a contenidos
            </Button>
          </Link>

          {/* Controles de vista */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={showMarkdown ? "solid" : "bordered"}
              color="primary"
              startContent={
                showMarkdown ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )
              }
              onPress={() => setShowMarkdown(!showMarkdown)}
            >
              {showMarkdown ? "Ocultar" : "Mostrar"} Contenido
            </Button>

            <Button
              size="sm"
              variant={showExercises ? "solid" : "bordered"}
              color="secondary"
              startContent={
                showExercises ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )
              }
              onPress={() => setShowExercises(!showExercises)}
            >
              {showExercises ? "Ocultar" : "Mostrar"} Ejercicios
            </Button>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div
        id="content-container"
        className="flex min-h-[calc(100vh-80px)] relative"
      >
        {/* Left Column - Markdown Content */}
        {showMarkdown && (
          <div
            className="bg-white border-r border-gray-200"
            style={{
              width: showExercises ? `${markdownWidth}%` : "100%",
              padding: "0",
            }}
          >
            {markdownContent?.data ? (
              <ScrollShadow
                className="h-[calc(100vh-80px)]"
                hideScrollBar={false}
                size={20}
                style={{ padding: 0, margin: 0 }}
              >
                <div
                  className="h-full w-full flex justify-center items-start"
                  style={{ margin: 0, padding: "8px 12px" }}
                >
                  <div className="w-full max-w-none">
                    <MilkdownReadOnlyViewer content={markdownContent.data} />
                  </div>
                </div>
              </ScrollShadow>
            ) : (
              <div className="flex items-center justify-center h-full p-4">
                <div className="text-center max-w-md">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                    Contenido no disponible
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Este contenido aún no tiene contenido markdown o no se pudo
                    cargar. Contacta al administrador si crees que esto es un
                    error.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Resizable Divider */}
        {showMarkdown && showExercises && (
          <div
            className={`w-1 bg-gray-300 cursor-col-resize flex items-center justify-center relative ${
              isDragging ? "bg-primary-500" : ""
            }`}
            onMouseDown={handleMouseDown}
            style={{ userSelect: "none" }}
          >
            <div className="absolute inset-y-0 -inset-x-2">
              <div className="h-full flex items-center justify-center">
                <GripVertical className="h-4 w-4 text-gray-500 opacity-60" />
              </div>
            </div>
          </div>
        )}

        {/* Right Column - Exercises */}
        {showExercises && (
          <div
            className="bg-gray-50 flex items-center justify-center p-4"
            style={{
              width: showMarkdown ? `${100 - markdownWidth}%` : "100%",
            }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Ejercicios
              </h3>
              <p className="text-gray-500 text-sm">Aquí están los ejercicios</p>
            </div>
          </div>
        )}
      </div>

      {/* Drawer para Contenido Markdown */}
      <Drawer
        isOpen={isMarkdownOpen}
        onOpenChange={onMarkdownOpenChange}
        placement="left"
        size="lg"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">Contenido Markdown</h2>
              </DrawerHeader>
              <DrawerBody className="p-0">
                {markdownContent?.data ? (
                  <ScrollShadow
                    className="h-full"
                    hideScrollBar={false}
                    size={20}
                  >
                    <div
                      style={{ padding: "8px 12px" }}
                      className="flex justify-center items-start"
                    >
                      <div className="w-full max-w-none">
                        <MilkdownReadOnlyViewer
                          content={markdownContent.data}
                        />
                      </div>
                    </div>
                  </ScrollShadow>
                ) : (
                  <div className="flex items-center justify-center h-full p-4">
                    <div className="text-center max-w-md">
                      <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-500 mb-2">
                        Contenido no disponible
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Este contenido aún no tiene contenido markdown.
                      </p>
                    </div>
                  </div>
                )}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* Drawer para Ejercicios */}
      <Drawer
        isOpen={isExercisesOpen}
        onOpenChange={onExercisesOpenChange}
        placement="right"
        size="lg"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">Ejercicios</h2>
              </DrawerHeader>
              <DrawerBody>
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Ejercicios
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Aquí se mostrarán los ejercicios del contenido
                  </p>
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
