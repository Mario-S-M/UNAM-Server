"use client";

"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useCurrentUser, User } from "@/app/hooks/use-current-user";

interface AuthContextType {
  user: User | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const { data: user, isLoading, error } = useCurrentUser();
  const [lastValidUser, setLastValidUser] = React.useState<User | null>(
    initialUser || null
  );

  // Manejar errores de autenticación
  React.useEffect(() => {
    if (error) {
      // Si es un error de usuario bloqueado, el AuthErrorProvider se encargará
      console.warn("Error de autenticación:", error);
    }
  }, [error]);

  // Mantener track del último usuario válido para evitar pérdida de estado
  React.useEffect(() => {
    if (user) {
      setLastValidUser(user);
      if (process.env.NODE_ENV === "development") {
        console.log("✅ AuthProvider - Usuario actualizado:", {
          id: user.id,
          email: user.email,
          roles: user.roles,
        });
      }
    }
  }, [user]);

  // Log para debug y monitoreo - SIMPLIFICADO para evitar bucles
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔒 AuthProvider - Estado:", {
        hasUser: !!user,
        hasInitialUser: !!initialUser,
        hasLastValidUser: !!lastValidUser,
        isLoading,
        hasError: !!error,
        userRoles: user?.roles || lastValidUser?.roles || initialUser?.roles,
      });
    }
  }, [user, initialUser, lastValidUser, isLoading, error]);

  // Estrategia SIMPLIFICADA: usar el usuario más reciente disponible
  const effectiveUser = user || lastValidUser || initialUser;

  const contextValue: AuthContextType = {
    user: effectiveUser,
    isLoading: isLoading && !effectiveUser,
    isAuthenticated: Boolean(effectiveUser),
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
