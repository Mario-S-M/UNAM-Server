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

    if (!token) {
      console.log("❌ getCurrentUser: No token found");
      return null;
    }

    // Verificar que el token no esté vacío o sea solo espacios
    if (token.trim() === "") {
      console.log("❌ getCurrentUser: Empty token");
      return null;
    }

    console.log("🔍 getCurrentUser: Token present, making request");

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

    if (!response.ok) {
      console.log("❌ getCurrentUser: Response not ok:", response.status);
      return null;
    }

    const result = await response.json();
    console.log("🔍 getCurrentUser: GraphQL response:", result);

    if (result.errors || !result.data?.revalidate) {
      console.log(
        "❌ getCurrentUser: GraphQL errors or no data:",
        result.errors
      );
      return null;
    }

    const userData = result.data.revalidate.user;
    console.log("🔍 getCurrentUser: User data before validation:", userData);

    // Validar los datos con Zod
    const validatedUser = AuthenticatedUserSchema.parse(userData);
    console.log("✅ getCurrentUser: Validated user:", validatedUser);

    return validatedUser;
  } catch (error) {
    console.error("❌ getCurrentUser: Error:", error);
    // Si hay error de validación, retornar null
    if (error instanceof Error) {
      return null;
    }
    return null;
  }
}

export async function logoutServerAction() {
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

  // Eliminar con configuración específica para desarrollo
  if (process.env.NODE_ENV === "development") {
    cookieStore.set({
      name: "UNAM-INCLUSION-TOKEN",
      value: "",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }
}
