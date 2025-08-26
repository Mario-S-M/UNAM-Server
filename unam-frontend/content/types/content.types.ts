/**
 * @deprecated Este archivo está siendo migrado a /types/index.ts
 * Por favor, importa los tipos desde allí en su lugar.
 */

// Re-exportar tipos desde el archivo centralizado
export type {
  Content,
  Level,
  Skill,
  Teacher,
  PaginatedContents,
  CreateContentFormData as ContentFormData,
  ContentColumnVisibility as ColumnVisibility,
  GraphQLInputValue,
  GraphQLVariables
} from '../../types';

// Importar funciones de validación y limpieza desde schemas
export {
  validateContentForm,
  cleanContentFormData
} from '../../schemas/content-forms';

// Mantener compatibilidad temporal
export type { Content as ContentType } from '../../types';
export type { CreateContentFormData } from '../../schemas/content-forms';
export type { UpdateContentFormData } from '../../schemas/content-forms';