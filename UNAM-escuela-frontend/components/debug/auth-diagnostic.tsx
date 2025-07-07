"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useCurrentUser } from "@/app/hooks/use-current-user";
import { logoutAction } from "@/app/hooks/use-current-user";
import { usePageProtection } from "@/app/hooks/use-authorization";
import { AuthDAL } from "@/app/dal/auth-dal";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Link,
} from "@heroui/react";
import {
  LogOut,
  User,
  Shield,
  AlertTriangle,
  TestTube,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Componente de diagnóstico para verificar el sistema de autorización
 * Solo usar en desarrollo/debugging
 */
export function AuthDiagnostic() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { data: currentUser, error } = useCurrentUser();
  const [clientCookies, setClientCookies] = useState<string>("");

  // Probar protección de página específica
  const adminDashboardProtection = usePageProtection("/main/admin-dashboard");
  const teacherProtection = usePageProtection("/main/teacher");
  const studentProtection = usePageProtection("/main/student");

  // Leer cookies del cliente
  useEffect(() => {
    const cookies = document.cookie;
    setClientCookies(cookies);
    console.log("🍪 AuthDiagnostic - Cookies del cliente:", cookies);
  }, []);

  const handleLogout = async () => {
    console.log("🔍 AuthDiagnostic - Iniciando logout desde diagnóstico");
    await logoutAction();
  };

  const testPageAccess = (page: string) => {
    const safeUser = user === undefined ? null : user;
    const result = AuthDAL.canAccessPage(safeUser, page);
    console.log(`🔍 AuthDiagnostic - Test acceso a ${page}:`, result);
    return result;
  };

  const checkTokenInCookies = () => {
    const cookies = document.cookie;
    const tokenMatch = cookies.match(/UNAM-INCLUSION-TOKEN=([^;]+)/);
    const hasToken = !!tokenMatch;
    const tokenValue = tokenMatch ? tokenMatch[1] : null;

    console.log("🔍 AuthDiagnostic - Verificando token en cookies:", {
      hasToken,
      tokenLength: tokenValue?.length || 0,
      tokenPreview: tokenValue ? `${tokenValue.substring(0, 20)}...` : null,
    });

    return { hasToken, tokenValue };
  };

  const testTokenWithBackend = async () => {
    const { hasToken, tokenValue } = checkTokenInCookies();

    if (!hasToken || !tokenValue) {
      console.log("❌ No hay token para probar");
      return;
    }

    console.log("🔍 Probando token con backend...");

    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenValue}`,
        },
        body: JSON.stringify({
          query: `
            query Revalidate {
              revalidate {
                token
                user {
                  id
                  fullName
                  email
                  roles
                  isActive
                }
              }
            }
          `,
        }),
      });

      console.log("📡 Respuesta del backend:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      const result = await response.json();
      console.log("📋 Resultado del backend:", {
        hasData: !!result.data,
        hasErrors: !!result.errors,
        errors: result.errors,
        user: result.data?.revalidate?.user,
      });

      if (result.errors) {
        console.error("❌ Error en la validación:", result.errors);
      } else if (result.data?.revalidate?.user) {
        console.log("✅ Token válido, usuario:", result.data.revalidate.user);
      }
    } catch (error) {
      console.error("💥 Error al probar token:", error);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex gap-3">
        <TestTube className="h-6 w-6 text-primary" />
        <div className="flex flex-col">
          <p className="text-md">Diagnóstico Completo de Autenticación</p>
          <p className="text-small text-default-500">
            Estado actual del sistema de autenticación y protección de rutas
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="space-y-6">
        {/* Cookies del cliente */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Cookies del Cliente
          </h4>
          <div className="p-3 border rounded-lg bg-yellow-50">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Todas las cookies:</span>
                <div className="mt-1 p-2 bg-white rounded text-xs font-mono break-all">
                  {clientCookies || "No hay cookies"}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={checkTokenInCookies}
                >
                  Verificar Token
                </Button>
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => {
                    const { hasToken, tokenValue } = checkTokenInCookies();
                    console.log("🔍 Token en cookies:", {
                      hasToken,
                      tokenValue,
                    });
                  }}
                >
                  Debug Token
                </Button>
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={testTokenWithBackend}
                >
                  Probar con Backend
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* Estado del AuthProvider */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            AuthProvider State
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">isLoading:</span>{" "}
              <Chip size="sm" color={isLoading ? "warning" : "success"}>
                {isLoading ? "Cargando..." : "Completado"}
              </Chip>
            </div>
            <div>
              <span className="font-medium">isAuthenticated:</span>{" "}
              <Chip size="sm" color={isAuthenticated ? "success" : "danger"}>
                {isAuthenticated ? "Autenticado" : "No autenticado"}
              </Chip>
            </div>
          </div>
          {user && (
            <div className="mt-2 p-3 bg-success-50 rounded-lg">
              <p className="font-medium">Usuario del AuthProvider:</p>
              <p className="text-sm">ID: {user.id}</p>
              <p className="text-sm">Email: {user.email}</p>
              <p className="text-sm">Roles: {user.roles.join(", ")}</p>
              <p className="text-sm">Activo: {user.isActive ? "Sí" : "No"}</p>
            </div>
          )}
        </div>

        <Divider />

        {/* Estado del useCurrentUser */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            useCurrentUser State
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Tiene datos:</span>{" "}
              <Chip size="sm" color={currentUser ? "success" : "danger"}>
                {currentUser ? "Sí" : "No"}
              </Chip>
            </div>
            <div>
              <span className="font-medium">Tiene error:</span>{" "}
              <Chip size="sm" color={error ? "danger" : "success"}>
                {error ? "Sí" : "No"}
              </Chip>
            </div>
          </div>
          {currentUser && (
            <div className="mt-2 p-3 bg-primary-50 rounded-lg">
              <p className="font-medium">Usuario de useCurrentUser:</p>
              <p className="text-sm">ID: {currentUser.id}</p>
              <p className="text-sm">Email: {currentUser.email}</p>
              <p className="text-sm">Roles: {currentUser.roles.join(", ")}</p>
              <p className="text-sm">
                Activo: {currentUser.isActive ? "Sí" : "No"}
              </p>
            </div>
          )}
          {error && (
            <div className="mt-2 p-3 bg-danger-50 rounded-lg">
              <p className="font-medium text-danger-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Error en useCurrentUser:
              </p>
              <p className="text-sm text-danger-600">{error.message}</p>
            </div>
          )}
        </div>

        <Divider />

        {/* Estado en tiempo real */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Estado en Tiempo Real
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg bg-blue-50">
              <h5 className="font-medium mb-2">AuthProvider</h5>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="font-medium">user:</span>{" "}
                  {user ? `ID: ${user.id}` : "null"}
                </div>
                <div>
                  <span className="font-medium">isLoading:</span>{" "}
                  {isLoading ? "true" : "false"}
                </div>
                <div>
                  <span className="font-medium">isAuthenticated:</span>{" "}
                  {isAuthenticated ? "true" : "false"}
                </div>
                <div>
                  <span className="font-medium">userRoles:</span>{" "}
                  {user?.roles?.join(", ") || "ninguno"}
                </div>
                <div>
                  <span className="font-medium">userIsActive:</span>{" "}
                  {user?.isActive ? "true" : "false"}
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-lg bg-green-50">
              <h5 className="font-medium mb-2">useCurrentUser</h5>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="font-medium">data:</span>{" "}
                  {currentUser ? `ID: ${currentUser.id}` : "null"}
                </div>
                <div>
                  <span className="font-medium">error:</span>{" "}
                  {error ? "true" : "false"}
                </div>
                <div>
                  <span className="font-medium">dataRoles:</span>{" "}
                  {currentUser?.roles?.join(", ") || "ninguno"}
                </div>
                <div>
                  <span className="font-medium">dataIsActive:</span>{" "}
                  {currentUser?.isActive ? "true" : "false"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* Protección de páginas */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Protección de Páginas
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium mb-2">Admin Dashboard</h5>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">Autorizado:</span>{" "}
                  <Chip
                    size="sm"
                    color={
                      adminDashboardProtection.isAuthorized
                        ? "success"
                        : "danger"
                    }
                  >
                    {adminDashboardProtection.isAuthorized ? "Sí" : "No"}
                  </Chip>
                </div>
                <div>
                  <span className="font-medium">Cargando:</span>{" "}
                  <Chip
                    size="sm"
                    color={
                      adminDashboardProtection.isLoading ? "warning" : "success"
                    }
                  >
                    {adminDashboardProtection.isLoading ? "Sí" : "No"}
                  </Chip>
                </div>
                {adminDashboardProtection.authorizationResult?.reason && (
                  <p className="text-xs text-default-500">
                    Razón: {adminDashboardProtection.authorizationResult.reason}
                  </p>
                )}
              </div>
            </div>

            <div className="p-3 border rounded-lg">
              <h5 className="font-medium mb-2">Teacher Panel</h5>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">Autorizado:</span>{" "}
                  <Chip
                    size="sm"
                    color={
                      teacherProtection.isAuthorized ? "success" : "danger"
                    }
                  >
                    {teacherProtection.isAuthorized ? "Sí" : "No"}
                  </Chip>
                </div>
                <div>
                  <span className="font-medium">Cargando:</span>{" "}
                  <Chip
                    size="sm"
                    color={teacherProtection.isLoading ? "warning" : "success"}
                  >
                    {teacherProtection.isLoading ? "Sí" : "No"}
                  </Chip>
                </div>
                {teacherProtection.authorizationResult?.reason && (
                  <p className="text-xs text-default-500">
                    Razón: {teacherProtection.authorizationResult.reason}
                  </p>
                )}
              </div>
            </div>

            <div className="p-3 border rounded-lg">
              <h5 className="font-medium mb-2">Student Panel</h5>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">Autorizado:</span>{" "}
                  <Chip
                    size="sm"
                    color={
                      studentProtection.isAuthorized ? "success" : "danger"
                    }
                  >
                    {studentProtection.isAuthorized ? "Sí" : "No"}
                  </Chip>
                </div>
                <div>
                  <span className="font-medium">Cargando:</span>{" "}
                  <Chip
                    size="sm"
                    color={studentProtection.isLoading ? "warning" : "success"}
                  >
                    {studentProtection.isLoading ? "Sí" : "No"}
                  </Chip>
                </div>
                {studentProtection.authorizationResult?.reason && (
                  <p className="text-xs text-default-500">
                    Razón: {studentProtection.authorizationResult.reason}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* Pruebas de acceso */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Pruebas de Acceso
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              "/main/admin-dashboard",
              "/main/teacher",
              "/main/student",
              "/main/admin-dashboard/users",
            ].map((page) => {
              const result = testPageAccess(page);
              return (
                <Button
                  key={page}
                  size="sm"
                  variant="bordered"
                  onPress={() => testPageAccess(page)}
                  className="text-xs"
                >
                  {page.split("/").pop()}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              );
            })}
          </div>
        </div>

        <Divider />

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            color="danger"
            variant="solid"
            startContent={<LogOut className="h-4 w-4" />}
            onPress={handleLogout}
            className="flex-1"
          >
            Probar Logout
          </Button>

          <Button
            color="primary"
            variant="bordered"
            as={Link}
            href="/main/admin-dashboard"
            className="flex-1"
          >
            Ir a Admin Dashboard
          </Button>
        </div>

        {/* Información adicional */}
        <div className="text-xs text-default-500 text-center">
          <p>
            Este componente ayuda a diagnosticar problemas de autenticación.
          </p>
          <p>
            Después del logout, deberías ser redirigido a la página raíz y no
            poder acceder a rutas protegidas.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
