"use client";
import React from "react";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { ReactNode, useState, createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MilkdownProvider } from "@milkdown/react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { AuthErrorProvider } from "@/components/providers/auth-error-provider";

// Tipos para accesibilidad
export type FontSizeOption = "sm" | "base" | "lg";
export type LetterSpacingOption = "normal" | "wide" | "wider";
export type LineSpacingOption = "normal" | "relaxed" | "loose";

interface AccessibilityContextProps {
  fontSize: FontSizeOption;
  setFontSize: (size: FontSizeOption) => void;
  letterSpacing: LetterSpacingOption;
  setLetterSpacing: (spacing: LetterSpacingOption) => void;
  lineSpacing: LineSpacingOption;
  setLineSpacing: (spacing: LineSpacingOption) => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextProps | undefined
>(undefined);

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx)
    throw new Error(
      "useAccessibility debe usarse dentro de AccessibilityProvider"
    );
  return ctx;
}

function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSizeOption>(
    (typeof window !== "undefined" &&
      (localStorage.getItem("globalFontSize") as FontSizeOption)) ||
      "base"
  );
  const [letterSpacing, setLetterSpacing] = useState<LetterSpacingOption>(
    (typeof window !== "undefined" &&
      (localStorage.getItem("globalLetterSpacing") as LetterSpacingOption)) ||
      "normal"
  );
  const [lineSpacing, setLineSpacing] = useState<LineSpacingOption>(
    (typeof window !== "undefined" &&
      (localStorage.getItem("globalLineSpacing") as LineSpacingOption)) ||
      "normal"
  );

  // Sincronizar con localStorage
  React.useEffect(() => {
    localStorage.setItem("globalFontSize", fontSize);
  }, [fontSize]);
  React.useEffect(() => {
    localStorage.setItem("globalLetterSpacing", letterSpacing);
  }, [letterSpacing]);
  React.useEffect(() => {
    localStorage.setItem("globalLineSpacing", lineSpacing);
  }, [lineSpacing]);

  // Cargar valores guardados
  React.useEffect(() => {
    const savedFontSize = localStorage.getItem(
      "globalFontSize"
    ) as FontSizeOption;
    if (savedFontSize) setFontSize(savedFontSize);
    const savedLetterSpacing = localStorage.getItem(
      "globalLetterSpacing"
    ) as LetterSpacingOption;
    if (savedLetterSpacing) setLetterSpacing(savedLetterSpacing);
    const savedLineSpacing = localStorage.getItem(
      "globalLineSpacing"
    ) as LineSpacingOption;
    if (savedLineSpacing) setLineSpacing(savedLineSpacing);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        letterSpacing,
        setLetterSpacing,
        lineSpacing,
        setLineSpacing,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error: any) => {
              // No reintentar si es un error de usuario bloqueado
              if (
                error?.message?.includes("Usuario no activo") ||
                error?.message?.includes("Usuario inactivo") ||
                error?.extensions?.code === "UNAUTHENTICATED"
              ) {
                return false;
              }
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <NextThemesProvider
        attribute="class"
        defaultTheme="unam-light-theme"
        themes={["unam-light-theme", "unam-dark-theme", "contraste"]}
        enableSystem={false}
        storageKey="unam-theme"
      >
        <HeroUIProvider>
          <ToastProvider />
          <AuthProvider>
            <AuthErrorProvider>
              <MilkdownProvider>
                <AccessibilityProvider>{children}</AccessibilityProvider>
              </MilkdownProvider>
            </AuthErrorProvider>
          </AuthProvider>
        </HeroUIProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
