"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { Users, BookOpen, Settings, BarChart3 } from "lucide-react";
import Link from "next/link";
import { RouteGuard } from "@/components/auth/route-guard";
import { useAuthorization } from "@/app/hooks/use-authorization";

export default function AdminDashboardDebug() {
  return (
    <RouteGuard requiredPage="/main/admin-debug">
      <AdminDashboardContent />
    </RouteGuard>
  );
}

function AdminDashboardContent() {
  const { user, getHighestRole, hasPermission, canPerformOperation } =
    useAuthorization();

  const userRole = getHighestRole();
  const canManageUsers = canPerformOperation("read", "users");
  const canManageContent = canPerformOperation("read", "content");

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Debug Admin Dashboard
          </h1>

          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">
              Estado de autenticación (DAL):
            </h3>
            <p>
              <strong>user:</strong> {user ? "existe" : "null"}
            </p>
            {user && (
              <>
                <p>
                  <strong>fullName:</strong> {user.fullName}
                </p>
                <p>
                  <strong>email:</strong> {user.email}
                </p>
                <p>
                  <strong>roles:</strong> {JSON.stringify(user.roles)}
                </p>
                <p>
                  <strong>isActive:</strong> {user.isActive ? "true" : "false"}
                </p>
                <p>
                  <strong>Rol más alto:</strong> {userRole}
                </p>
              </>
            )}
          </div>

          <div className="bg-blue-100 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">
              Verificación de permisos (DAL):
            </h3>
            <p>
              <strong>Permiso debug:</strong>{" "}
              {hasPermission("debug") ? "SÍ" : "NO"}
            </p>
            <p>
              <strong>Permiso admin:</strong>{" "}
              {hasPermission("admin") ? "SÍ" : "NO"}
            </p>
            <p>
              <strong>Puede gestionar usuarios:</strong>{" "}
              {canManageUsers ? "SÍ" : "NO"}
            </p>
            <p>
              <strong>Puede gestionar contenido:</strong>{" "}
              {canManageContent ? "SÍ" : "NO"}
            </p>
          </div>

          <div className="bg-green-100 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-green-800 mb-2">
              ¡Acceso concedido por DAL!
            </h3>
            <p>
              El sistema DAL verificó que el usuario tiene permisos de
              administrador.
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
                    <h3 className="font-semibold text-lg">Contenido</h3>
                    <p className="text-sm text-gray-600">
                      Gestionar niveles y actividades
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700">
                  Administra niveles, lenguajes y contenido educativo.
                </p>
                <Link
                  href="/main/levels"
                  className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Gestionar Contenido
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

          {/* Configuración del Sistema */}
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
                Configura parámetros globales del sistema.
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
