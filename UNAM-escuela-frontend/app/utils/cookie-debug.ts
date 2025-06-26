/**
 * Configuración específica para producción - debugging de cookies
 * Para ayudar a diagnosticar problemas de cookies en el servidor 132.247.186.91
 */

"use server";

import { cookies } from "next/headers";

export async function debugCookieConfiguration() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const authCookie = cookieStore.get("UNAM-INCLUSION-TOKEN");

    console.log("🔍 DEBUG COOKIE CONFIGURATION:", {
      nodeEnv: process.env.NODE_ENV,
      totalCookies: allCookies.length,
      allCookieNames: allCookies.map((c) => c.name),
      hasAuthCookie: !!authCookie,
      authCookieValue: authCookie ? "***EXISTS***" : "NOT_FOUND",
      graphqlEndpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      timestamp: new Date().toISOString(),
    });

    return {
      hasAuthCookie: !!authCookie,
      cookieCount: allCookies.length,
      environment: process.env.NODE_ENV,
    };
  } catch (error) {
    console.error("❌ Error debugging cookies:", error);
    return {
      hasAuthCookie: false,
      cookieCount: 0,
      environment: process.env.NODE_ENV,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function setCookieWithDebug(token: string, useAltConfig = false) {
  try {
    console.log("🍪 Setting cookie with debug info...");
    const cookieStore = await cookies();

    // Usar configuración alternativa si se especifica
    const cookieOptions = useAltConfig
      ? {
          name: "UNAM-INCLUSION-TOKEN",
          value: token,
          httpOnly: true,
          secure: false, // CRÍTICO: false para HTTP
          sameSite: "lax" as const,
          path: "/",
          // NO especificar dominio
          maxAge: 60 * 60 * 24 * 7, // 7 días
        }
      : {
          name: "UNAM-INCLUSION-TOKEN",
          value: token,
          httpOnly: true,
          secure: false, // CRÍTICO: false para HTTP
          sameSite: "lax" as const,
          path: "/",
          domain: "132.247.186.91", // Dominio específico
          maxAge: 60 * 60 * 24 * 7, // 7 días
        };

    console.log("🍪 Cookie options:", {
      ...cookieOptions,
      value: "***TOKEN***",
      configType: useAltConfig ? "WITHOUT_DOMAIN" : "WITH_DOMAIN",
    });

    cookieStore.set(cookieOptions);

    // Verificar que se estableció
    const verification = cookieStore.get("UNAM-INCLUSION-TOKEN");
    console.log("✅ Cookie verification:", {
      wasSet: !!verification,
      hasValue: !!verification?.value,
    });

    return { success: true, wasSet: !!verification };
  } catch (error) {
    console.error("❌ Error setting cookie:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
