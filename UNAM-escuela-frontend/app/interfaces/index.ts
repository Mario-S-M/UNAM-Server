export * from "./level-interfaces";

export interface Level {
  id: string;
  name: string;
  description: string;
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
