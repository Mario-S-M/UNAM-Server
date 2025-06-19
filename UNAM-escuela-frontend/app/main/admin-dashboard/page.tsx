"use client";

import { Card, CardBody, CardHeader, Spinner } from "@heroui/react";
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
            Dashboard Administrativo
          </h1>
          <p className="text-foreground/70">
            Panel principal de administración - Vista general del sistema
            educativo
          </p>

          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg mt-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Estructura del Sistema
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              Organización jerárquica:{" "}
              <strong>Lenguajes → Niveles → Contenidos</strong>
            </p>
          </div>
        </div>

        {/* Navegación Rápida */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/main/admin-dashboard/languages">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardBody className="p-6 text-center">
                <Globe className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Lenguajes</h3>
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

        {/* Vista Jerárquica del Sistema */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Vista General del Sistema
          </h2>

          {languagesLoading ? (
            <div className="flex justify-center items-center h-32">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {languages?.data?.map((language: any) => (
                <LanguageCard key={language.id} language={language} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface LanguageCardProps {
  language: any;
}

function LanguageCard({ language }: LanguageCardProps) {
  const { data: levels, isLoading: levelsLoading } = useQuery({
    queryKey: ["levels", language.id],
    queryFn: () => getLevelsByLenguage(language.id),
  });

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Globe className="h-6 w-6 text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold">{language.name}</h3>
            <p className="text-sm text-foreground/60">{language.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        {levelsLoading ? (
          <div className="flex justify-center py-4">
            <Spinner size="sm" />
          </div>
        ) : (
          <div className="space-y-3">
            {levels?.data?.map((level: any) => (
              <LevelSummaryCard key={level.id} level={level} />
            ))}
            {(!levels?.data || levels.data.length === 0) && (
              <p className="text-sm text-foreground/50 text-center py-4">
                No hay niveles disponibles
              </p>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

interface LevelSummaryCardProps {
  level: any;
}

function LevelSummaryCard({ level }: LevelSummaryCardProps) {
  const { data: contents, isLoading: contentsLoading } = useQuery({
    queryKey: ["contents", level.id],
    queryFn: () => getContentsByLevel(level.id),
  });

  return (
    <div className="bg-default-50 dark:bg-default-100/20 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-green-500" />
          <span className="font-medium text-sm">{level.name}</span>
        </div>
        <span className="text-xs text-foreground/50">{level.difficulty}</span>
      </div>

      {contentsLoading ? (
        <div className="flex justify-center py-2">
          <Spinner size="sm" />
        </div>
      ) : (
        <div className="text-xs text-foreground/60">
          {contents?.data?.length || 0} contenido(s) disponible(s)
          {contents?.data && contents.data.length > 0 && (
            <div className="mt-2 space-y-1">
              {contents.data.slice(0, 3).map((content: any) => (
                <div key={content.id} className="flex items-center gap-2">
                  <BookOpen className="h-3 w-3 text-purple-400" />
                  <span className="text-xs truncate">{content.name}</span>
                </div>
              ))}
              {contents.data.length > 3 && (
                <p className="text-xs text-foreground/40 italic">
                  +{contents.data.length - 3} más...
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
