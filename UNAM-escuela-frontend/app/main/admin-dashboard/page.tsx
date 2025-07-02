"use client";

import { Card, CardBody } from "@heroui/react";
import {
  Users,
  BookOpen,
  Globe,
  GraduationCap,
  ArrowRight,
  Palette,
} from "lucide-react";
import Link from "next/link";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";

export default function AdminDashboardPage() {
  return (
    <RouteGuard requiredPage="/main/admin">
      <AdminDashboardContent />
    </RouteGuard>
  );
}

function AdminDashboardContent() {
  const { canManageUsers } = usePermissions();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Dashboard Administrativo
          </h1>
          <p className="text-foreground/70">
            Panel principal de administración del sistema educativo
          </p>

          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg mt-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Estructura del Sistema
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              Organización jerárquica:{" "}
              <strong>Idiomas → Niveles → Contenidos</strong>
            </p>
          </div>
        </div>

        {/* Navegación Rápida */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/main/admin-dashboard/languages">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardBody className="p-6 text-center">
                <Globe className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Idiomas</h3>
                <p className="text-sm text-foreground/60">
                  Gestionar idiomas disponibles
                </p>
                <ArrowRight className="h-4 w-4 text-primary mt-2 mx-auto" />
              </CardBody>
            </Card>
          </Link>

          <Link href="/main/admin-dashboard/levels">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardBody className="p-6 text-center">
                <GraduationCap className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Niveles</h3>
                <p className="text-sm text-foreground/60">
                  Administrar niveles educativos
                </p>
                <ArrowRight className="h-4 w-4 text-primary mt-2 mx-auto" />
              </CardBody>
            </Card>
          </Link>

          <Link href="/main/admin-dashboard/contents">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardBody className="p-6 text-center">
                <BookOpen className="h-12 w-12 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Contenidos</h3>
                <p className="text-sm text-foreground/60">
                  Gestionar contenido educativo
                </p>
                <ArrowRight className="h-4 w-4 text-primary mt-2 mx-auto" />
              </CardBody>
            </Card>
          </Link>

          <Link href="/main/admin-dashboard/skills">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardBody className="p-6 text-center">
                <Palette className="h-12 w-12 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Skills</h3>
                <p className="text-sm text-foreground/60">
                  Administrar habilidades
                </p>
                <ArrowRight className="h-4 w-4 text-primary mt-2 mx-auto" />
              </CardBody>
            </Card>
          </Link>

          {canManageUsers && (
            <Link href="/main/admin-dashboard/users">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardBody className="p-6 text-center">
                  <Users className="h-12 w-12 text-orange-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Usuarios</h3>
                  <p className="text-sm text-foreground/60">
                    Administrar usuarios del sistema
                  </p>
                  <ArrowRight className="h-4 w-4 text-primary mt-2 mx-auto" />
                </CardBody>
              </Card>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
