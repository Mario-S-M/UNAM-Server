"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { BookOpen, Users, PlusCircle, BarChart3 } from "lucide-react";
import Link from "next/link";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mis Niveles */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Mis Niveles</h3>
                  <p className="text-sm text-gray-600">
                    Gestionar niveles y contenido
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700">
                Administra tus niveles educativos y actividades.
              </p>
              <Link
                href="/main/levels"
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Ver Niveles
              </Link>
            </CardBody>
          </Card>

          {/* Crear Contenido */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <PlusCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Crear Contenido</h3>
                  <p className="text-sm text-gray-600">
                    Nuevo nivel o actividad
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700">
                Crea nuevos niveles y actividades educativas.
              </p>
              <button
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled
              >
                Próximamente
              </button>
            </CardBody>
          </Card>

          {/* Mis Estudiantes */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Mis Estudiantes</h3>
                  <p className="text-sm text-gray-600">
                    Progreso y estadísticas
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700">
                Ve el progreso de tus estudiantes.
              </p>
              <button
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                disabled
              >
                Próximamente
              </button>
            </CardBody>
          </Card>

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
                    Estadísticas de aprendizaje
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700">
                Analiza el rendimiento de tu contenido.
              </p>
              <button
                className="mt-4 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
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
