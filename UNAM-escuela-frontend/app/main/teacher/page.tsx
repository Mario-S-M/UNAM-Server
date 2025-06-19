"use client";

import { Card, CardBody, CardHeader, Button, Spinner } from "@heroui/react";
import { BookOpen, Users, PlusCircle, BarChart3 } from "lucide-react";
import Link from "next/link";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";
import { useQuery } from "@tanstack/react-query";
import { getMyAssignedContents } from "@/app/actions/content-actions";
import { AssignedContentCard } from "@/components/teacher/assigned-content-card";

export default function TeacherDashboard() {
  return (
    <RouteGuard requiredPage="/main/teacher">
      <TeacherDashboardContent />
    </RouteGuard>
  );
}

function TeacherDashboardContent() {
  const { canTeach, canViewContent, canPerformOperation, userRole } =
    usePermissions();

  // Obtener contenido asignado al profesor
  const { data: assignedContents, isLoading: contentsLoading } = useQuery({
    queryKey: ["myAssignedContents"],
    queryFn: getMyAssignedContents,
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Panel del Maestro
          </h1>
          <p className="text-gray-600">
            Gestiona tu contenido educativo y actividades para estudiantes.
          </p>

          <div className="bg-blue-100 p-4 rounded-lg mt-4">
            <h3 className="font-semibold text-blue-800 mb-2">
              ¡Bienvenido, Maestro!
            </h3>
            <p className="text-blue-700">
              Sistema DAL verificó que tienes permisos de docente. Rol actual:{" "}
              {userRole}
            </p>
          </div>
        </div>

        {/* Contenido Asignado - Sección Principal */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Contenido Asignado
            {assignedContents?.data && (
              <span className="text-sm font-normal text-foreground/60 ml-2">
                ({assignedContents.data.length} contenidos)
              </span>
            )}
          </h2>

          {contentsLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : !assignedContents?.data || assignedContents.data.length === 0 ? (
            <Card className="p-8">
              <CardBody className="text-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No tienes contenido asignado
                </h3>
                <p className="text-gray-500">
                  Aún no se te ha asignado ningún contenido educativo. Contacta
                  a los administradores si crees que esto es un error.
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedContents.data.slice(0, 6).map((content: any) => (
                <AssignedContentCard key={content.id} content={content} />
              ))}
            </div>
          )}

          {assignedContents?.data && assignedContents.data.length > 6 && (
            <div className="text-center mt-6">
              <Link href="/main/teacher/content">
                <Button color="primary" variant="light">
                  Ver todos los contenidos ({assignedContents.data.length})
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Ver Todo el Contenido */}
          {canTeach && (
            <Link href="/main/teacher/content">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Mi Contenido Asignado
                      </h3>
                      <p className="text-sm text-gray-600">
                        Contenido educativo asignado
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-700">
                    Revisa y gestiona el contenido educativo que te ha sido
                    asignado por los administradores.
                  </p>
                  <div className="mt-4">
                    <span className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                      Ver Mi Contenido
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Link>
          )}

          {/* Gestión de Estudiantes */}
          {canTeach && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Estudiantes</h3>
                    <p className="text-sm text-gray-600">
                      Gestionar estudiantes
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700">
                  Administra tus grupos de estudiantes y su progreso.
                </p>
                <button
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled
                >
                  Próximamente
                </button>
              </CardBody>
            </Card>
          )}

          {/* Crear Actividades */}
          {canTeach && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <PlusCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Crear Actividades</h3>
                    <p className="text-sm text-gray-600">
                      Nuevas actividades educativas
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700">
                  Crea actividades y tareas para tus estudiantes.
                </p>
                <button
                  className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  disabled
                >
                  Próximamente
                </button>
              </CardBody>
            </Card>
          )}

          {/* Reportes */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Reportes</h3>
                  <p className="text-sm text-gray-600">
                    Progreso de estudiantes
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700">
                Ve el progreso y estadísticas de tus estudiantes.
              </p>
              <button
                className="mt-4 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                disabled
              >
                Próximamente
              </button>
            </CardBody>
          </Card>

          {/* Material Educativo */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Material Educativo</h3>
                  <p className="text-sm text-gray-600">Recursos y materiales</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700">
                Accede a materiales educativos y recursos pedagógicos.
              </p>
              <button
                className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                disabled
              >
                Próximamente
              </button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
