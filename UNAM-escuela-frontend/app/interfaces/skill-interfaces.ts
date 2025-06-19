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
