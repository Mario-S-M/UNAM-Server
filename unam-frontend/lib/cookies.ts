/**
 * Utility functions for handling cookies in the browser
 */

/**
 * Set a cookie with the given name, value, and options
 */
export function setCookie(name: string, value: string, days: number = 7): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  // En producción con HTTP, no usar Secure flag
  const isSecure = window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secureFlag}`;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  
  return null;
}

/**
 * Remove a cookie by name
 */
export function removeCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

/**
 * Check if cookies are available in the browser
 */
export function areCookiesAvailable(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }
  
  try {
    // Try to set a test cookie
    document.cookie = 'test=1';
    const cookiesEnabled = document.cookie.indexOf('test=') !== -1;
    // Clean up test cookie
    document.cookie = 'test=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    return cookiesEnabled;
  } catch {
    return false;
  }
}