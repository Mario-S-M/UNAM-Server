"use server";

import {
  loginFormSchema,
  registerFormSchema,
  loginResponseSchema,
} from "../schemas";
import { cookies } from "next/headers";
import {
  AuthResponse,
  Login,
  Register,
  User,
} from "../interfaces/auth-interfaces";
import { getUserMainPage, getHighestRole } from "../dal/auth-dal-server";
import { getCookieConfig } from "../utils/cookie-config";

// Funciones simples para reemplazar las de cookie-debug
const setCookieWithDebug = async (token: string, isDevelopment: boolean) => {
  try {
    const cookieConfig = getCookieConfig();
    (await cookies()).set("UNAM-INCLUSION-TOKEN", token, cookieConfig);
    console.log(`🍪 Cookie set successfully: UNAM-INCLUSION-TOKEN`);

    return {
      success: true,
      wasSet: true,
      error: null,
    };
  } catch (error) {
    console.error("❌ Error setting cookie:", error);
    return {
      success: false,
      wasSet: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

const debugCookieConfiguration = async () => {
  console.log("🔍 Cookie configuration debug - function simplified");
};

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export async function loginAction(
  loginInput: Login
): Promise<AuthResponse<User>> {
  // ...existing code...

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

    // Debug de configuración antes de guardar
    await debugCookieConfiguration();

    // En desarrollo, usar configuración sin dominio. En producción, intentar primero con dominio
    const isDevelopment = process.env.NODE_ENV === "development";
    let cookieResult = await setCookieWithDebug(validated.token, isDevelopment);

    // Solo en producción, si falló con dominio específico, intentar sin dominio
    if (!isDevelopment && (!cookieResult.success || !cookieResult.wasSet)) {
      console.warn(
        "⚠️ Falló con dominio específico, intentando sin dominio..."
      );
      cookieResult = await setCookieWithDebug(validated.token, true);
    }

    if (!cookieResult.success) {
      console.error("❌ Falló al establecer cookie:", cookieResult.error);
      throw new Error("Error al guardar sesión");
    }

    console.log("🍪 Cookie establecida exitosamente:", cookieResult);

    // Debug de configuración después de guardar
    await debugCookieConfiguration();

    // Usar el DAL para determinar la redirección inteligente
    const redirectPath = getUserMainPage(validated.user);
    const userRole = getHighestRole(validated.user);

    console.log("🎯 Redirección determinada:", { redirectPath, userRole });

    const response_data: AuthResponse<User> = {
      data: validated.user,
      token: validated.token, // Incluir token para recuperación
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

export async function registerAction(
  registerInput: Register
): Promise<AuthResponse<User>> {
  console.log("📝 RegisterAction iniciada con:", {
    email: registerInput.email,
    fullName: registerInput.fullName,
  });

  try {
    if (!registerInput) {
      throw new Error("Es necesario enviar datos en el formulario");
    }

    const validRegisterInput = registerFormSchema.safeParse(registerInput);

    if (!validRegisterInput.success) {
      console.error("❌ Validación fallida:", validRegisterInput.error);
      throw new Error("Datos de registro inválidos");
    }

    console.log("📤 Enviando petición de registro al backend...");
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation Signin($signUpInput: SignupInput!) {
            signin(signUpInput: $signUpInput) {
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
          signUpInput: {
            fullName: validRegisterInput.data.fullName,
            email: validRegisterInput.data.email,
            password: validRegisterInput.data.password,
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

    if (!result.data || !result.data.signin) {
      console.error("❌ No se recibió data.signin:", result);
      throw new Error("No se recibió respuesta de registro");
    }

    const validated = loginResponseSchema.parse(result.data.signin);
    if (!validated.token) {
      throw new Error("Token de autenticación inválido");
    }

    console.log("✅ Registro exitoso, guardando cookie...");

    // Debug de configuración antes de guardar
    await debugCookieConfiguration();

    // En desarrollo, usar configuración sin dominio. En producción, intentar primero con dominio
    const isDevelopment = process.env.NODE_ENV === "development";
    let cookieResult = await setCookieWithDebug(validated.token, isDevelopment);

    // Solo en producción, si falló con dominio específico, intentar sin dominio
    if (!isDevelopment && (!cookieResult.success || !cookieResult.wasSet)) {
      console.warn(
        "⚠️ Falló con dominio específico, intentando sin dominio..."
      );
      cookieResult = await setCookieWithDebug(validated.token, true);
    }

    if (!cookieResult.success) {
      console.error("❌ Falló al establecer cookie:", cookieResult.error);
      throw new Error("Error al guardar sesión");
    }

    console.log("🍪 Cookie establecida exitosamente:", cookieResult);

    // Debug de configuración después de guardar
    await debugCookieConfiguration();

    // Los nuevos usuarios van a la página principal por defecto (rol mortal)
    const redirectPath = "/";

    console.log("🎯 Redirección determinada:", {
      redirectPath,
      role: "mortal",
    });

    const response_data: AuthResponse<User> = {
      data: validated.user,
      token: validated.token, // Incluir token para recuperación
      redirect: {
        destination: redirectPath,
        type: "replace",
      },
    };

    console.log("📤 Retornando respuesta:", response_data);
    return response_data;
  } catch (error) {
    console.error("💥 Error en registerAction:", error);
    const errorResponse: AuthResponse<User> = {
      error: error instanceof Error ? error.message : "Error desconocido",
    };
    console.log("📤 Retornando error:", errorResponse);
    return errorResponse;
  }
}
