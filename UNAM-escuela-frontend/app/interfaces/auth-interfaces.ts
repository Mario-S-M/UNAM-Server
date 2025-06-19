export interface Login {
  email: string;
  password: string;
}

export interface Register {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse<T> {
  data?: T;
  error?: string;
  token?: string; // Agregar token para recuperación de cookies
  redirect?: {
    destination: string;
    type: "replace" | "push";
  };
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  isActive: boolean;
}
