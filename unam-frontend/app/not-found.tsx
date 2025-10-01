'use client';

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/SideBar-Navigation";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };



  return (
    <DashboardProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <div className="flex items-center gap-2 p-4 border-b">
            <SidebarTrigger className="h-8 w-8" />
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <div className="p-4">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
                <h2 className="text-2xl font-semibold">¡Oops! Estás perdido</h2>
                <p className="text-muted-foreground max-w-md">
                  La página que buscas no existe o ha sido movida. No te preocupes, 
                  te ayudamos a encontrar el camino de regreso.
                </p>
              </div>
              
              <div className="flex justify-center">
                <Button onClick={handleGoToDashboard} className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Ir al Dashboard
                </Button>
              </div>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </DashboardProvider>
  );
}