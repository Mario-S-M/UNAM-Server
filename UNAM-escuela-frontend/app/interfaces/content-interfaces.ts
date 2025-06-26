export interface Content {
  id: string;
  name: string;
  description: string;
  content?: string;
  levelId: string;
  validationStatus?: string;
  markdownPath?: string;
  assignedTeachers?: Teacher[];
  skill?: Skill;
  skillId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
}

export interface ContentsResponse {
  data: Content[];
}
