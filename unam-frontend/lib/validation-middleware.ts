import { z } from 'zod';
import { toast } from 'sonner';

// Tipo para el resultado de validación
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

// Middleware de validación genérico
export class ValidationMiddleware {
  /**
   * Valida datos usando un esquema Zod
   * @param schema - Esquema Zod para validación
   * @param data - Datos a validar
   * @param showToast - Si mostrar toast de error automáticamente
   * @returns Resultado de validación
   */
  static validate<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    showToast: boolean = true
  ): ValidationResult<T> {
    try {
      const result = schema.safeParse(data);
      
      if (result.success) {
        return {
          success: true,
          data: result.data
        };
      } else {
        const errors = result.error.issues.map((issue) => issue.message);
        
        if (showToast) {
          toast.error(`Errores de validación: ${errors.join(', ')}`);
        }
        
        return {
          success: false,
          errors
        };
      }
    } catch {
      const errorMessage = 'Error inesperado durante la validación';
      
      if (showToast) {
        toast.error(errorMessage);
      }
      
      return {
        success: false,
        errors: [errorMessage]
      };
    }
  }

  /**
   * Valida y limpia datos de formulario
   * @param schema - Esquema Zod para validación
   * @param data - Datos del formulario
   * @param cleanFunction - Función opcional para limpiar datos
   * @param showToast - Si mostrar toast de error automáticamente
   * @returns Resultado de validación con datos limpios
   */
  static validateAndClean<T, U = T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    cleanFunction?: (data: T) => U,
    showToast: boolean = true
  ): ValidationResult<U> {
    // Limpiar datos si se proporciona función de limpieza
    const cleanedData = cleanFunction && typeof data === 'object' && data !== null 
      ? cleanFunction(data as T) 
      : data;
    
    const validationResult = this.validate(schema, cleanedData, showToast);
    
    if (validationResult.success && validationResult.data) {
      return {
        success: true,
        data: cleanFunction ? cleanFunction(validationResult.data) : validationResult.data as U
      };
    }
    
    return {
      success: false,
      errors: validationResult.errors
    };
  }

  /**
   * Valida múltiples esquemas en secuencia
   * @param validations - Array de validaciones a ejecutar
   * @param showToast - Si mostrar toast de error automáticamente
   * @returns Resultado de todas las validaciones
   */
  static validateMultiple<T = unknown>(
    validations: Array<{
      schema: z.ZodSchema<T>;
      data: unknown;
      name?: string;
    }>,
    showToast: boolean = true
  ): ValidationResult<T[]> {
    const results: T[] = [];
    const allErrors: string[] = [];
    
    for (const validation of validations) {
      const result = this.validate(validation.schema, validation.data, false);
      
      if (result.success && result.data) {
        results.push(result.data);
      } else {
        const errorPrefix = validation.name ? `${validation.name}: ` : '';
        const errors = result.errors?.map(err => `${errorPrefix}${err}`) || [];
        allErrors.push(...errors);
      }
    }
    
    if (allErrors.length > 0) {
      if (showToast) {
        toast.error(`Errores de validación: ${allErrors.join(', ')}`);
      }
      
      return {
        success: false,
        errors: allErrors
      };
    }
    
    return {
      success: true,
      data: results
    };
  }

  /**
   * Middleware para validación de formularios con manejo de errores
   * @param schema - Esquema Zod para validación
   * @param data - Datos del formulario
   * @param onSuccess - Callback a ejecutar si la validación es exitosa
   * @param onError - Callback opcional a ejecutar si hay errores
   * @param cleanFunction - Función opcional para limpiar datos
   */
  static async validateForm<T, U = T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    onSuccess: (validatedData: U) => Promise<void> | void,
    onError?: (errors: string[]) => void,
    cleanFunction?: (data: T) => U
  ): Promise<void> {
    const result = this.validateAndClean(schema, data, cleanFunction, true);
    
    if (result.success && result.data) {
      try {
        await onSuccess(result.data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
        toast.error(errorMessage);
        onError?.([errorMessage]);
      }
    } else {
      onError?.(result.errors || []);
    }
  }

  /**
   * Valida parámetros de URL o query parameters
   * @param schema - Esquema Zod para validación
   * @param params - Parámetros a validar
   * @param showToast - Si mostrar toast de error automáticamente
   * @returns Resultado de validación
   */
  static validateParams<T>(
    schema: z.ZodSchema<T>,
    params: Record<string, unknown>,
    showToast: boolean = false
  ): ValidationResult<T> {
    return this.validate(schema, params, showToast);
  }

  /**
   * Valida datos antes de enviar a API
   * @param schema - Esquema Zod para validación
   * @param data - Datos a enviar
   * @param transformFunction - Función opcional para transformar datos
   * @returns Resultado de validación
   */
  static validateApiData<T, U = T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    transformFunction?: (data: T) => U
  ): ValidationResult<U> {
    const result = this.validate(schema, data, true);
    
    if (result.success && result.data) {
      const transformedData = transformFunction 
        ? transformFunction(result.data) 
        : result.data as U;
      
      return {
        success: true,
        data: transformedData
      };
    }
    
    return {
      success: false,
      errors: result.errors
    };
  }
}

// Decorador para validación automática (para uso futuro con clases)
export function ValidateInput<T>(schema: z.ZodSchema<T>) {
  return function (target: object, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = function (...args: unknown[]) {
      const [data] = args;
      const result = ValidationMiddleware.validate(schema, data);
      
      if (!result.success) {
        throw new Error(`Validation failed: ${result.errors?.join(', ')}`);
      }
      
      return method.apply(this, [result.data, ...args.slice(1)]);
    };
  };
}

// Hooks personalizados para React (para uso futuro)
export const useValidation = () => {
  return {
    validate: ValidationMiddleware.validate,
    validateAndClean: ValidationMiddleware.validateAndClean,
    validateForm: ValidationMiddleware.validateForm,
    validateParams: ValidationMiddleware.validateParams,
    validateApiData: ValidationMiddleware.validateApiData
  };
};

// Exportar instancia por defecto
export default ValidationMiddleware;