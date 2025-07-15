/**
 * Configuración específica para cookies en producción sin SSL
 * Soluciona problemas comunes con cookies en servidores HTTP
 */

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
  domain?: string;
  maxAge?: number;
  priority?: 'low' | 'medium' | 'high';
}

/**
 * Configuración optimizada para producción HTTP (sin SSL)
 */
export const PRODUCTION_HTTP_COOKIE_CONFIG: CookieOptions = {
  httpOnly: true,
  secure: false, // CRÍTICO: false para HTTP
  sameSite: 'lax', // Más permisivo para HTTP
  path: '/',
  // NO especificar domain para evitar problemas cross-domain
  maxAge: 60 * 60 * 24 * 7, // 7 días
  priority: 'high',
};

/**
 * Configuración de fallback para casos problemáticos
 */
export const FALLBACK_COOKIE_CONFIG: CookieOptions = {
  httpOnly: false, // Menos seguro pero más compatible
  secure: false,
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 1, // Solo 1 día para fallback
};

/**
 * Obtiene la configuración de cookie apropiada según el entorno
 */
export function getOptimizedCookieConfig(useFallback = false): CookieOptions {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (useFallback) {
    console.log('🔄 Using fallback cookie configuration');
    return FALLBACK_COOKIE_CONFIG;
  }
  
  if (isProduction) {
    console.log('🏭 Using production HTTP cookie configuration');
    return PRODUCTION_HTTP_COOKIE_CONFIG;
  }
  
  // Desarrollo
  console.log('🛠️ Using development cookie configuration');
  return {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}

/**
 * Valida si una cookie está configurada correctamente
 */
export function validateCookieConfig(config: CookieOptions): boolean {
  // En producción HTTP, secure DEBE ser false
  if (process.env.NODE_ENV === 'production' && config.secure === true) {
    console.warn('⚠️ Cookie config warning: secure=true in HTTP production');
    return false;
  }
  
  // sameSite debe ser compatible con el entorno
  if (config.sameSite === 'none' && !config.secure) {
    console.warn('⚠️ Cookie config warning: sameSite=none requires secure=true');
    return false;
  }
  
  return true;
}

/**
 * Logs de depuración para cookies
 */
export function logCookieDebugInfo(cookieName: string, cookieValue?: string, config?: CookieOptions) {
  console.log(`🍪 Cookie Debug [${cookieName}]:`, {
    hasCookie: !!cookieValue,
    cookieLength: cookieValue?.length || 0,
    cookiePreview: cookieValue ? `${cookieValue.substring(0, 10)}...` : 'none',
    config,
    environment: process.env.NODE_ENV,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    timestamp: new Date().toISOString(),
  });
}