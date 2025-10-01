"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !user.roles.includes('admin') && !user.roles.includes('superUser'))) {
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

  if (!user || (!user.roles.includes('admin') && !user.roles.includes('superUser'))) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-500">Acceso denegado. Solo administradores pueden acceder.</div>
      </div>
    );
  }

  return (
    <SidebarProvider style={{"--sidebar-width": "12rem"} as React.CSSProperties}>
      <AdminSidebar />
      <main className="flex-1">
        <div className="flex items-center gap-2 px-6 py-4 border-b">
          <SidebarTrigger className="h-8 w-8" />
          <h1 className="text-lg font-semibold">Panel Administrativo</h1>
        </div>
        <div>
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutContent>{children}</AdminLayoutContent>
  );
}