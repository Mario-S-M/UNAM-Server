"use client";

import { createContext, useContext, ReactNode } from "react";
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
  const { data: user, isLoading } = useCurrentUser();

  const contextValue: AuthContextType = {
    user: user !== undefined ? user : initialUser,
    isLoading: isLoading && user === undefined && !initialUser,
    isAuthenticated: Boolean(user || initialUser),
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
