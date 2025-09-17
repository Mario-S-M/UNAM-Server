"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function EditLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !user.roles.includes('docente'))) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (!user || !user.roles.includes('docente')) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-lg text-red-500">Acceso denegado. Solo docentes pueden acceder.</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background">
      {children}
    </div>
  );
}

export default function EditLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <EditLayoutContent>{children}</EditLayoutContent>
    </AuthProvider>
  );
}