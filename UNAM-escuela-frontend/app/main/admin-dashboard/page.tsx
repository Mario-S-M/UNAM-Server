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
import { AdminDashboardHeader } from "@/components/admin-dashboard/AdminDashboardHeader";
import { AdminQuickNavGrid } from "@/components/admin-dashboard/AdminQuickNavGrid";
import { AdminQuickNavCard } from "@/components/admin-dashboard/AdminQuickNavCard";

export default function AdminDashboardPage() {
  return (
    <RouteGuard requiredPage="/main/admin-dashboard">
      <AdminDashboardContent />
    </RouteGuard>
  );
}

function AdminDashboardContent() {
  const { canManageUsers } = usePermissions();

  const quickNavCards = [
    {
      href: "/main/admin-dashboard/languages",
      icon: <Globe className="h-12 w-12 text-blue-500" />,
      title: "Idiomas",
      description: "Gestionar idiomas disponibles",
      colorClass: "",
    },
    {
      href: "/main/admin-dashboard/levels",
      icon: <GraduationCap className="h-12 w-12 text-green-500" />,
      title: "Niveles",
      description: "Administrar niveles educativos",
      colorClass: "",
    },
    {
      href: "/main/admin-dashboard/contents",
      icon: <BookOpen className="h-12 w-12 text-purple-500" />,
      title: "Contenidos",
      description: "Gestionar contenido educativo",
      colorClass: "",
    },
    {
      href: "/main/admin-dashboard/skills",
      icon: <Palette className="h-12 w-12 text-orange-500" />,
      title: "Skills",
      description: "Administrar habilidades",
      colorClass: "",
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <AdminDashboardHeader
          title="Dashboard Administrativo"
          subtitle="Panel principal de administración del sistema educativo"
          structureDescription={
            "Organización jerárquica: Idiomas → Niveles → Contenidos"
          }
        />
        <AdminQuickNavGrid cards={quickNavCards}>
          {canManageUsers && (
            <AdminQuickNavCard
              href="/main/admin-dashboard/users"
              icon={<Users className="h-12 w-12 text-orange-500" />}
              title="Usuarios"
              description="Administrar usuarios del sistema"
              colorClass=""
            />
          )}
        </AdminQuickNavGrid>
      </div>
    </div>
  );
}
