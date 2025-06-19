"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useCurrentUser, User } from "@/app/hooks/use-current-user";
import {
  checkAuthCookie,
  attemptCookieRecovery,
} from "@/app/utils/cookie-recovery";

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
  const { data: user, isLoading, error, refetch } = useCurrentUser();
  const [lastValidUser, setLastValidUser] = React.useState<User | null>(
    initialUser || null
  );
  const [lastKnownToken, setLastKnownToken] = React.useState<string | null>(
    null
  );
  const [recoveryAttempted, setRecoveryAttempted] = React.useState(false);

  // Mantener track del último usuario válido para evitar pérdida de estado
  React.useEffect(() => {
    if (user) {
      setLastValidUser(user);
      setRecoveryAttempted(false); // Reset recovery flag cuando tenemos usuario
      console.log("✅ AuthProvider - Usuario actualizado:", {
        id: user.id,
        email: user.email,
        roles: user.roles,
      });
    }
  }, [user]);

  // Detectar pérdida de cookies y intentar recuperación
  React.useEffect(() => {
    const checkAndRecover = async () => {
      // Solo intentar en el navegador
      if (typeof window === "undefined") return;

      // Si tenemos un usuario válido previamente pero ahora no
      if (lastValidUser && !user && !isLoading && !recoveryAttempted) {
        console.log(
          "🚨 AuthProvider - Detectada pérdida de sesión, verificando cookies..."
        );

        const cookieCheck = checkAuthCookie();

        if (!cookieCheck.hasToken && lastKnownToken) {
          console.log(
            "🔄 AuthProvider - Intentando recuperar cookie perdida..."
          );
          setRecoveryAttempted(true);

          const recovered = await attemptCookieRecovery(lastKnownToken);

          if (recovered) {
            console.log(
              "✅ AuthProvider - Cookie recuperada, refrescando usuario..."
            );
            // Esperar un poco y luego hacer refetch
            setTimeout(() => {
              refetch();
            }, 500);
          } else {
            console.log("❌ AuthProvider - No se pudo recuperar la cookie");
          }
        }
      }
    };

    checkAndRecover();
  }, [
    user,
    lastValidUser,
    isLoading,
    lastKnownToken,
    recoveryAttempted,
    refetch,
  ]);

  // Log para debug y monitoreo
  React.useEffect(() => {
    const logLevel =
      process.env.NODE_ENV === "development" ? "debug" : "production";

    if (logLevel === "debug" || error) {
      console.log("🔒 AuthProvider - Estado completo:", {
        hasUser: !!user,
        hasInitialUser: !!initialUser,
        hasLastValidUser: !!lastValidUser,
        isLoading,
        hasError: !!error,
        errorMessage: error?.message,
        recoveryAttempted,
        userRoles: user?.roles || lastValidUser?.roles || initialUser?.roles,
      });
    }
  }, [user, initialUser, lastValidUser, isLoading, error, recoveryAttempted]);

  // Estrategia mejorada: usar el usuario más reciente disponible
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
