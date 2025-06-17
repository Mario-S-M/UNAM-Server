"use client";

import Link from "next/link";
import { usePermissions } from "@/app/hooks/use-authorization";
import { Card, CardBody } from "@heroui/react";
import {
  Home,
  Users,
  BookOpen,
  Settings,
  BarChart3,
  GraduationCap,
  Trophy,
  User,
  Bug,
} from "lucide-react";

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  permission?: string;
  roles?: string[];
}

/**
 * Componente de navegación basado en roles usando el DAL
 */
export function RoleBasedNavigation() {
  const {
    canAccessAdminPanel,
    canAccessDebugPanel,
    canManageUsers,
    canManageContent,
    canTeach,
    canStudy,
    userRole,
    userMainPage,
  } = usePermissions();

  // Definir todas las opciones de navegación
  const navigationItems: NavigationItem[] = [
    // Opciones para todos los usuarios autenticados
    {
      href: userMainPage,
      label: "Panel Principal",
      icon: <Home className="h-5 w-5" />,
      description: "Ir a tu panel principal",
      color: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    },

    // Opciones para Super Usuarios y Admins
    {
      href: "/main/admin-dashboard",
      label: "Dashboard Admin",
      icon: <Settings className="h-5 w-5" />,
      description: "Panel principal de administración",
      color: "bg-blue-100 text-blue-600 hover:bg-blue-200",
    },
    {
      href: "/main/admin-debug",
      label: "Panel Debug",
      icon: <Bug className="h-5 w-5" />,
      description: "Panel de debugging avanzado",
      color: "bg-red-100 text-red-600 hover:bg-red-200",
      permission: "debug",
    },

    // Gestión de usuarios
    {
      href: "/main/users",
      label: "Gestionar Usuarios",
      icon: <Users className="h-5 w-5" />,
      description: "Administrar usuarios y roles",
      color: "bg-blue-100 text-blue-600 hover:bg-blue-200",
    },

    // Gestión de contenido
    {
      href: "/main/levels",
      label: "Gestionar Contenido",
      icon: <BookOpen className="h-5 w-5" />,
      description: "Administrar niveles y actividades",
      color: "bg-green-100 text-green-600 hover:bg-green-200",
    },

    // Opciones para maestros
    {
      href: "/main/teacher",
      label: "Panel del Maestro",
      icon: <GraduationCap className="h-5 w-5" />,
      description: "Herramientas para docentes",
      color: "bg-purple-100 text-purple-600 hover:bg-purple-200",
    },

    // Opciones para estudiantes
    {
      href: "/main/student",
      label: "Panel del Estudiante",
      icon: <Trophy className="h-5 w-5" />,
      description: "Tu progreso y actividades",
      color: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
    },

    // Reportes
    {
      href: "/main/reports",
      label: "Reportes",
      icon: <BarChart3 className="h-5 w-5" />,
      description: "Estadísticas y análisis",
      color: "bg-indigo-100 text-indigo-600 hover:bg-indigo-200",
    },
  ];

  // Filtrar elementos basado en permisos
  const allowedItems = navigationItems.filter((item) => {
    // Si no hay restricciones, mostrar siempre
    if (!item.permission && !item.roles) {
      return true;
    }

    // Verificar permisos específicos
    if (item.permission) {
      switch (item.permission) {
        case "debug":
          return canAccessDebugPanel;
        default:
          return false;
      }
    }

    // Verificar por URL/funcionalidad específica
    switch (item.href) {
      case "/main/admin":
      case "/main/admin-debug":
      case "/main/admin-dashboard":
        return canAccessAdminPanel;
      case "/main/users":
        return canManageUsers;
      case "/main/levels":
        return canManageContent || canTeach || canStudy;
      case "/main/teacher":
        return canTeach;
      case "/main/student":
        return canStudy;
      case "/main/reports":
        return canAccessAdminPanel || canTeach;
      default:
        return true;
    }
  });

  if (allowedItems.length === 0) {
    return (
      <Card className="p-4">
        <CardBody>
          <p className="text-gray-500 text-center">
            No hay opciones de navegación disponibles para tu rol.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Navegación Rápida
        </h3>
        <p className="text-sm text-gray-600">
          Accesos directos basados en tu rol:{" "}
          <span className="font-medium">{userRole}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {allowedItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block transition-all duration-200 hover:scale-105"
          >
            <Card
              className={`${item.color} border-2 border-transparent hover:border-gray-300`}
            >
              <CardBody className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">
                      {item.label}
                    </h4>
                    <p className="text-xs opacity-80 truncate">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Componente simplificado de navegación para usar en headers/sidebars
 */
export function QuickNavigation() {
  const { userMainPage, userRole } = usePermissions();

  return (
    <div className="flex items-center space-x-2">
      <Link
        href={userMainPage}
        className="text-sm px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
      >
        Mi Panel ({userRole})
      </Link>
    </div>
  );
}
