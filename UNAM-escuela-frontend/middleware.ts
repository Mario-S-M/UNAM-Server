import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Solo ejecutar acciones específicas en desarrollo
  if (process.env.NODE_ENV === "development") {
    // Desarrollo: no hay acciones específicas por ahora
  }

  // Agregar headers de seguridad siempre, pero especialmente en producción
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Verificar y reconfigurar cookie de autenticación si existe y es válida
  const token = request.cookies.get("UNAM-INCLUSION-TOKEN");

  if (token && token.value && token.value.trim() !== "") {
    // Solo reconfigurar si la cookie tiene un valor válido

    // En producción: Re-establecer con configuración segura optimizada
    // En desarrollo: Asegurar que la cookie se mantiene correctamente
    const cookieConfig =
      process.env.NODE_ENV === "production"
        ? {
            httpOnly: true,
            secure: false, // CRÍTICO: false porque no usas HTTPS
            sameSite: "lax" as const,
            path: "/",
            // REMOVIDO domain específico para evitar problemas
            // domain: "132.247.186.91",
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

    console.log("🔧 Middleware: Reconfiguring cookie", {
      environment: process.env.NODE_ENV,
      hasToken: !!token?.value,
      tokenLength: token?.value?.length || 0,
      cookieConfig,
      timestamp: new Date().toISOString()
    });

    response.cookies.set({
      name: "UNAM-INCLUSION-TOKEN",
      value: token.value,
      ...cookieConfig,
    });
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
