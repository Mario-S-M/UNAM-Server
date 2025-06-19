// Configuración específica para cookies en producción
export const PRODUCTION_COOKIE_CONFIG = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
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
  return process.env.NODE_ENV === "production" 
    ? PRODUCTION_COOKIE_CONFIG 
    : DEVELOPMENT_COOKIE_CONFIG;
}
