"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { AuthDAL } from "@/app/dal/auth-dal";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { AlertTriangle, Shield, User } from "lucide-react";

/**
 * Componente de diagnóstico para verificar el sistema de autorización
 * Solo usar en desarrollo/debugging
 */
export function AuthDiagnostic() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando diagnóstico...</div>;
  }

  const safeUser = user === undefined ? null : user;
  const highestRole = AuthDAL.getHighestRole(safeUser);
  const userMainPage = AuthDAL.getUserMainPage(safeUser);

  // Verificar acceso a páginas críticas
  const adminDashboardAccess = AuthDAL.canAccessPage(
    safeUser,
    "/main/admin-dashboard"
  );
  const teacherAccess = AuthDAL.canAccessPage(safeUser, "/main/teacher");
  const studentAccess = AuthDAL.canAccessPage(safeUser, "/main/student");

  // Verificar permisos específicos
  const hasAdminPermission = AuthDAL.hasPermission(safeUser, "admin");
  const hasUserManagementPermission = AuthDAL.hasPermission(
    safeUser,
    "user_management"
  );
  const hasContentManagementPermission = AuthDAL.hasPermission(
    safeUser,
    "content_management"
  );
  const hasTeacherPermission = AuthDAL.hasPermission(safeUser, "teacher");

  return (
    <div className="fixed bottom-4 right-4 max-w-md z-50">
      <Card className="border-2 border-orange-200 bg-orange-50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-orange-800">
              Diagnóstico DAL
            </h3>
          </div>
        </CardHeader>
        <CardBody className="text-sm space-y-3">
          {/* Información del usuario */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Usuario:</span>
            </div>
            <div className="ml-6 space-y-1 text-gray-700">
              <p>ID: {safeUser?.id || "No autenticado"}</p>
              <p>Email: {safeUser?.email || "N/A"}</p>
              <p>Activo: {safeUser?.isActive ? "Sí" : "No"}</p>
              <p>Roles: {safeUser?.roles?.join(", ") || "Ninguno"}</p>
              <p>
                Rol Principal: <strong>{highestRole || "Ninguno"}</strong>
              </p>
              <p>
                Página Principal: <strong>{userMainPage}</strong>
              </p>
            </div>
          </div>

          {/* Verificación de permisos */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Permisos:</span>
            </div>
            <div className="ml-6 space-y-1 text-gray-700">
              <div className="flex justify-between">
                <span>Admin:</span>
                <span
                  className={
                    hasAdminPermission ? "text-green-600" : "text-red-600"
                  }
                >
                  {hasAdminPermission ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>User Management:</span>
                <span
                  className={
                    hasUserManagementPermission
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {hasUserManagementPermission ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Content Management:</span>
                <span
                  className={
                    hasContentManagementPermission
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {hasContentManagementPermission ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Teacher:</span>
                <span
                  className={
                    hasTeacherPermission ? "text-green-600" : "text-red-600"
                  }
                >
                  {hasTeacherPermission ? "✓" : "✗"}
                </span>
              </div>
            </div>
          </div>

          {/* Verificación de acceso a páginas */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-purple-800">
                Acceso a Páginas:
              </span>
            </div>
            <div className="ml-6 space-y-1 text-gray-700">
              <div className="flex justify-between">
                <span>Admin Dashboard:</span>
                <span
                  className={
                    adminDashboardAccess.hasAccess
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {adminDashboardAccess.hasAccess ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Teacher Panel:</span>
                <span
                  className={
                    teacherAccess.hasAccess ? "text-green-600" : "text-red-600"
                  }
                >
                  {teacherAccess.hasAccess ? "✓" : "✗"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Student Panel:</span>
                <span
                  className={
                    studentAccess.hasAccess ? "text-green-600" : "text-red-600"
                  }
                >
                  {studentAccess.hasAccess ? "✓" : "✗"}
                </span>
              </div>
            </div>
          </div>

          {/* Información de diagnóstico específica */}
          <div className="pt-2 border-t border-orange-200">
            <p className="text-xs text-orange-700">
              <strong>Estado:</strong>{" "}
              {!adminDashboardAccess.hasAccess && highestRole === "docente"
                ? "✓ CORRECTO - Profesor NO puede acceder al admin panel"
                : adminDashboardAccess.hasAccess && highestRole === "docente"
                ? "❌ ERROR - Profesor SÍ puede acceder al admin panel"
                : "Estado normal"}
            </p>
            {!adminDashboardAccess.hasAccess && (
              <p className="text-xs text-orange-600 mt-1">
                Razón: {adminDashboardAccess.reason}
              </p>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
