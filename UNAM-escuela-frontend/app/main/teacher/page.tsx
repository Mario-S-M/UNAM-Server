"use client";

import { Card, CardBody, CardHeader, Button, Spinner } from "@heroui/react";
import { BookOpen } from "lucide-react";
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
  const { canTeach, userRole } = usePermissions();

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
            Gestiona tu contenido educativo asignado.
          </p>
        </div>

        {/* Contenido Asignado - Sección Principal */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Contenido Asignado
            {assignedContents && (
              <span className="text-sm font-normal text-foreground/60 ml-2">
                ({assignedContents.length} contenidos)
              </span>
            )}
          </h2>

          {contentsLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : !assignedContents || assignedContents.length === 0 ? (
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
              {assignedContents.map((content: any) => (
                <AssignedContentCard key={content.id} content={content} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
