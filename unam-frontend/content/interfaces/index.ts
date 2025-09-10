export interface Content {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  levelId: string;
  userId: number;
  languageId?: string;
  markdownPath?: string;
  assignedTeachers: Teacher[];
  validationStatus: string;
  publishedAt?: string;
  skill?: Skill;
  skillId?: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  levelId?: string;
  level?: {
    id: string;
    name: string;
    description: string;
    difficulty: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Level {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
  percentaje: number;
  qualification: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  isActive: boolean;
  difficulty: string;
  lenguageId: string;
}

export interface Language {
  id: string;
  name: string;
  icons: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

// Interfaces para respuestas paginadas
export interface PaginatedContents {
  contents: Content[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
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

// Interfaces para el sidebar
export interface SidebarContent {
  id: string;
  title: string;
  type: "video" | "article";
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
  skills: SidebarSkill[];
}

export interface SidebarLanguage {
  id: string;
  name: string;
  flag: string;
  levels: SidebarLevel[];
}