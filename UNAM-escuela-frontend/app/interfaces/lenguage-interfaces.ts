export interface Lenguage {
  id: string;
  name: string;
  isActive: boolean;
}

export interface LenguageResponse {
  data: Lenguage[]; // Para GraphQL, el campo puede ser lenguagesActivate
}

export interface SingleLenguageResponse {
  data: Lenguage; // Para un solo idioma
}
export interface ActionLenguageResponse<T> {
  data?: T;
  error?: string;
}
export interface LenguageQueryResponse {
  lenguages: Lenguage[];
}

export interface LenguageQueryResponse {
  lenguage: Lenguage;
}
