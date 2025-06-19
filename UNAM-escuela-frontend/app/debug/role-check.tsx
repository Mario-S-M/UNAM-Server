"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Spinner } from "@heroui/react";
import { checkCurrentUserRoles } from "./role-debug";

export default function RoleCheck() {
  const [roleInfo, setRoleInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoles() {
      try {
        setLoading(true);
        const result = await checkCurrentUserRoles();
        setRoleInfo(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    fetchRoles();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Diagnóstico de Roles y Permisos
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
            <span className="ml-4">Cargando información de roles...</span>
          </div>
        ) : error ? (
          <Card className="mb-6 border-red-300">
            <CardHeader className="bg-red-50 text-red-700">
              <h2 className="font-bold">Error</h2>
            </CardHeader>
            <CardBody>
              <p>{error}</p>
            </CardBody>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader className="bg-blue-50">
                <h2 className="text-xl font-bold text-blue-700">
                  Información del usuario
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold mb-1">Roles:</h3>
                    <div className="flex flex-wrap gap-2">
                      {roleInfo?.roles?.length > 0 ? (
                        roleInfo.roles.map((role: string) => (
                          <span
                            key={role}
                            className={`px-3 py-1 text-sm rounded-full ${
                              role === "superUser"
                                ? "bg-red-100 text-red-700"
                                : role === "admin"
                                ? "bg-amber-100 text-amber-700"
                                : role === "docente"
                                ? "bg-blue-100 text-blue-700"
                                : role === "alumno"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">
                          No se encontraron roles
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold mb-1">Token:</h3>
                    {roleInfo?.token ? (
                      <div className="bg-gray-50 p-2 rounded overflow-auto max-h-32">
                        <p className="text-xs font-mono break-all">
                          {roleInfo.token}
                        </p>
                      </div>
                    ) : (
                      <p className="text-red-500">
                        No se encontró token de autenticación
                      </p>
                    )}
                  </div>

                  {roleInfo?.error && (
                    <div className="mt-4">
                      <h3 className="font-bold text-red-600 mb-1">Error:</h3>
                      <p className="text-red-600">{roleInfo.error}</p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="bg-green-50">
                <h2 className="text-xl font-bold text-green-700">
                  Próximos pasos
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <p>
                    Para que un usuario pueda asignar profesores, debe tener uno
                    de estos roles:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <span className="font-mono bg-red-100 px-2 py-0.5 rounded">
                        superUser
                      </span>{" "}
                      - Tiene todos los permisos
                    </li>
                    <li>
                      <span className="font-mono bg-amber-100 px-2 py-0.5 rounded">
                        admin
                      </span>{" "}
                      - Debe poder asignar profesores
                    </li>
                  </ul>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mt-4">
                    <p className="text-blue-700">
                      Si tienes el rol correcto pero sigues sin poder asignar
                      profesores, es posible que exista un problema en la
                      configuración del backend.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
