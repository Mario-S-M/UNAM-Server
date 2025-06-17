"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
  Spinner,
  Avatar,
} from "@heroui/react";
import {
  BookOpen,
  FileText,
  Calendar,
  Users,
  Edit,
  Eye,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";
import { getMyAssignedContents } from "@/app/actions/content-actions";
import { Content } from "@/app/actions/content-actions";

export default function TeacherContentPage() {
  return (
    <RouteGuard requiredPage="/main/teacher">
      <TeacherContentContent />
    </RouteGuard>
  );
}

function TeacherContentContent() {
  const { canTeach, userRole } = usePermissions();

  // Obtener contenido asignado al profesor
  const {
    data: assignedContents,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myAssignedContents"],
    queryFn: getMyAssignedContents,
  });

  if (!canTeach) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardBody>
              <p className="text-center text-gray-600">
                No tienes permisos para ver contenido de profesor.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Mi Contenido Asignado
              </h1>
              <p className="text-gray-600">
                Contenido educativo asignado por los administradores
              </p>
            </div>
            <Link href="/main/teacher">
              <Button
                variant="bordered"
                startContent={<BookOpen className="h-4 w-4" />}
              >
                Volver al Panel
              </Button>
            </Link>
          </div>

          <div className="bg-blue-100 p-4 rounded-lg mt-4">
            <h3 className="font-semibold text-blue-800 mb-2">
              Información del Profesor
            </h3>
            <p className="text-blue-700">
              Rol actual: {userRole} | Total de contenidos asignados:{" "}
              {assignedContents?.data?.length || 0}
            </p>
          </div>
        </div>

        {/* Lista de contenidos asignados */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold border-b pb-2">Contenidos Asignados</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <Spinner size="lg" />
                <p className="mt-4 text-gray-600">Cargando contenidos asignados...</p>
              </div>
            </div>
          ) : error ? (
            <Card>
              <CardBody>
                <div className="text-center py-8">
                  <div className="text-red-500 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Error al cargar contenido
                  </h3>
                  <p className="text-gray-500">
                    No se pudo cargar tu contenido asignado. Por favor, intenta
                    de nuevo más tarde.
                  </p>
                  <Button
                    className="mt-4"
                    color="primary"
                    onClick={() => window.location.reload()}
                  >
                    Reintentar
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : assignedContents?.data?.length === 0 ? (
            <Card>
              <CardBody>
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No tienes contenido asignado
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Cuando un administrador te asigne contenido para enseñar, aparecerá aquí.
                  </p>
                </div>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedContents?.data?.map((content: Content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ContentCardProps {
  content: Content;
}

function ContentCard({ content }: ContentCardProps) {
  const getStatusColor = (status: string = "draft") => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "default";
      default:
        return "warning";
    }
  };

  const getStatusText = (status: string = "draft") => {
    switch (status) {
      case "published":
        return "Publicado";
      case "draft":
        return "Borrador";
      case "archived":
        return "Archivado";
      default:
        return "Borrador";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start w-full">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-2">
                {content.name || content.title}
              </h3>
              <Chip
                color={getStatusColor(content.status)}
                size="sm"
                className="mt-1"
              >
                {getStatusText(content.status)}
              </Chip>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {content.description}
        </p>

        {/* Otros profesores asignados */}
        {content.assignedTeachers && content.assignedTeachers.length > 1 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">
              Otros profesores asignados:
            </p>
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2">
                {content.assignedTeachers.slice(0, 3).map((teacher, index) => (
                  <Avatar
                    key={teacher.id}
                    size="sm"
                    name={teacher.fullName}
                    className="border-2 border-white"
                    title={teacher.fullName}
                  />
                ))}
                {content.assignedTeachers.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                    +{content.assignedTeachers.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>
              Creado: {new Date(content.createdAt || "").toLocaleDateString()}
            </span>
          </div>
          {content.markdownPath && (
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3" />
              <span>Archivo markdown disponible</span>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-2 mt-4">
          <Link href={`/main/teacher/content/${content.id}`}>
            <Button
              size="sm"
              variant="light"
              startContent={<Eye className="h-3 w-3" />}
              className="text-xs"
            >
              Ver Contenido
            </Button>
          </Link>
          <Link href={`/main/teacher/content/${content.id}/edit`}>
            <Button
              size="sm"
              variant="light"
              startContent={<Edit className="h-3 w-3" />}
              className="text-xs"
            >
              Editar
            </Button>
          </Link>
          {content.markdownPath && (
            <Link href={`/main/teacher/content/${content.id}/edit`}>
              <Button
                size="sm"
                variant="light"
                startContent={<ExternalLink className="h-3 w-3" />}
                className="text-xs"
              >
                Markdown
              </Button>
            </Link>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
