"use server";

import { cookies } from "next/headers";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

// Función de utilidad para verificar permisos y roles
export async function checkCurrentUserRoles(): Promise<{
  roles: string[];
  token: string | undefined;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("UNAM-INCLUSION-TOKEN")?.value;

    if (!token) {
      return {
        roles: [],
        token: undefined,
        error: "No se encontró un token de autenticación",
      };
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

    if (!response.ok) {
      return {
        roles: [],
        token,
        error: `Error HTTP: ${response.status} ${response.statusText}`,
      };
    }

    const result = await response.json();

    if (result.errors) {
      return {
        roles: [],
        token,
        error: result.errors.map((err: any) => err.message).join(", "),
      };
    }

    if (!result.data?.revalidate?.user) {
      return {
        roles: [],
        token,
        error: "No se encontró información del usuario en la respuesta",
      };
    }

    return {
      roles: result.data.revalidate.user.roles || [],
      token,
    };
  } catch (error) {
    return {
      roles: [],
      token: undefined,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
