"use client";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
        <HeroUIProvider>
          <NextThemesProvider
            attribute="class"
            defaultTheme="unam-light-theme"
            themes={["unam-light-theme", "unam-dark-theme", "contraste"]}
            enableSystem={false}
          >
            <ToastProvider />
            {children}
          </NextThemesProvider>
        </HeroUIProvider>
    </QueryClientProvider>
  );
}
