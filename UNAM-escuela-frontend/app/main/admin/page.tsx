"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { Users, BookOpen, Settings, BarChart3 } from "lucide-react";
import Link from "next/link";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";

export default function AdminDashboard() {
  return (
    <RouteGuard requiredPage="/main/admin">
      <AdminDashboardContent />
    </RouteGuard>
  );
}

function AdminDashboardContent() {
  const { canAccessAdminPanel, canManageUsers, canManageContent, userRole } =
    usePermissions();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">Gestiona el sistema desde aquí.</p>

          <div className="bg-orange-100 p-4 rounded-lg mt-4">
            <h3 className="font-semibold text-orange-800 mb-2">
              ¡Panel de Administración!
            </h3>
            <p className="text-orange-700">
              Sistema DAL verificó que tienes permisos de administrador. Rol
              actual: {userRole}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gestión de Usuarios */}
          {canManageUsers && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Usuarios</h3>
                    <p className="text-sm text-gray-600">
                      Gestionar usuarios del sistema
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700">
                  Administra usuarios, roles y permisos del sistema.
                </p>
                <Link
                  href="/main/users"
                  className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Gestionar Usuarios
                </Link>
              </CardBody>
            </Card>
          )}

          {/* Gestión de Contenido */}
          {canManageContent && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Gestión de Niveles
                    </h3>
                    <p className="text-sm text-gray-600">
                      Administrar niveles y contenido
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700">
                  Administra niveles, contenido educativo y asignación de
                  profesores.
                </p>
                <Link
                  href="/main/admin/levels"
                  className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Gestionar Niveles
                </Link>
              </CardBody>
            </Card>
          )}

          {/* Gestión de Contenido Tradicional */}
          {canManageContent && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Contenido Tradicional
                    </h3>
                    <p className="text-sm text-gray-600">
                      Vista tradicional de niveles
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700">
                  Accede a la vista tradicional de gestión de contenido.
                </p>
                <Link
                  href="/main/levels"
                  className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Vista Tradicional
                </Link>
              </CardBody>
            </Card>
          )}

          {/* Reportes */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Reportes</h3>
                  <p className="text-sm text-gray-600">
                    Estadísticas y análisis
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700">
                Ve estadísticas de uso y progreso de los estudiantes.
              </p>
              <button
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                disabled
              >
                Próximamente
              </button>
            </CardBody>
          </Card>

          {/* Panel Debug */}
          {canAccessAdminPanel && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-red-200">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 p-3 rounded-full">
                    <Settings className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Debug Panel</h3>
                    <p className="text-sm text-gray-600">Panel de debugging</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700">
                  Accede al panel de debugging avanzado.
                </p>
                <Link
                  href="/main/admin-debug"
                  className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Debug Panel
                </Link>
              </CardBody>
            </Card>
          )}

          {/* Configuración */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Settings className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Configuración</h3>
                  <p className="text-sm text-gray-600">Ajustes del sistema</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700">
                Configura parámetros generales del sistema.
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
