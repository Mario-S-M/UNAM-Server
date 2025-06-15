"use server";

import { loginFormSchema, loginResponseSchema } from "../schemas";
import { cookies } from "next/headers";
import { AuthResponse, Login, User } from "../interfaces/auth-interfaces";
import { getUserMainPage, getHighestRole } from "../dal/auth-dal-server";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export async function loginAction(
  loginInput: Login
): Promise<AuthResponse<User>> {
  console.log("🔐 LoginAction iniciada con:", { email: loginInput.email });

  try {
    if (!loginInput) {
      throw new Error("Es necesario enviar datos en el formulario");
    }

    const validLoginInput = loginFormSchema.safeParse(loginInput);

    if (!validLoginInput.success) {
      console.error("❌ Validación fallida:", validLoginInput.error);
      throw new Error("Datos de inicio de sesión inválidos");
    }

    console.log("📤 Enviando petición al backend...");
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation Login($loginInput: LoginInput!) {
            login(loginInput: $loginInput) {
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
        variables: {
          loginInput: {
            email: validLoginInput.data.email,
            password: validLoginInput.data.password,
          },
        },
      }),
    });

    console.log(
      "📡 Respuesta del servidor:",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      throw new Error(
        `Error del servidor: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("📋 Datos recibidos del backend:", result);

    if (result.errors) {
      console.error("❌ Errores del GraphQL:", result.errors);
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    if (!result.data || !result.data.login) {
      console.error("❌ No se recibió data.login:", result);
      throw new Error("No se recibió respuesta de autenticación");
    }

    const validated = loginResponseSchema.parse(result.data.login);
    if (!validated.token) {
      throw new Error("Token de autenticación inválido");
    }

    console.log("✅ Login exitoso, guardando cookie...");
    const cookieStore = await cookies();
    cookieStore.set({
      name: "UNAM-INCLUSION-TOKEN",
      value: validated.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // Usar el DAL para determinar la redirección inteligente
    const redirectPath = getUserMainPage(validated.user);
    const userRole = getHighestRole(validated.user);

    console.log("🎯 Redirección determinada:", { redirectPath, userRole });

    const response_data: AuthResponse<User> = {
      data: validated.user,
      redirect: {
        destination: redirectPath,
        type: "replace",
      },
    };

    console.log("📤 Retornando respuesta:", response_data);
    return response_data;
  } catch (error) {
    console.error("💥 Error en loginAction:", error);
    const errorResponse: AuthResponse<User> = {
      error: error instanceof Error ? error.message : "Error desconocido",
    };
    console.log("📤 Retornando error:", errorResponse);
    return errorResponse;
  }
}
