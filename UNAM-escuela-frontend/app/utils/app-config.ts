/**
 * Configuración específica para producción
 * Mejoras para el manejo de cookies y autenticación en build de producción
 */

export const PRODUCTION_CONFIG = {
  // Configuración de cookies
  cookies: {
    secure: false, // CRÍTICO: false porque no usas HTTPS
    sameSite: "lax" as const,
    httpOnly: true,
    path: "/",
    domain: "132.247.186.91", // Dominio específico para producción
    maxAge: 60 * 60 * 24 * 7, // 7 días
    priority: "high" as const,
  },

  // Configuración de autenticación
  auth: {
    tokenRefreshInterval: 1000 * 60 * 5, // 5 minutos
    maxRetries: 3,
    retryDelay: 1000, // 1 segundo
  },

  // Configuración de GraphQL
  graphql: {
    timeout: 10000, // 10 segundos
    retries: 2,
  },

  // Headers de seguridad
  securityHeaders: {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "origin-when-cross-origin",
    "X-XSS-Protection": "1; mode=block",
  },
} as const;

export const DEVELOPMENT_CONFIG = {
  // Configuración de cookies
  cookies: {
    secure: false,
    sameSite: "lax" as const,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  },

  // Configuración de autenticación
  auth: {
    tokenRefreshInterval: 1000 * 60 * 1, // 1 minuto para desarrollo
    maxRetries: 1,
    retryDelay: 500, // 0.5 segundos
  },

  // Configuración de GraphQL
  graphql: {
    timeout: 5000, // 5 segundos
    retries: 1,
  },

  // Headers de seguridad (menos restrictivos en desarrollo)
  securityHeaders: {},
} as const;

export function getAppConfig() {
  return process.env.NODE_ENV === "production"
    ? PRODUCTION_CONFIG
    : DEVELOPMENT_CONFIG;
}
