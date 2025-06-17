"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, Spinner, Button } from "@heroui/react";
import { BookOpen, ArrowRight } from "lucide-react";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";

export default function AdminDebugPage() {
  return (
    <RouteGuard requiredPage="/main/admin">
      <AdminDebugContent />
    </RouteGuard>
  );
}

function AdminDebugContent() {
  const { canManageContent } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    // Redirect to the integrated content management page after a brief moment
    const redirectTimer = setTimeout(() => {
      router.push("/main/admin/levels");
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  if (!canManageContent) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Card className="max-w-md">
          <CardBody className="text-center py-8">
            <p className="text-default-500">
              No tienes permisos para acceder a esta página.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Sistema de Gestión de Contenido Educativo
              </h1>
              <p className="text-default-600 mt-1">
                Redirigiendo al panel integrado de administración...
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody className="pt-4">
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <Spinner size="lg" color="primary" />

            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                Sistema Integrado de Gestión
              </h3>
              <p className="text-default-600 max-w-md">
                Te estamos redirigiendo al nuevo sistema integrado donde podrás:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-default-50 dark:bg-default-100 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-medium text-sm text-foreground mb-1">
                    Gestionar Lenguajes
                  </h4>
                  <p className="text-xs text-default-600">
                    Crear y administrar idiomas disponibles
                  </p>
                </div>

                <div className="bg-default-50 dark:bg-default-100 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <ArrowRight className="h-8 w-8 text-secondary" />
                  </div>
                  <h4 className="font-medium text-sm text-foreground mb-1">
                    Gestionar Niveles
                  </h4>
                  <p className="text-xs text-default-600">
                    Organizar niveles por cada lenguaje
                  </p>
                </div>

                <div className="bg-default-50 dark:bg-default-100 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen className="h-8 w-8 text-success" />
                  </div>
                  <h4 className="font-medium text-sm text-foreground mb-1">
                    Gestionar Contenidos
                  </h4>
                  <p className="text-xs text-default-600">
                    Crear contenido y asignar profesores
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-default-200 space-y-3">
                <Button
                  color="primary"
                  variant="solid"
                  onClick={() => router.push("/main/admin/levels")}
                  startContent={<ArrowRight className="h-4 w-4" />}
                  className="font-medium"
                >
                  Ir Ahora al Panel Principal
                </Button>
                <p className="text-xs text-default-500">
                  O espera 3 segundos para redirección automática
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
