export interface Level {
  id: string;
  name: string;
  description: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  status?: "active" | "inactive" | "draft";
  isCompleted?: boolean;
  percentaje?: number;
  qualification?: number;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface LevelsResponse {
  data: Level[];
}

export interface ActionResponse<T> {
  data?: T;
  error?: string;
}

export interface LevelsQueryResponse {
  levels: Level[];
}
export interface LevelQueryResponse {
  level: Level;
}
