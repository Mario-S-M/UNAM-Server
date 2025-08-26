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
import { GraduationCap, FileText, LogOut, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { GET_MY_ASSIGNED_CONTENTS } from "@/lib/graphql/contentGraphqlSchema";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Content {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  levelId: string;
  userId: string;
  markdownPath: string;
  validationStatus: string;
  publishedAt?: string;
  skill: {
    id: string;
    name: string;
    description: string;
    color: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  skillId: string;
  assignedTeachers: {
    id: string;
    fullName: string;
    email: string;
    roles: string[];
    isActive: boolean;
  }[];
}

const MY_ASSIGNED_CONTENTS_QUERY = gql`${GET_MY_ASSIGNED_CONTENTS}`;

export default function TeacherSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const { data, loading, error } = useQuery<{ myAssignedContents: Content[] }>(
    MY_ASSIGNED_CONTENTS_QUERY,
    {
      errorPolicy: 'all',
      onError: (error) => {
        console.error('Error fetching assigned contents:', error);
        toast.error('Error al cargar contenidos asignados');
      }
    }
  );

  const assignedContents = data?.myAssignedContents || [];

  const handleContentClick = (contentId: string) => {
    router.push(`/teacher/content/${contentId}`);
  };

  return (
    <Sidebar className="w-64" style={{"--sidebar-width": "16rem"} as React.CSSProperties}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GraduationCap className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">UNAM Docente</span>
                <span className="truncate text-xs">Panel de Profesor</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <div className="px-4 py-2">
          <h3 className="text-sm font-medium text-sidebar-foreground mb-3">
            Contenidos Asignados
          </h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2 text-xs text-muted-foreground">Cargando...</span>
            </div>
          ) : error ? (
            <div className="text-xs text-red-500 py-2">
              Error al cargar contenidos
            </div>
          ) : assignedContents.length === 0 ? (
            <div className="text-xs text-muted-foreground py-2">
              No tienes contenidos asignados
            </div>
          ) : (
            <SidebarMenu>
              {assignedContents.map((content) => {
                const isActive = pathname === `/teacher/content/${content.id}`;
                
                return (
                  <SidebarMenuItem key={content.id}>
                    <SidebarMenuButton
                      onClick={() => handleContentClick(content.id)}
                      className={`w-full justify-start p-3 ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div 
                          className="h-3 w-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: content.skill?.color || '#6B7280' }}
                        />
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-medium text-sm truncate">{content.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {content.skill?.name || 'Sin skill'}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge 
                              variant={content.validationStatus === 'validado' ? 'default' : 'secondary'}
                              className="text-xs px-1 py-0"
                            >
                              {content.validationStatus === 'validado' ? 'Validado' : 'Sin validar'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          )}
        </div>
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