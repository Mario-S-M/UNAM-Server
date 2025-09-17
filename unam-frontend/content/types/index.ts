export interface Content {
  id: string;
  name: string;
  description: string;
  validationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  levelId: string;
  skillId: string;
  languageId?: string;
  isCompleted?: boolean;
  userId?: number;
  jsonContent?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  level?: {
    id: string;
    name: string;
  };
  skill?: {
    id: string;
    name: string;
    color?: string;
  };
  language?: {
    id: string;
    name: string;
  };
  assignedTeachers?: {
    id: string;
    fullName: string;
    email: string;
    roles?: string[];
    isActive?: boolean;
  }[];
}

// ContentFormData types are now exported from schemas/content-forms.ts

export interface ContentsData {
  contentsPaginated: {
    contents: Content[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface Level {
  id: string;
  name: string;
  difficulty: number;
}

export interface Skill {
  id: string;
  name: string;
  color?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
}

export interface Language {
  id: string;
  name: string;
  code: string;
}

export interface ValidationStatusOption {
  value: 'PENDING' | 'APPROVED' | 'REJECTED';
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number | string; }>;
  color: string;
}