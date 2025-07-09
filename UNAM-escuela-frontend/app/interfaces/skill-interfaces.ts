export interface Skill {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkillsResponse {
  data: Skill[];
}

export interface PaginatedSkillsResponse {
  data: {
    skills: Skill[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface SkillsFilterArgs {
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface CreateSkillInput {
  name: string;
  description: string;
  color?: string;
}

export interface UpdateSkillInput {
  id: string;
  name?: string;
  description?: string;
  color?: string;
}

export interface SkillsTableProps {
  skills: Skill[];
  skillsLoading: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData:
    | {
        skills: Skill[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
      }
    | undefined;
  searchTerm: string;
  statusFilter: boolean | undefined;
  onPageChange: (page: number) => void;
}
