export interface Level {
    id: string;
    name: string;
    description: string;
    isCompleted: boolean;
    percentaje: number;
    qualification: number;
  }
  
  export interface ActionResponse<T> {
    data?: T;
    error?: string;
  }
  
  export interface LevelQueryResponse {
    levels: Level[];
  }
  
  export interface LevelMutationResponse {
    createLevel: Level;
  }

  export interface LevelsResponse {
    data: Level[];
  }