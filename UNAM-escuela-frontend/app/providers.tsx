"use client";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloProvider } from "@apollo/client";
import client from "@/src/lib/apollo-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ApolloProvider client={client}>
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
      </ApolloProvider>
    </QueryClientProvider>
  );
}
