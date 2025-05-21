'use server';

import { client } from "@/lib/apollo-client";
import { LOGIN } from "../queries";
import { loginFormSchema, loginResponseSchema } from "../schemas";
import { cookies } from "next/headers";
import { AuthResponse, Login, User } from "../interfaces/auth-interfaces";

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

    const { data } = await client.mutate<{ login: { token: string } }>({
      mutation: LOGIN,
      variables: {
        loginInput: {
          email: validLoginInput.data.email,
          password: validLoginInput.data.password,
        },
      },
    });

    if (!data || !data.login) {
      throw new Error("No se recibió respuesta de autenticación");
    }

    const validated = loginResponseSchema.parse(data.login);
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
        type: "replace"
      }
    };
  } catch (error) {
    console.error("Error en loginAction:", error);
    return {
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}