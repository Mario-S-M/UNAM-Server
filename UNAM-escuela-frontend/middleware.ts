import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Solo loggear en desarrollo para debug
  if (process.env.NODE_ENV === "development") {
    console.log("🛡️ Middleware - Procesando:", request.url);
    console.log(
      "🍪 Middleware - Cookies disponibles:",
      request.cookies
        .getAll()
        .map((c) => ({ name: c.name, hasValue: !!c.value }))
    );
  }

  // Agregar headers de seguridad siempre, pero especialmente en producción
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Verificar y reconfigurar cookie de autenticación si existe
  const token = request.cookies.get("UNAM-INCLUSION-TOKEN");

  if (token) {
    // En producción: Re-establecer con configuración segura optimizada
    // En desarrollo: Asegurar que la cookie se mantiene correctamente
    const cookieConfig =
      process.env.NODE_ENV === "production"
        ? {
            httpOnly: true,
            secure: true,
            sameSite: "lax" as const,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            priority: "high" as const,
          }
        : {
            httpOnly: true,
            secure: false,
            sameSite: "lax" as const,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          };

    response.cookies.set({
      name: "UNAM-INCLUSION-TOKEN",
      value: token.value,
      ...cookieConfig,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("🔒 Middleware - Cookie de auth reconfigurada:", {
        hasToken: !!token.value,
        tokenLength: token.value?.length || 0,
        secure: cookieConfig.secure,
        sameSite: cookieConfig.sameSite,
      });
    }
  } else if (process.env.NODE_ENV === "development") {
    console.log("⚠️ Middleware - No se encontró cookie de autenticación");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
