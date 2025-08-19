"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Languages, Users, Settings, LogOut, User, GraduationCap, Zap, FileText } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Idiomas",
      icon: Languages,
      href: "/admin/idiomas"
    },
    {
      title: "Niveles",
      icon: GraduationCap,
      href: "/admin/niveles"
    },
    {
      title: "Skills",
      icon: Zap,
      href: "/admin/skills"
    },
    {
      title: "Contenido",
      icon: FileText,
      href: "/admin/contenido"
    },
    {
      title: "Usuarios",
      icon: Users,
      href: "/admin/usuarios"
    },
    {
      title: "Configuración",
      icon: Settings,
      href: "/admin/configuracion"
    }
  ];

  return (
    <Sidebar className="w-48" style={{"--sidebar-width": "12rem"} as React.CSSProperties}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">UNAM Admin</span>
                <span className="truncate text-xs">Panel Administrativo</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  onClick={() => router.push(item.href)}
                  className={`w-full justify-start p-3 ${
                    isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.title}</div>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        {user && (
          <div className="px-4 py-2 space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.fullName}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {user.roles.map((role) => (
                <Badge key={role} variant="secondary" className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}