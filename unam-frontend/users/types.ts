export interface User {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  isActive: boolean;
  assignedLanguageId?: string;
  assignedLanguage?: {
    id: string;
    name: string;
  };
  assignedLanguages?: {
    id: string;
    name: string;
  }[];
}

// EditFormData types are now exported from schemas/user-forms.ts

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Language {
  id: string;
  name: string;
}

export interface UserColumnVisibility {
  fullName: boolean;
  email: boolean;
  roles: boolean;
  assignedLanguage: boolean;
  isActive: boolean;
  actions: boolean;
}