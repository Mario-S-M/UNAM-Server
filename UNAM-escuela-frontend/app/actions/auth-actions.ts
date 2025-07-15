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
import { getOptimizedCookieConfig, logCookieDebugInfo } from "../utils/production-cookie-fix";

// Funciones simples para reemplazar las de cookie-debug
const setCookieWithDebug = async (token: string, isDevelopment: boolean) => {
  try {
    // Usar configuración optimizada para producción
    const cookieConfig = getOptimizedCookieConfig();
    logCookieDebugInfo("UNAM-INCLUSION-TOKEN", token, cookieConfig);
    
    (await cookies()).set("UNAM-INCLUSION-TOKEN", token, cookieConfig);
    
    console.log("✅ Cookie set successfully", {
      environment: process.env.NODE_ENV,
      isDevelopment,
      tokenLength: token.length,
      config: cookieConfig,
      timestamp: new Date().toISOString()
    });
    

    return {
      success: true,
      wasSet: true,
      error: null,
    };
  } catch (error) {
    
    return {
      success: false,
      wasSet: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

const debugCookieConfiguration = async () => {
  
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
      throw new Error(
        `Error del servidor: ${response.status} ${response.statusText}`
      );
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

    

    // Debug de configuración antes de guardar
    await debugCookieConfiguration();

    // En desarrollo, usar configuración sin dominio. En producción, intentar primero con dominio
    const isDevelopment = process.env.NODE_ENV === "development";
    let cookieResult = await setCookieWithDebug(validated.token, isDevelopment);

    // Solo en producción, si falló con dominio específico, intentar sin dominio
    if (!isDevelopment && (!cookieResult.success || !cookieResult.wasSet)) {
      
      cookieResult = await setCookieWithDebug(validated.token, true);
    }

    if (!cookieResult.success) {
      
      throw new Error("Error al guardar sesión");
    }

    

    // Debug de configuración después de guardar
    await debugCookieConfiguration();

    // Usar el DAL para determinar la redirección inteligente
    const redirectPath = getUserMainPage(validated.user);
    const userRole = getHighestRole(validated.user);

    

    const response_data: AuthResponse<User> = {
      data: validated.user,
      token: validated.token, // Incluir token para recuperación
      redirect: {
        destination: redirectPath,
        type: "replace",
      },
    };

    
    return response_data;
  } catch (error) {
    
    const errorResponse: AuthResponse<User> = {
      error: error instanceof Error ? error.message : "Error desconocido",
    };
    
    return errorResponse;
  }
}

export async function registerAction(
  registerInput: Register
): Promise<AuthResponse<User>> {
  

  try {
    if (!registerInput) {
      throw new Error("Es necesario enviar datos en el formulario");
    }

    const validRegisterInput = registerFormSchema.safeParse(registerInput);

    if (!validRegisterInput.success) {
      
      throw new Error("Datos de registro inválidos");
    }

    
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

    

    if (!response.ok) {
      throw new Error(
        `Error del servidor: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    

    if (result.errors) {
      
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    if (!result.data || !result.data.signin) {
      
      throw new Error("No se recibió respuesta de registro");
    }

    const validated = loginResponseSchema.parse(result.data.signin);
    if (!validated.token) {
      throw new Error("Token de autenticación inválido");
    }

    

    // Debug de configuración antes de guardar
    await debugCookieConfiguration();

    // En desarrollo, usar configuración sin dominio. En producción, intentar primero con dominio
    const isDevelopment = process.env.NODE_ENV === "development";
    let cookieResult = await setCookieWithDebug(validated.token, isDevelopment);

    // Solo en producción, si falló con dominio específico, intentar sin dominio
    if (!isDevelopment && (!cookieResult.success || !cookieResult.wasSet)) {
      
      cookieResult = await setCookieWithDebug(validated.token, true);
    }

    if (!cookieResult.success) {
      
      throw new Error("Error al guardar sesión");
    }

    

    // Debug de configuración después de guardar
    await debugCookieConfiguration();

    // Los nuevos usuarios van a la página principal por defecto (rol mortal)
    const redirectPath = "/";

    

    const response_data: AuthResponse<User> = {
      data: validated.user,
      token: validated.token, // Incluir token para recuperación
      redirect: {
        destination: redirectPath,
        type: "replace",
      },
    };

    
    return response_data;
  } catch (error) {
    
    const errorResponse: AuthResponse<User> = {
      error: error instanceof Error ? error.message : "Error desconocido",
    };
    
    return errorResponse;
  }
}
