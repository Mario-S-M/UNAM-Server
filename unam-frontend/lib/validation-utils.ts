import { z } from 'zod';
import ValidationMiddleware, { ValidationResult } from './validation-middleware';

// Esquemas comunes reutilizables
export const CommonSchemas = {
  // UUID válido
  uuid: z.string().uuid('Debe ser un UUID válido'),
  
  // Email válido
  email: z.string().email('Debe ser un email válido'),
  
  // Texto no vacío
  nonEmptyString: z.string().min(1, 'No puede estar vacío'),
  
  // Número positivo
  positiveNumber: z.number().positive('Debe ser un número positivo'),
  
  // Número entero positivo
  positiveInt: z.number().int().positive('Debe ser un número entero positivo'),
  
  // Fecha válida
  dateString: z.string().datetime('Debe ser una fecha válida'),
  
  // URL válida
  url: z.string().url('Debe ser una URL válida'),
  
  // Paginación
  pagination: z.object({
    page: z.number().int().min(1, 'La página debe ser mayor a 0').optional().default(1),
    limit: z.number().int().min(1, 'El límite debe ser mayor a 0').max(100, 'El límite no puede exceder 100').optional().default(10)
  }),
  
  // Filtros de búsqueda
  searchFilters: z.object({
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc')
  })
};

// Funciones de validación específicas
export class ValidationUtils {
  /**
   * Valida un ID de entidad
   */
  static validateEntityId(id: unknown): ValidationResult<string> {
    return ValidationMiddleware.validate(CommonSchemas.uuid, id, false);
  }

  /**
   * Valida múltiples IDs
   */
  static validateEntityIds(ids: unknown[]): ValidationResult<string[]> {
    const schema = z.array(CommonSchemas.uuid);
    return ValidationMiddleware.validate(schema, ids, false);
  }

  /**
   * Valida parámetros de paginación
   */
  static validatePagination(params: unknown): ValidationResult<{ page: number; limit: number }> {
    return ValidationMiddleware.validate(CommonSchemas.pagination, params, false);
  }

  /**
   * Valida filtros de búsqueda
   */
  static validateSearchFilters(filters: unknown): ValidationResult<{
    search?: string;
    sortBy?: string;
    sortOrder: 'asc' | 'desc';
  }> {
    return ValidationMiddleware.validate(CommonSchemas.searchFilters, filters, false);
  }

  /**
   * Limpia y valida texto de entrada
   */
  static cleanAndValidateText(text: unknown, maxLength?: number): ValidationResult<string> {
    let schema = z.string().trim();
    
    if (maxLength) {
      schema = schema.max(maxLength, `No puede exceder ${maxLength} caracteres`);
    }
    
    const result = ValidationMiddleware.validate(schema, text, false);
    
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.trim()
      };
    }
    
    return result;
  }

  /**
   * Valida y formatea email
   */
  static validateEmail(email: unknown): ValidationResult<string> {
    const result = ValidationMiddleware.validate(CommonSchemas.email, email, false);
    
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.toLowerCase().trim()
      };
    }
    
    return result;
  }

  /**
   * Valida array de strings no vacíos
   */
  static validateStringArray(arr: unknown, minLength?: number, maxLength?: number): ValidationResult<string[]> {
    let schema = z.array(CommonSchemas.nonEmptyString);
    
    if (minLength !== undefined) {
      schema = schema.min(minLength, `Debe tener al menos ${minLength} elementos`);
    }
    
    if (maxLength !== undefined) {
      schema = schema.max(maxLength, `No puede tener más de ${maxLength} elementos`);
    }
    
    return ValidationMiddleware.validate(schema, arr, false);
  }

  /**
   * Valida datos de formulario con limpieza automática
   */
  static validateFormData<T>(
    schema: z.ZodSchema<T>,
    data: Record<string, unknown>
  ): ValidationResult<T> {
    // Limpiar strings automáticamente
    const cleanedData = { ...data };
    
    Object.keys(cleanedData).forEach(key => {
      if (typeof cleanedData[key] === 'string') {
        cleanedData[key] = cleanedData[key].trim();
      }
    });
    
    return ValidationMiddleware.validate(schema, cleanedData, false);
  }

  /**
   * Valida datos para GraphQL mutation
   */
  static validateMutationInput<T>(
    schema: z.ZodSchema<T>,
    input: unknown
  ): ValidationResult<T> {
    return ValidationMiddleware.validate(schema, input, true);
  }

  /**
   * Valida datos para GraphQL query
   */
  static validateQueryVariables<T>(
    schema: z.ZodSchema<T>,
    variables: unknown
  ): ValidationResult<T> {
    return ValidationMiddleware.validate(schema, variables, false);
  }

  /**
   * Crea un validador personalizado para un tipo específico
   */
  static createValidator<T>(
    schema: z.ZodSchema<T>,
    cleanFunction?: (data: unknown) => unknown
  ) {
    return (data: unknown): ValidationResult<T> => {
      const processedData = cleanFunction ? cleanFunction(data) : data;
      return ValidationMiddleware.validate(schema, processedData, false);
    };
  }

  /**
   * Valida archivo subido
   */
  static validateFile(
    file: File,
    allowedTypes?: string[],
    maxSize?: number // en bytes
  ): ValidationResult<File> {
    const errors: string[] = [];
    
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      errors.push(`Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`);
    }
    
    if (maxSize && file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      errors.push(`El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`);
    }
    
    if (errors.length > 0) {
      return {
        success: false,
        errors
      };
    }
    
    return {
      success: true,
      data: file
    };
  }

  /**
   * Valida múltiples archivos
   */
  static validateFiles(
    files: FileList | File[],
    allowedTypes?: string[],
    maxSize?: number,
    maxCount?: number
  ): ValidationResult<File[]> {
    const fileArray = Array.from(files);
    const errors: string[] = [];
    
    if (maxCount && fileArray.length > maxCount) {
      errors.push(`Demasiados archivos. Máximo permitido: ${maxCount}`);
    }
    
    const validFiles: File[] = [];
    
    fileArray.forEach((file, index) => {
      const result = this.validateFile(file, allowedTypes, maxSize);
      
      if (result.success && result.data) {
        validFiles.push(result.data);
      } else {
        errors.push(`Archivo ${index + 1}: ${result.errors?.join(', ')}`);
      }
    });
    
    if (errors.length > 0) {
      return {
        success: false,
        errors
      };
    }
    
    return {
      success: true,
      data: validFiles
    };
  }

  /**
   * Valida configuración de aplicación
   */
  static validateAppConfig(config: unknown): ValidationResult<{
    apiUrl: string;
    environment: 'development' | 'production' | 'test';
    enableLogging: boolean;
  }> {
    const schema = z.object({
      apiUrl: CommonSchemas.url,
      environment: z.enum(['development', 'production', 'test']),
      enableLogging: z.boolean()
    });
    
    return ValidationMiddleware.validate(schema, config, false);
  }
}

// Funciones helper para casos comunes
export const validateId = (id: unknown) => ValidationUtils.validateEntityId(id);
export const validateIds = (ids: unknown[]) => ValidationUtils.validateEntityIds(ids);
export const validatePagination = (params: unknown) => ValidationUtils.validatePagination(params);
export const validateEmail = (email: unknown) => ValidationUtils.validateEmail(email);
export const cleanText = (text: unknown, maxLength?: number) => ValidationUtils.cleanAndValidateText(text, maxLength);

// Exportar por defecto
export default ValidationUtils;