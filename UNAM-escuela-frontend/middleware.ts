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

  // Agregar headers de seguridad para producción
  if (process.env.NODE_ENV === "production") {
    // Headers de seguridad
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "origin-when-cross-origin");
    response.headers.set("X-XSS-Protection", "1; mode=block");

    // Verificar y reconfigurar cookie de autenticación si existe
    const token = request.cookies.get("UNAM-INCLUSION-TOKEN");
    if (token) {
      // Re-establecer la cookie con configuración segura optimizada
      response.cookies.set({
        name: "UNAM-INCLUSION-TOKEN",
        value: token.value,
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        priority: "high",
      });

      if (process.env.NODE_ENV !== "production") {
        console.log(
          "🔒 Middleware - Cookie de auth reconfigurada para producción"
        );
      }
    }
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
