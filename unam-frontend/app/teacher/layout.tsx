"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import TeacherSidebar from "@/components/TeacherSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function TeacherLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !user.roles.includes('docente'))) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (!user || !user.roles.includes('docente')) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-500">Acceso denegado. Solo docentes pueden acceder.</div>
      </div>
    );
  }

  return (
    <SidebarProvider style={{"--sidebar-width": "16rem"} as React.CSSProperties}>
      <TeacherSidebar />
      <main className="flex-1">
        <div className="flex items-center gap-2 px-6 py-4 border-b">
          <SidebarTrigger className="h-8 w-8" />
          <h1 className="text-lg font-semibold">Panel de Docente</h1>
        </div>
        <div>
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <TeacherLayoutContent>{children}</TeacherLayoutContent>
  );
}