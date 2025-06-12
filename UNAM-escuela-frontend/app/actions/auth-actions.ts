"use server";

import { loginFormSchema, loginResponseSchema } from "../schemas";
import { cookies } from "next/headers";
import { AuthResponse, Login, User } from "../interfaces/auth-interfaces";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export async function loginAction(
  loginInput: Login
): Promise<AuthResponse<User> | never> {
  try {
    if (!loginInput) {
      throw new Error("Es necesario enviar datos en el formulario");
    }

    const validLoginInput = loginFormSchema.safeParse(loginInput);

    if (!validLoginInput.success) {
      throw new Error("Datos de inicio de sesión inválidos");
    }

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

    if (!response.ok) {
      throw new Error("Error al iniciar sesión");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    if (!result.data || !result.data.login) {
      throw new Error("No se recibió respuesta de autenticación");
    }

    const validated = loginResponseSchema.parse(result.data.login);
    if (!validated.token) {
      throw new Error("Token de autenticación inválido");
    }

    const cookieStore = await cookies();
    cookieStore.set({
      name: "UNAM-INCLUSION-TOKEN",
      value: validated.token,
      httpOnly: true,
      path: "/",
    });

    return {
      redirect: {
        destination: "/main/levels/admin",
        type: "replace",
      },
    };
  } catch (error) {
    console.error("Error en loginAction:", error);
    return {
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
