// Configuración específica para cookies en producción
export const PRODUCTION_COOKIE_CONFIG = {
  httpOnly: true,
  secure: false, // CAMBIO CRÍTICO: false porque tu servidor no usa HTTPS
  sameSite: "lax" as const,
  path: "/",
  // REMOVIDO domain específico para evitar problemas de cross-domain
  // domain: "132.247.186.91", 
  maxAge: 60 * 60 * 24 * 7, // 7 días
  priority: "high" as const,
} as const;

export const DEVELOPMENT_COOKIE_CONFIG = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 días
} as const;

export function getCookieConfig() {
  const config = process.env.NODE_ENV === "production"
    ? PRODUCTION_COOKIE_CONFIG
    : DEVELOPMENT_COOKIE_CONFIG;
  
  console.log("🍪 Cookie config:", {
    environment: process.env.NODE_ENV,
    config,
    timestamp: new Date().toISOString()
  });
  
  return config;
}
