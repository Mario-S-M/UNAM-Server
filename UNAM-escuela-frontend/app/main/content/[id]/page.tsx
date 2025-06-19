"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Spinner, Button, ScrollShadow } from "@heroui/react";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { getContentMarkdown } from "../../../actions/content-actions";
import MilkdownReadOnlyViewer from "../../../../components/global/milkdown-readonly-viewer";

export default function ContentViewPage() {
  const params = useParams();
  const contentId = params.id as string;

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
        <div className="px-6 py-4">
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
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Column - Markdown Content (35% width with custom scrollbar) */}
        <div
          className="w-[35%] bg-white border-r border-gray-200"
          style={{ padding: "0" }}
        >
          {markdownContent?.data ? (
            <ScrollShadow
              className="h-[calc(100vh-80px)]"
              hideScrollBar={false}
              size={20}
            >
              <div className="h-full w-full pl-4 pr-2" style={{ margin: "0" }}>
                <MilkdownReadOnlyViewer content={markdownContent.data} />
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

        {/* Right Column - Exercises Placeholder (65% width) */}
        <div className="w-[65%] bg-gray-50 flex items-center justify-center p-4">
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
      </div>
    </div>
  );
}
