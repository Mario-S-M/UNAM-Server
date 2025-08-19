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

// Mantener compatibilidad temporal
export type { Content as ContentType } from '../../types';
export type { CreateContentFormData } from '../../types';
export type { UpdateContentFormData } from '../../types';