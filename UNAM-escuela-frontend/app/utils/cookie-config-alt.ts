// Configuración alternativa de cookies para producción sin dominio específico
export const PRODUCTION_COOKIE_CONFIG_ALT = {
  httpOnly: true,
  secure: false, // false porque no usas HTTPS
  sameSite: "lax" as const,
  path: "/",
  // NO especificar dominio para permitir que funcione en cualquier host
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

export function getCookieConfigAlt() {
  return process.env.NODE_ENV === "production"
    ? PRODUCTION_COOKIE_CONFIG_ALT
    : DEVELOPMENT_COOKIE_CONFIG;
}
