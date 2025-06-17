export interface Content {
  id: string;
  title: string;
  description: string;
  content?: string;
  levelId: string;
  status?: string;
  markdownPath?: string;
  assignedTeachers?: Teacher[];
  createdAt?: string;
  updatedAt?: string;
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
