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
    }
  }, [error]);

  // Mantener track del último usuario válido para evitar pérdida de estado
  React.useEffect(() => {
    if (user) {
      setLastValidUser(user);
    } else if (user === null && !isLoading) {
      // Solo limpiar el lastValidUser si el usuario es explícitamente null Y no está cargando
      // Esto evita limpiar el estado prematuramente durante la carga
      setLastValidUser(null);
    }
  }, [user, isLoading]);

  // Estrategia MÁS ESTRICTA: solo usar el usuario actual, no el lastValidUser
  // Esto asegura que cuando el usuario se desautentica, no se mantenga el estado anterior
  const effectiveUser = user;

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
