"use server";

import { cookies } from "next/headers";
import { getCookieConfig } from "../utils/cookie-config";
import { AuthenticatedUserSchema } from "../schemas";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("UNAM-INCLUSION-TOKEN")?.value;

    console.log("🔍 getCurrentUser: Token check", {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? `${token.substring(0, 10)}...` : 'none',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });

    if (!token) {
      console.log("❌ getCurrentUser: No token found");
      return null;
    }

    // Verificar que el token no esté vacío o sea solo espacios
    if (token.trim() === "") {
      console.log("❌ getCurrentUser: Empty token");
      return null;
    }

    

    console.log("🌐 getCurrentUser: Making GraphQL request", {
      endpoint: GRAPHQL_ENDPOINT,
      hasToken: !!token,
      timestamp: new Date().toISOString()
    });

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
                assignedLanguageId
                assignedLanguage {
                  id
                  name
                  isActive
                }
              }
            }
          }
        `,
      }),
    });

    console.log("📡 getCurrentUser: GraphQL response", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      timestamp: new Date().toISOString()
    });

    if (!response.ok) {
      console.log("❌ getCurrentUser: Response not OK", {
        status: response.status,
        statusText: response.statusText
      });
      return null;
    }

    const result = await response.json();
    console.log("📊 getCurrentUser: GraphQL result", {
      hasData: !!result.data,
      hasErrors: !!result.errors,
      hasRevalidate: !!result.data?.revalidate,
      hasUser: !!result.data?.revalidate?.user,
      userRoles: result.data?.revalidate?.user?.roles,
      errors: result.errors,
      timestamp: new Date().toISOString()
    });

    if (result.errors || !result.data?.revalidate) {
      console.log("❌ getCurrentUser: GraphQL errors or no revalidate data", {
        errors: result.errors,
        hasRevalidate: !!result.data?.revalidate
      });
      return null;
    }

    const userData = result.data.revalidate.user;
    console.log("👤 getCurrentUser: User data received", {
      userId: userData?.id,
      userRoles: userData?.roles,
      isActive: userData?.isActive,
      hasRoles: Array.isArray(userData?.roles) && userData.roles.length > 0,
      timestamp: new Date().toISOString()
    });

    // Validar los datos con Zod
    const validatedUser = AuthenticatedUserSchema.parse(userData);
    console.log("✅ getCurrentUser: User validated successfully", {
      userId: validatedUser.id,
      roles: validatedUser.roles,
      timestamp: new Date().toISOString()
    });

    return validatedUser;
  } catch (error) {
    console.log("💥 getCurrentUser: Error occurred", {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error?.constructor?.name,
      timestamp: new Date().toISOString()
    });
    
    // Si hay error de validación, retornar null
    if (error instanceof Error) {
      console.log("❌ getCurrentUser: Returning null due to error", {
        errorMessage: error.message
      });
      return null;
    }
    return null;
  }
}

export async function logoutServerAction() {
  const cookieStore = await cookies();
  
  console.log("🚪 Logout: Starting logout process", {
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });

  // Eliminar cookie con múltiples configuraciones para asegurar que se borre
  cookieStore.delete("UNAM-INCLUSION-TOKEN");

  // Usar configuración optimizada para borrar
  const cookieConfig = getCookieConfig();
  cookieStore.set({
    name: "UNAM-INCLUSION-TOKEN",
    value: "",
    ...cookieConfig,
    maxAge: 0, // Expirar inmediatamente
  });

  // Configuración de fallback para asegurar eliminación
  cookieStore.set({
    name: "UNAM-INCLUSION-TOKEN",
    value: "",
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  
  // Configuración adicional sin domain para producción
  if (process.env.NODE_ENV === "production") {
    cookieStore.set({
      name: "UNAM-INCLUSION-TOKEN",
      value: "",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      priority: "high",
    });
  }
  
  console.log("✅ Logout: Cookie deletion completed");
}
