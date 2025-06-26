"use client";

/**
 * Utilidades para recuperación de cookies en el cliente
 * Específicamente diseñado para resolver problemas de cookies perdidas en producción
 */

export interface CookieRecoveryOptions {
  token: string;
  maxAge?: number;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

/**
 * Intenta reestablecer la cookie de autenticación desde el cliente
 * Útil cuando la cookie se pierde durante navegaciones
 */
export function reestablishAuthCookie(options: CookieRecoveryOptions): boolean {
  try {
    if (typeof document === "undefined") {
      console.warn(
        "🍪 reestablishAuthCookie - No está disponible en el servidor"
      );
      return false;
    }

    const {
      token,
      maxAge = 60 * 60 * 24 * 7, // 7 días por defecto
      secure = false, // CRÍTICO: false para HTTP en producción
      sameSite = "lax",
    } = options;

    const cookieString = [
      `UNAM-INCLUSION-TOKEN=${token}`,
      `Max-Age=${maxAge}`,
      `Path=/`,
      `SameSite=${sameSite}`,
      ...(process.env.NODE_ENV === "production"
        ? ["Domain=132.247.186.91"]
        : []),
      ...(secure ? ["Secure"] : []),
    ].join("; ");

    document.cookie = cookieString;

    console.log("🔄 reestablishAuthCookie - Cookie reestablecida:", {
      hasToken: !!token,
      tokenLength: token.length,
      secure,
      sameSite,
      maxAge,
    });

    return true;
  } catch (error) {
    console.error("❌ reestablishAuthCookie - Error:", error);
    return false;
  }
}

/**
 * Verifica si la cookie de autenticación está presente en el navegador
 */
export function checkAuthCookie(): { hasToken: boolean; token?: string } {
  try {
    if (typeof document === "undefined") {
      return { hasToken: false };
    }

    const cookies = document.cookie.split(";");
    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("UNAM-INCLUSION-TOKEN=")
    );

    if (authCookie) {
      const token = authCookie.split("=")[1];
      return {
        hasToken: !!token && token !== "",
        token: token || undefined,
      };
    }

    return { hasToken: false };
  } catch (error) {
    console.error("❌ checkAuthCookie - Error:", error);
    return { hasToken: false };
  }
}

/**
 * Estrategia de recuperación automática de cookies
 * Se ejecuta cuando se detecta que se perdió la autenticación
 */
export function attemptCookieRecovery(
  lastKnownToken?: string
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      if (!lastKnownToken) {
        console.log(
          "⚠️ attemptCookieRecovery - No hay token conocido para recuperar"
        );
        resolve(false);
        return;
      }

      // Intentar reestablecer la cookie
      const success = reestablishAuthCookie({ token: lastKnownToken });

      if (success) {
        // Verificar que la cookie se estableció correctamente
        setTimeout(() => {
          const check = checkAuthCookie();
          if (check.hasToken) {
            console.log(
              "✅ attemptCookieRecovery - Cookie recuperada exitosamente"
            );
            resolve(true);
          } else {
            console.log(
              "❌ attemptCookieRecovery - Falló la verificación de cookie"
            );
            resolve(false);
          }
        }, 100); // Pequeño delay para permitir que se establezca
      } else {
        resolve(false);
      }
    } catch (error) {
      console.error("❌ attemptCookieRecovery - Error:", error);
      resolve(false);
    }
  });
}
