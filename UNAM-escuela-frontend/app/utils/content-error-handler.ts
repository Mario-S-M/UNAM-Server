/**
 * Utilidad mejorada para el manejo de errores en el sistema de contenidos
 * Centraliza la lógica de manejo de errores y proporciona mensajes más específicos
 */

export interface ErrorInfo {
  type:
    | "NETWORK_ERROR"
    | "AUTHENTICATION_ERROR"
    | "NOT_FOUND_ERROR"
    | "PERMISSION_ERROR"
    | "VALIDATION_ERROR"
    | "SERVER_ERROR"
    | "UNKNOWN_ERROR"
    | "FILE_NOT_FOUND_ERROR"
    | "PARSE_ERROR";
  message: string;
  originalError?: any;
  suggestion?: string;
}

export class ContentErrorHandler {
  /**
   * Analiza un error y devuelve información estructurada
   */
  static analyzeError(error: any): ErrorInfo {
    

    // Si el error es null o undefined
    if (!error) {
      return {
        type: "UNKNOWN_ERROR",
        message: "Error desconocido",
        originalError: error,
        suggestion: "Intenta recargar la página o contacta al administrador",
      };
    }

    // Error de red
    if (
      error instanceof TypeError &&
      error.message &&
      error.message.includes("fetch")
    ) {
      return {
        type: "NETWORK_ERROR",
        message: "Error de conexión con el servidor",
        originalError: error,
        suggestion:
          "Verifica tu conexión a internet y que el servidor esté funcionando",
      };
    }

    // Error de GraphQL con mensaje específico
    if (error.message && typeof error.message === "string") {
      const message = error.message.toLowerCase();

      if (message.includes("contenido no encontrado")) {
        return {
          type: "NOT_FOUND_ERROR",
          message:
            "El contenido solicitado no existe o no tienes permisos para acceder a él",
          originalError: error,
          suggestion:
            "Verifica que el ID del contenido sea correcto y que tengas los permisos necesarios",
        };
      }

      if (
        message.includes("unauthorized") ||
        message.includes("no autorizado")
      ) {
        return {
          type: "AUTHENTICATION_ERROR",
          message:
            "Tu sesión ha expirado o no tienes permisos para realizar esta acción",
          originalError: error,
          suggestion: "Inicia sesión nuevamente para continuar",
        };
      }

      if (message.includes("no tienes permisos")) {
        return {
          type: "PERMISSION_ERROR",
          message: "No tienes permisos para acceder a este contenido",
          originalError: error,
          suggestion:
            "Contacta al administrador si crees que deberías tener acceso",
        };
      }

      if (message.includes("invalid input syntax for type uuid")) {
        return {
          type: "VALIDATION_ERROR",
          message: "El identificador del contenido no es válido",
          originalError: error,
          suggestion: "Verifica que el enlace sea correcto",
        };
      }

      // Nuevo: Manejo específico para archivos markdown no encontrados
      if (message.includes("enoent") || message.includes("no such file")) {
        return {
          type: "FILE_NOT_FOUND_ERROR",
          message: "El archivo de contenido no se encuentra en el servidor",
          originalError: error,
          suggestion:
            "El contenido puede estar en proceso de creación. Intenta crear nuevo contenido o contacta al administrador",
        };
      }

      // Nuevo: Manejo para errores de parseo de markdown
      if (message.includes("markdown") || message.includes("parse")) {
        return {
          type: "PARSE_ERROR",
          message: "Error al procesar el contenido markdown",
          originalError: error,
          suggestion:
            "El contenido puede tener formato incorrecto. Intenta editarlo nuevamente",
        };
      }
    }

    // Error HTTP específico
    if (error.status) {
      switch (error.status) {
        case 400:
          return {
            type: "VALIDATION_ERROR",
            message: "Los datos enviados no son válidos",
            originalError: error,
            suggestion: "Verifica que todos los campos sean correctos",
          };
        case 401:
          return {
            type: "AUTHENTICATION_ERROR",
            message: "No estás autenticado",
            originalError: error,
            suggestion: "Inicia sesión para continuar",
          };
        case 403:
          return {
            type: "PERMISSION_ERROR",
            message: "No tienes permisos para realizar esta acción",
            originalError: error,
            suggestion: "Contacta al administrador",
          };
        case 404:
          return {
            type: "NOT_FOUND_ERROR",
            message: "El recurso solicitado no fue encontrado",
            originalError: error,
            suggestion: "Verifica que la URL sea correcta",
          };
        case 500:
          return {
            type: "SERVER_ERROR",
            message: "Error interno del servidor",
            originalError: error,
            suggestion: "Intenta nuevamente en unos momentos",
          };
      }
    }

    // Error desconocido - mejorar el manejo
    let errorMessage = "Ha ocurrido un error inesperado";

    // Intentar extraer mensaje de diferentes propiedades
    if (error) {
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error.message && typeof error.message === "string") {
        errorMessage = error.message;
      } else if (error.error && typeof error.error === "string") {
        errorMessage = error.error;
      } else if (error.toString && typeof error.toString === "function") {
        try {
          errorMessage = error.toString();
        } catch (e) {
          // Si toString() falla, usar mensaje por defecto
          errorMessage = "Ha ocurrido un error inesperado";
        }
      }
    }

    return {
      type: "UNKNOWN_ERROR",
      message: errorMessage,
      originalError: error,
      suggestion: "Intenta recargar la página o contacta al soporte técnico",
    };
  }

  /**
   * Maneja errores de contenido y devuelve una respuesta estándar
   */
  static handleContentError(error: any): {
    error: string;
    errorInfo?: ErrorInfo;
  } {
    const errorInfo = this.analyzeError(error);

    // Log del error para debugging
    

    return {
      error: errorInfo.message,
      errorInfo,
    };
  }

  /**
   * Determina si un error es recuperable
   */
  static isRecoverableError(errorInfo: ErrorInfo): boolean {
    return [
      "NETWORK_ERROR",
      "SERVER_ERROR",
      "FILE_NOT_FOUND_ERROR",
      "PARSE_ERROR",
    ].includes(errorInfo.type);
  }

  /**
   * Obtiene el color del toast según el tipo de error
   */
  static getErrorColor(errorInfo: ErrorInfo): "danger" | "warning" | "default" {
    switch (errorInfo.type) {
      case "AUTHENTICATION_ERROR":
      case "PERMISSION_ERROR":
      case "NOT_FOUND_ERROR":
        return "danger";
      case "VALIDATION_ERROR":
      case "NETWORK_ERROR":
        return "warning";
      default:
        return "danger";
    }
  }

  /**
   * Genera un ID único para tracking de errores
   */
  static generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Hook personalizado para manejar errores de contenido
 */
export function useContentErrorHandler() {
  const handleError = (error: any, context?: string) => {
    const errorInfo = ContentErrorHandler.analyzeError(error);
    const errorId = ContentErrorHandler.generateErrorId();

    console.group(`🚨 Error en contexto: ${context || "Desconocido"}`);
    
    
    
    
    
    console.groupEnd();

    return {
      errorInfo,
      errorId,
      isRecoverable: ContentErrorHandler.isRecoverableError(errorInfo),
    };
  };

  return { handleError };
}

/**
 * Función helper para validar IDs de contenido
 */
export function isValidContentId(id: string): boolean {
  if (!id || typeof id !== "string") return false;

  // Validar formato UUID
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Función helper para sanitizar mensajes de error
 */
export function sanitizeErrorMessage(message: string): string {
  if (!message) return "Error desconocido";

  // Reemplazar mensajes técnicos con mensajes amigables
  const replacements: Record<string, string> = {
    "invalid input syntax for type uuid": "El identificador no es válido",
    NotFoundException: "Recurso no encontrado",
    UnauthorizedException: "No autorizado",
    ForbiddenException: "Acceso denegado",
  };

  let sanitized = message;
  Object.entries(replacements).forEach(([technical, friendly]) => {
    if (sanitized.includes(technical)) {
      sanitized = friendly;
    }
  });

  return sanitized;
}
