"use client";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MilkdownProvider } from "@milkdown/react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { AuthErrorProvider } from "@/components/providers/auth-error-provider";

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
              <MilkdownProvider>{children}</MilkdownProvider>
            </AuthErrorProvider>
          </AuthProvider>
        </HeroUIProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
