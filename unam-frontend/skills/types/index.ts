export interface Level {
  id: string;
  name: string;
  description: string;
  difficulty: string;
}

export interface Language {
  id: string;
  name: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  color: string;
  imageUrl?: string;
  icon?: string;
  objectives?: string;
  prerequisites?: string;
  difficulty: string;
  estimatedHours?: number;
  tags: string[];
  isActive: boolean;
  levelId?: string;
  lenguageId?: string;
  level?: Level;
  lenguage?: Language;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedSkills {
  skills: Skill[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SkillFormData {
  name: string;
  description: string;
  color: string;
  imageUrl: string;
  icon: string;
  objectives: string[];
  prerequisites: string[];
  difficulty: string;
  estimatedHours: number;
  tags: string[];
  levelId: string;
  lenguageId: string;
}

export interface ColumnVisibility {
  name: boolean;
  description: boolean;
  difficulty: boolean;
  level: boolean;
  color: boolean;
  imageUrl: boolean;
  icon: boolean;
  objectives: boolean;
  prerequisites: boolean;
  estimatedHours: boolean;
  isActive: boolean;
  createdAt: boolean;
  updatedAt: boolean;
  actions: boolean;
}

export type GraphQLInputValue = string | number | boolean | null | undefined | string[] | SkillFormData | {
  [key: string]: string | number | boolean | null | undefined | string[];
};

export interface GraphQLVariables {
  [key: string]: GraphQLInputValue;
}