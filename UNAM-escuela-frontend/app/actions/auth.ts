"use server";

import { cookies } from "next/headers";
import { getCookieConfig } from "../utils/cookie-config";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("UNAM-INCLUSION-TOKEN")?.value;

    console.log("🔍 getCurrentUser - Verificando token:", {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      nodeEnv: process.env.NODE_ENV,
    });

    if (!token) {
      console.log("❌ getCurrentUser - No hay token disponible");
      return null;
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query Revalidate {
            revalidate {
              token
              user {
                id
                fullName
                email
                roles
                isActive
              }
            }
          }
        `,
      }),
    });

    console.log("📡 getCurrentUser - Respuesta del backend:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      console.log("❌ getCurrentUser - Respuesta no OK del backend");
      return null;
    }

    const result = await response.json();
    console.log("📋 getCurrentUser - Datos recibidos:", {
      hasData: !!result.data,
      hasRevalidate: !!result.data?.revalidate,
      hasUser: !!result.data?.revalidate?.user,
      hasErrors: !!result.errors,
      errors: result.errors,
    });

    if (result.errors || !result.data?.revalidate) {
      console.log(
        "❌ getCurrentUser - Error en GraphQL o datos inválidos:",
        result.errors
      );
      return null;
    }

    console.log("✅ getCurrentUser - Usuario autenticado:", {
      id: result.data.revalidate.user.id,
      email: result.data.revalidate.user.email,
      roles: result.data.revalidate.user.roles,
    });

    return result.data.revalidate.user;
  } catch (error) {
    console.error("💥 getCurrentUser - Error:", error);
    return null;
  }
}

export async function logoutServerAction() {
  console.log("🚪 logoutServerAction - Eliminando cookie...");
  const cookieStore = await cookies();
  const cookieConfig = getCookieConfig();

  // Eliminar cookie con múltiples configuraciones para asegurar que se borre
  cookieStore.delete("UNAM-INCLUSION-TOKEN");

  // También intentar borrar con configuraciones específicas por si hay problemas
  cookieStore.set({
    name: "UNAM-INCLUSION-TOKEN",
    value: "",
    ...cookieConfig,
    maxAge: 0, // Expirar inmediatamente
  });

  console.log("✅ logoutServerAction - Cookie eliminada");
}
