export interface Login {
    email: string;
    password: string;
  }

  export interface AuthResponse<T> {
    data?: T;
    error?: string;
    redirect?: {
      destination: string;
      type: 'replace' | 'push';
    };
  }

  export interface User {
    token: string;
  }