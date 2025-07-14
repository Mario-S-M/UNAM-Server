// Adjust the import to match the actual export from './graphql-client'
import testGraphQLConnection from "./graphql-client";

/**
 * Utilidad para debugging de problemas con contenidos
 * Proporciona herramientas para diagnosticar errores de carga de contenido
 */

export interface ContentDiagnostic {
  contentId: string;
  timestamp: string;
  checks: {
    idFormat: boolean;
    fileExists: boolean;
    hasPermissions: boolean;
    serverReachable: boolean;
  };
  recommendations: string[];
  debugInfo: any;
}

export class ContentDebugger {
  /**
   * Realiza un diagnóstico completo de un contenido
   */
  static async diagnoseContent(contentId: string): Promise<ContentDiagnostic> {
    console.log("🔍 Iniciando diagnóstico de contenido:", contentId);

    const diagnostic: ContentDiagnostic = {
      contentId,
      timestamp: new Date().toISOString(),
      checks: {
        idFormat: false,
        fileExists: false,
        hasPermissions: false,
        serverReachable: false,
      },
      recommendations: [],
      debugInfo: {},
    };

    // 1. Verificar formato del ID
    diagnostic.checks.idFormat = this.isValidUUID(contentId);
    if (!diagnostic.checks.idFormat) {
      diagnostic.recommendations.push(
        "El ID del contenido no es un UUID válido. Verifica que la URL sea correcta."
      );
    }

    // 2. Verificar si el servidor está alcanzable
    try {
      const connectionTest = await testGraphQLConnection();
      diagnostic.checks.serverReachable =
        connectionTest.success && connectionTest.serverReachable;
      diagnostic.debugInfo.connectionTest = connectionTest;
    } catch (error) {
      diagnostic.checks.serverReachable = false;
      diagnostic.recommendations.push(
        "No se puede conectar al servidor. Verifica tu conexión a internet."
      );
      diagnostic.debugInfo.connectionError = error;
    }

    // 3. Verificar permisos básicos (cookies, token)
    diagnostic.checks.hasPermissions = this.checkBasicAuth();
    if (!diagnostic.checks.hasPermissions) {
      diagnostic.recommendations.push(
        "No se encontró token de autenticación. Intenta iniciar sesión nuevamente."
      );
    }

    // 4. Generar recomendaciones específicas
    this.generateRecommendations(diagnostic);

    console.log("✅ Diagnóstico completado:", diagnostic);
    return diagnostic;
  }

  /**
   * Verifica si un string es un UUID válido
   */
  private static isValidUUID(id: string): boolean {
    if (!id || typeof id !== "string") return false;
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  /**
   * Verifica autenticación básica
   */
  private static checkBasicAuth(): boolean {
    if (typeof document === "undefined") return false;

    // Verificar si hay cookies de autenticación
    const cookies = document.cookie;
    const hasToken = cookies.includes("UNAM-INCLUSION-TOKEN");

    console.log("🔍 Cookies disponibles:", cookies);
    console.log("🔍 Token encontrado:", hasToken);

    return hasToken;
  }

  /**
   * Genera recomendaciones basadas en los checks
   */
  private static generateRecommendations(diagnostic: ContentDiagnostic): void {
    const { checks } = diagnostic;

    if (!checks.serverReachable) {
      diagnostic.recommendations.push(
        "Verifica que el servidor backend esté corriendo en el puerto correcto."
      );
    }

    if (checks.idFormat && checks.serverReachable && !checks.hasPermissions) {
      diagnostic.recommendations.push(
        "El problema parece ser de autenticación. Cierra sesión e inicia sesión nuevamente."
      );
    }

    if (checks.idFormat && checks.serverReachable && checks.hasPermissions) {
      diagnostic.recommendations.push(
        "El contenido puede no existir o no estar asignado a tu usuario. Contacta al administrador."
      );
    }

    if (diagnostic.recommendations.length === 0) {
      diagnostic.recommendations.push(
        "Todos los checks básicos pasaron. El problema puede ser específico del contenido. Intenta crear nuevo contenido o contacta al soporte técnico."
      );
    }
  }

  /**
   * Crear un reporte de diagnóstico formateado
   */
  static formatDiagnosticReport(diagnostic: ContentDiagnostic): string {
    const report = `
📋 DIAGNÓSTICO DE CONTENIDO
═══════════════════════════

🆔 ID de Contenido: ${diagnostic.contentId}
⏰ Timestamp: ${diagnostic.timestamp}

✅ VERIFICACIONES:
• Formato ID: ${diagnostic.checks.idFormat ? "✅ Válido" : "❌ Inválido"}
• Servidor: ${
      diagnostic.checks.serverReachable ? "✅ Alcanzable" : "❌ No disponible"
    }
• Autenticación: ${
      diagnostic.checks.hasPermissions ? "✅ Presente" : "❌ Faltante"
    }

💡 RECOMENDACIONES:
${diagnostic.recommendations.map((r) => `• ${r}`).join("\n")}

🔧 INFO DEBUG:
${JSON.stringify(diagnostic.debugInfo, null, 2)}
    `;

    return report;
  }

  /**
   * Log de diagnóstico en consola con formato
   */
  static logDiagnostic(diagnostic: ContentDiagnostic): void {
    console.group("🔍 DIAGNÓSTICO DE CONTENIDO");
    console.log("ID:", diagnostic.contentId);
    console.log("Timestamp:", diagnostic.timestamp);
    console.table(diagnostic.checks);
    console.log("Recomendaciones:", diagnostic.recommendations);
    console.log("Debug Info:", diagnostic.debugInfo);
    console.groupEnd();
  }

  /**
   * Obtiene información detallada sobre el token de autenticación
   */
  static getAuthInfo(): {
    hasToken: boolean;
    isValid: boolean;
    isLoggedIn: boolean;
    tokenValue?: string;
    cookieDetails: {
      cookieCount: number;
      hasUnamToken: boolean;
      tokenLength?: number;
    };
    allCookies: string;
    localStorage: any;
    sessionStorage: any;
  } {
    if (typeof document === "undefined") {
      return {
        hasToken: false,
        isValid: false,
        isLoggedIn: false,
        cookieDetails: {
          cookieCount: 0,
          hasUnamToken: false,
        },
        allCookies: "N/A (servidor)",
        localStorage: "N/A (servidor)",
        sessionStorage: "N/A (servidor)",
      };
    }

    const allCookies = document.cookie;
    const tokenMatch = allCookies.match(/UNAM-INCLUSION-TOKEN=([^;]+)/);
    const hasToken = !!tokenMatch;
    const tokenValue = tokenMatch ? tokenMatch[1] : undefined;

    // Contar cookies y analizar el token
    const cookieCount = allCookies
      ? allCookies.split(";").filter((c) => c.trim()).length
      : 0;
    const tokenLength = tokenValue ? tokenValue.length : undefined;

    // Verificar si el token parece válido (básico)
    let isValid = false;
    let isLoggedIn = false;

    if (hasToken && tokenValue) {
      // Un JWT típicamente tiene al menos 100 caracteres y contiene puntos
      isValid = tokenValue.length > 50 && tokenValue.includes(".");
      // Verificar si hay información de usuario en localStorage
      try {
        const userInfo =
          window.localStorage.getItem("user") ||
          window.localStorage.getItem("currentUser");
        isLoggedIn = !!userInfo;
      } catch (e) {
        // Ignorar errores de localStorage
      }
    }

    // Obtener información del localStorage y sessionStorage
    let localStorage: any = "N/A";
    let sessionStorage: any = "N/A";

    try {
      localStorage = window.localStorage
        ? Object.keys(window.localStorage).reduce((acc, key) => {
            acc[key] = window.localStorage.getItem(key);
            return acc;
          }, {} as any)
        : "No disponible";
    } catch (e) {
      localStorage = "Error al acceder";
    }

    try {
      sessionStorage = window.sessionStorage
        ? Object.keys(window.sessionStorage).reduce((acc, key) => {
            acc[key] = window.sessionStorage.getItem(key);
            return acc;
          }, {} as any)
        : "No disponible";
    } catch (e) {
      sessionStorage = "Error al acceder";
    }

    return {
      hasToken,
      isValid,
      isLoggedIn,
      tokenValue: tokenValue ? `${tokenValue.substring(0, 20)}...` : undefined,
      cookieDetails: {
        cookieCount,
        hasUnamToken: hasToken,
        tokenLength,
      },
      allCookies,
      localStorage,
      sessionStorage,
    };
  }
}

/**
 * Hook para debugging de contenido en React
 */
export function useContentDebugger() {
  const diagnoseContent = async (contentId: string) => {
    const diagnostic = await ContentDebugger.diagnoseContent(contentId);
    ContentDebugger.logDiagnostic(diagnostic);
    return diagnostic;
  };

  const logError = (error: any, context?: string) => {
    console.group(`🚨 ERROR DE CONTENIDO: ${context || "Desconocido"}`);
    console.error("Error:", error);
    console.error("Tipo:", typeof error);
    console.error("Propiedades:", Object.keys(error || {}));
    console.error("Stack:", error?.stack);
    console.groupEnd();
  };

  return {
    diagnoseContent,
    logError,
    formatReport: ContentDebugger.formatDiagnosticReport,
  };
}
