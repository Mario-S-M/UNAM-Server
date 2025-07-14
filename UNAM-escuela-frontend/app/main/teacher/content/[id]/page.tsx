"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
  Breadcrumbs,
  BreadcrumbItem,
  Chip,
} from "@heroui/react";
import { Edit, ArrowLeft, FileText, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { RouteGuard } from "@/components/auth/route-guard";
import {
  getContentById,
  getContentMarkdown,
} from "@/app/actions/content-actions";
import dynamic from "next/dynamic";
import { ContentErrorDisplay } from "@/components/content/content-error-display";

// Importar Milkdown de forma dinámica para evitar SSR issues
const MilkdownReadOnlyViewer = dynamic(
  () => import("@/components/global/milkdown-readonly-viewer"),
  { ssr: false }
);

export default function ViewContentPage() {
  return (
    <RouteGuard requiredPage="/main/teacher">
      <ViewContentPageContent />
    </RouteGuard>
  );
}

function ViewContentPageContent() {
  const params = useParams();
  const contentId = params.id as string;

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

  if (contentError || markdownError || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ContentErrorDisplay
          error={
            contentError?.message ||
            markdownError?.message ||
            "Contenido no encontrado"
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumbs>
            <BreadcrumbItem>
              <Link href="/main/teacher">Dashboard</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link href="/main/teacher/content">Contenido</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>Ver</BreadcrumbItem>
          </Breadcrumbs>

          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                {content.name}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                {content.assignedTeachers && (
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {content.assignedTeachers.length} profesor(es) asignado(s)
                    </span>
                  </div>
                )}
                {content.updatedAt && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Última actualización:{" "}
                      {new Date(content.updatedAt).toLocaleDateString("es-ES")}
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
              <Link href={`/main/teacher/content/${contentId}/edit`}>
                <Button
                  color="primary"
                  startContent={<Edit className="h-4 w-4" />}
                >
                  Editar
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Información del contenido */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">Información del Contenido</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-700">Descripción:</span>
                <p className="text-gray-600 mt-1">{content.description}</p>
              </div>
              {content.assignedTeachers &&
                content.assignedTeachers.length > 0 && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">
                      Profesores asignados:
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {content.assignedTeachers.map((teacher: any) => (
                        <Chip
                          key={teacher.id}
                          variant="flat"
                          color="primary"
                          size="sm"
                        >
                          {teacher.fullName}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </CardBody>
        </Card>

        {/* Contenido Markdown */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Contenido</h2>
          </CardHeader>
          <CardBody className="p-2">
            {markdownData ? (
              <div className="prose prose-gray max-w-none pl-8">
                <MilkdownReadOnlyViewer content={markdownData} />
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No hay contenido disponible
                </h3>
                <p className="text-gray-500 mb-4">
                  Este contenido aún no tiene material educativo.
                </p>
                <Link href={`/main/teacher/content/${contentId}/edit`}>
                  <Button
                    color="primary"
                    startContent={<Edit className="h-4 w-4" />}
                  >
                    Comenzar a Editar
                  </Button>
                </Link>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
