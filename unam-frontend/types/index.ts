/**
 * Tipos centralizados de la aplicación UNAM
 * 
 * Este archivo contiene todos los tipos TypeScript derivados de los esquemas Zod
 * para mantener consistencia y evitar duplicaciones.
 */

// Form Data Types - Import from schema files
export type {
  CreateSkillFormData,
  UpdateSkillFormData,
  SkillFiltersData,
  SkillIdData
} from '../schemas/skill-forms';

export type {
  CreateContentFormData,
  UpdateContentFormData,
  ContentFiltersData,
  ContentIdData,
  ContentByLevelData,
  ContentBySkillData
} from '../schemas/content-forms';

export type {
  CreateLevelFormData,
  UpdateLevelFormData,
  LevelFiltersData,
  LevelIdData
} from '../schemas/level-forms';

export type {
  CreateLanguageFormData,
  UpdateLanguageFormData,
  LanguageFiltersData,
  LanguageIdData
} from '../schemas/language-forms';

export type {
  SignupFormData,
  LoginFormData,
  UpdateUserFormData,
  UpdateUserRolesFormData,
  AssignLanguageFormData,
  AssignMultipleLanguagesFormData,
  UsersFilterData,
  UserIdData,
  ValidRoles
} from '../schemas/user-forms';

export type {
  CreateActivityFormData,
  UpdateActivityFormData,
  ActivityFiltersData,
  ActivityIdData,
  ActivitiesByContentData
} from '../schemas/activity-forms';

export type {
  CreateHomeworkFormData,
  UpdateHomeworkFormData,
  HomeworkFiltersData,
  HomeworkIdData,
  HomeworkByActivityData,
  StudentAnswerData
} from '../schemas/homework-forms';

// Entity Types - Import from content schemas
export type {
  Teacher,
  Skill,
  Content,
  Level,
  Language,
  PaginatedContents,
  PaginatedSkills
} from '../content/schemas';

// Tipos específicos para entidades de idiomas (consolidados desde componentes)
export interface LanguageEntity {
  id: string;
  name: string;
  code: string;
  nativeName: string;
  flag: string;
  icons: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// LanguageFormData types are now exported from schemas/language-forms.ts

// Tipos para respuestas paginadas de idiomas
export interface PaginatedLanguages {
  lenguages: LanguageEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Tipos específicos para componentes UI
export interface SidebarContent {
  id: string;
  title: string;
  type: "video" | "article" | "exercise";
}

export interface SidebarSkill {
  id: string;
  name: string;
  contents: SidebarContent[];
}

export interface SidebarLevel {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  skills: SidebarSkill[];
}

export interface SidebarLanguage {
  id: string;
  name: string;
  icons: string[];
  levels: SidebarLevel[];
}

// Tipos para visibilidad de columnas en tablas
export interface ColumnVisibility {
  [key: string]: boolean;
}

export interface ContentColumnVisibility extends ColumnVisibility {
  name: boolean;
  description: boolean;
  level: boolean;
  skill: boolean;
  status: boolean;
  teachers: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  actions: boolean;
}

export interface SkillColumnVisibility extends ColumnVisibility {
  name: boolean;
  description: boolean;
  color: boolean;
  isActive: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  actions: boolean;
}

export interface LevelColumnVisibility extends ColumnVisibility {
  name: boolean;
  description: boolean;
  difficulty: boolean;
  language: boolean;
  isActive: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  actions: boolean;
}

export interface LanguageColumnVisibility extends ColumnVisibility {
  name: boolean;
  code: boolean;
  nativeName: boolean;
  flag: boolean;
  icons: boolean;
  isActive: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  actions: boolean;
}

// Tipos para GraphQL
export type GraphQLInputValue = 
  | string 
  | number 
  | boolean 
  | null 
  | undefined 
  | string[] 
  | Record<string, any>
  | GraphQLInputValue[];

export interface GraphQLVariables {
  [key: string]: GraphQLInputValue;
}

// Tipos para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> extends PaginationInfo {
  data: T[];
}

// Tipos para autenticación
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
  assignedLanguageId?: string;
}

import type { SignupFormData } from '../schemas/user-forms';

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (userData: SignupFormData) => Promise<void>;
}

// Tipos para validación
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  errors?: string[];
}

// Tipos para archivos
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

// Tipos para notificaciones/toast
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Tipos para filtros comunes
export interface BaseFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Tipos para estados de validación
export type ValidationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Tipos para dificultad de niveles
export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

// Tipos para roles de usuario
export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

// Tipos para estados de actividad
export type ActivityStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

// Tipos para estados de tarea
export type HomeworkStatus = 'PENDING' | 'SUBMITTED' | 'GRADED' | 'RETURNED';

// Tipos para tipos de contenido
export type ContentType = 'video' | 'article' | 'exercise' | 'quiz' | 'assignment';

// Exportar constantes útiles
export const VALIDATION_STATUSES: ValidationStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];
export const DIFFICULTY_LEVELS: DifficultyLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
export const USER_ROLES: UserRole[] = ['ADMIN', 'TEACHER', 'STUDENT'];
export const ACTIVITY_STATUSES: ActivityStatus[] = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
export const HOMEWORK_STATUSES: HomeworkStatus[] = ['PENDING', 'SUBMITTED', 'GRADED', 'RETURNED'];
export const CONTENT_TYPES: ContentType[] = ['video', 'article', 'exercise', 'quiz', 'assignment'];

// Tipos para configuración de la aplicación
export interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'production' | 'test';
  enableLogging: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  pagination: {
    defaultLimit: number;
    maxLimit: number;
  };
}

// Tipos para errores
export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: Record<string, any>;
}

// Tipos para métricas y analytics
export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: Record<UserRole, number>;
}

export interface ContentMetrics {
  totalContent: number;
  publishedContent: number;
  pendingContent: number;
  contentByType: Record<ContentType, number>;
}

export interface SystemMetrics {
  users: UserMetrics;
  content: ContentMetrics;
  lastUpdated: string;
}

// Tipos para configuración de tema
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

// Tipos para preferencias de usuario
export interface UserPreferences {
  theme: ThemeConfig;
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}

// Note: Removed default export with shorthand properties as they cause TypeScript errors
// All types are available as named exports above