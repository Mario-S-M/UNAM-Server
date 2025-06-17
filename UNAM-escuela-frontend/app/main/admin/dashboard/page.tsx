"use client";

import { Card, CardBody, CardHeader, Spinner } from "@heroui/react";
import { Users, BookOpen, Globe, GraduationCap } from "lucide-react";
import Link from "next/link";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";
import { useQuery } from "@tanstack/react-query";
import { getActiveLenguages } from "@/app/actions/lenguage-actions";
import { getLevelsByLenguage } from "@/app/actions/level-actions";
import { getContentsByLevel } from "@/app/actions/content-actions";

export default function AdminDashboardPage() {
  return (
    <RouteGuard requiredPage="/main/admin">
      <AdminDashboardContent />
    </RouteGuard>
  );
}

function AdminDashboardContent() {
  const { canManageUsers, canManageContent, userRole } = usePermissions();

  // Obtener idiomas
  const { data: languages, isLoading: languagesLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: getActiveLenguages,
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Dashboard Educativo
          </h1>
          <p className="text-gray-600">
            Vista general del sistema educativo organizando por Lenguajes →
            Niveles → Contenidos
          </p>

          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 className="font-semibold text-blue-800 mb-2">
              Estructura del Sistema
            </h3>
            <p className="text-blue-700">
              Rol actual: {userRole} | Aquí puedes ver la jerarquía completa:
              Lenguajes → Niveles → Contenidos
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {canManageUsers && (
            <Link href="/main/users">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardBody className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Gestionar Usuarios
                      </h3>
                      <p className="text-gray-600">
                        Administrar usuarios y roles
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          )}

          {canManageContent && (
            <Link href="/main/admin/levels">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardBody className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        Gestión Avanzada
                      </h3>
                      <p className="text-gray-600">
                        Interfaz completa de gestión
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Link>
          )}
        </div>

        {/* Languages and Levels Overview */}
        {canManageContent && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              Lenguajes del Sistema
            </h2>

            {languagesLoading ? (
              <div className="flex justify-center items-center p-8">
                <Spinner size="lg" />
                <span className="ml-4 text-foreground">
                  Cargando lenguajes...
                </span>
              </div>
            ) : (
              <div className="grid gap-6">
                {languages?.data?.map((language) => (
                  <LanguageCard key={language.id} language={language} />
                ))}
                {(!languages?.data || languages.data.length === 0) && (
                  <Card className="p-8">
                    <CardBody className="text-center">
                      <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        No hay lenguajes
                      </h3>
                      <p className="text-gray-500">
                        Aún no se han creado lenguajes en el sistema
                      </p>
                    </CardBody>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface LanguageCardProps {
  language: {
    id: string;
    name: string;
    description?: string;
  };
}

function LanguageCard({ language }: LanguageCardProps) {
  const { data: levels, isLoading: levelsLoading } = useQuery({
    queryKey: ["levels", language.id],
    queryFn: () => getLevelsByLenguage(language.id),
    enabled: !!language.id,
  });

  return (
    <Card className="p-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{language.name}</h3>
              <p className="text-gray-600 text-sm">
                {language.description || "Sin descripción"}
              </p>
            </div>
          </div>
          <Link href={`/main/admin/levels?language=${language.id}`}>
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer px-4 py-2">
              <span className="text-sm font-medium text-primary">
                Gestionar
              </span>
            </Card>
          </Link>
        </div>
      </CardHeader>

      <CardBody className="pt-0">
        {levelsLoading ? (
          <div className="flex items-center justify-center py-4">
            <Spinner size="sm" />
            <span className="ml-2 text-sm text-gray-600">
              Cargando niveles...
            </span>
          </div>
        ) : (
          <div className="grid gap-3">
            {levels?.data?.slice(0, 4).map((level) => (
              <LevelSummaryCard key={level.id} level={level} />
            ))}
            {levels?.data && levels.data.length > 4 && (
              <div className="text-center py-2">
                <span className="text-sm text-gray-500">
                  +{levels.data.length - 4} niveles más
                </span>
              </div>
            )}
            {(!levels?.data || levels.data.length === 0) && (
              <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                <GraduationCap className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm">
                  No hay niveles creados para este lenguaje
                </p>
                <Link
                  href={`/main/admin/levels?language=${language.id}`}
                  className="text-xs text-primary hover:underline"
                >
                  Crear primer nivel
                </Link>
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

interface LevelSummaryCardProps {
  level: {
    id: string;
    name: string;
    description?: string;
  };
}

function LevelSummaryCard({ level }: LevelSummaryCardProps) {
  const { data: contents, isLoading: contentsLoading } = useQuery({
    queryKey: ["contents", level.id],
    queryFn: () => getContentsByLevel(level.id),
    enabled: !!level.id,
  });

  const contentCount = contents?.data?.length || 0;
  const publishedCount =
    contents?.data?.filter((c) => c.status === "published").length || 0;

  return (
    <Card className="p-4 border border-gray-200 hover:border-primary transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <GraduationCap className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium">{level.name}</h4>
            <p className="text-xs text-gray-600">
              {level.description || "Sin descripción"}
            </p>
          </div>
        </div>
        <div className="text-right">
          {contentsLoading ? (
            <Spinner size="sm" />
          ) : (
            <div>
              <span className="text-sm font-semibold text-primary">
                {contentCount}
              </span>
              <p className="text-xs text-gray-500">contenidos</p>
              {publishedCount > 0 && (
                <p className="text-xs text-green-600">
                  {publishedCount} publicados
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
