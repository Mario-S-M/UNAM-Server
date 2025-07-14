"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { BookOpen, Trophy, User, BarChart3 } from "lucide-react";
import Link from "next/link";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";

export default function StudentDashboard() {
  return (
    <RouteGuard requiredPage="/main/student">
      <StudentDashboardContent />
    </RouteGuard>
  );
}

function StudentDashboardContent() {
  const { canStudy, userRole } = usePermissions();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Mi Panel de Aprendizaje
          </h1>
          <p className="text-gray-600">Continúa tu aprendizaje desde aquí.</p>

          <div className="bg-green-100 p-4 rounded-lg mt-4">
            <h3 className="font-semibold text-green-800 mb-2">
              ¡Bienvenido, Estudiante!
            </h3>
            <p className="text-green-700">
              Sistema DAL verificó que tienes permisos de estudiante. Rol
              actual: {userRole}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mis Cursos */}
          {canStudy && (
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Mis Cursos</h3>
                    <p className="text-sm text-gray-600">Niveles disponibles</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700">
                  Accede a todos los niveles y actividades de aprendizaje.
                </p>
                <Link
                  href="/main/levels"
                  className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Ver Cursos
                </Link>
              </CardBody>
            </Card>
          )}

          {/* Mi Progreso */}
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Mi Progreso</h3>
                  <p className="text-sm text-gray-600">
                    Estadísticas personales
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700">
                Ve tu progreso en cada nivel y actividad.
              </p>
              <button
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled
              >
                Próximamente
              </button>
            </CardBody>
          </Card>

          {/* Mis Logros */}
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Mis Logros</h3>
                  <p className="text-sm text-gray-600">
                    Certificados y premios
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700">
                Revisa tus certificados y logros obtenidos.
              </p>
              <button
                className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                disabled
              >
                Próximamente
              </button>
            </CardBody>
          </Card>

          {/* Mi Perfil */}
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Mi Perfil</h3>
                  <p className="text-sm text-gray-600">Información personal</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700">
                Actualiza tu información y preferencias.
              </p>
              <button
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
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
