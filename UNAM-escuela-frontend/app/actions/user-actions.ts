"use server";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export interface User {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersResponse {
  data: User[];
}

export interface ActionResponse<T> {
  data?: T;
  error?: string;
}

export async function getUsers(token?: string): Promise<UsersResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: `
        query Users {
          users {
            id
            fullName
            email
            roles
            isActive
            createdAt
            updatedAt
          }
        }
      `,
    }),
  });

  if (!response.ok) {
    throw new Error("Error al cargar los usuarios");
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors.map((err: any) => err.message).join(", "));
  }

  return { data: result.data.users || [] };
}

export async function getUser(
  id: string,
  token?: string
): Promise<ActionResponse<User>> {
  try {
    if (!id) {
      throw new Error("ID inválido");
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query User($userId: ID!) {
            user(id: $userId) {
              id
              fullName
              email
              roles
              isActive
              createdAt
              updatedAt
            }
          }
        `,
        variables: { userId: id },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al cargar el usuario");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.user };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function blockUser(
  id: string,
  token?: string
): Promise<ActionResponse<User>> {
  try {
    if (!id) {
      throw new Error("ID inválido");
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          mutation BlockUser($blockUserId: ID!) {
            blockUser(id: $blockUserId) {
              id
              fullName
              email
              roles
              isActive
              createdAt
              updatedAt
            }
          }
        `,
        variables: { blockUserId: id },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al bloquear el usuario");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.blockUser };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function revalidateToken(
  token: string
): Promise<ActionResponse<{ token: string; user: User }>> {
  try {
    if (!token) {
      throw new Error("Token inválido");
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query Revalidate {
            revalidate {
              token
              user {
                id
                fullName
                email
                roles
                isActive
              }
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al revalidar el token");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.revalidate };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
