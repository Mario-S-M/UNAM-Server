"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { BlockedUserModal } from "@/components/auth/blocked-user-modal";
import { AuthErrorMonitor } from "@/components/auth/auth-error-monitor";

interface AuthErrorContextType {
  showBlockedUserModal: (userName?: string) => void;
  hideBlockedUserModal: () => void;
  handleAuthError: (error: any) => boolean; // retorna true si maneja el error
}

const AuthErrorContext = createContext<AuthErrorContextType | undefined>(
  undefined
);

interface AuthErrorProviderProps {
  children: ReactNode;
}

export function AuthErrorProvider({ children }: AuthErrorProviderProps) {
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [blockedUserName, setBlockedUserName] = useState<string>();

  const showBlockedUserModal = useCallback((userName?: string) => {
    setBlockedUserName(userName);
    setIsBlockedModalOpen(true);
  }, []);

  const hideBlockedUserModal = useCallback(() => {
    setIsBlockedModalOpen(false);
    setBlockedUserName(undefined);
  }, []);

  const handleAuthError = useCallback(
    (error: any): boolean => {
      // Verificar si es un error de usuario bloqueado
      if (
        error?.message?.includes("Usuario no activo") ||
        error?.message?.includes("Usuario inactivo") ||
        error?.extensions?.code === "UNAUTHENTICATED" ||
        error?.message?.includes("Unauthorized")
      ) {
        showBlockedUserModal();
        return true;
      }

      // Verificar errores de GraphQL
      if (error?.graphQLErrors?.length > 0) {
        const hasBlockedError = error.graphQLErrors.some(
          (err: any) =>
            err.message?.includes("Usuario no activo") ||
            err.message?.includes("Usuario inactivo")
        );
        if (hasBlockedError) {
          showBlockedUserModal();
          return true;
        }
      }

      return false;
    },
    [showBlockedUserModal]
  );

  return (
    <AuthErrorContext.Provider
      value={{
        showBlockedUserModal,
        hideBlockedUserModal,
        handleAuthError,
      }}
    >
      <AuthErrorMonitor />
      {children}
      <BlockedUserModal
        isOpen={isBlockedModalOpen}
        onClose={hideBlockedUserModal}
        userName={blockedUserName}
      />
    </AuthErrorContext.Provider>
  );
}

export function useAuthError() {
  const context = useContext(AuthErrorContext);
  if (context === undefined) {
    throw new Error("useAuthError must be used within an AuthErrorProvider");
  }
  return context;
}
