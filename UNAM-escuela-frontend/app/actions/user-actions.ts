"use server";

import { cookies } from "next/headers";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

// Helper function to get auth headers
async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("UNAM-INCLUSION-TOKEN")?.value;

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("Could not get auth token:", error);
  }

  return headers;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  isActive: boolean;
  lastUpdateBy?: {
    id: string;
    fullName: string;
  };
}

export interface UsersResponse {
  data: User[];
}

export interface PaginatedUsersResponse {
  data: {
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface UsersFilterArgs {
  roles?: string[];
  search?: string;
  page?: number;
  limit?: number;
}

export interface ActionResponse<T> {
  data?: T;
  error?: string;
}

export interface UpdateUserRolesInput {
  id: string;
  roles: string[];
}

export async function getUsers(token?: string): Promise<UsersResponse> {
  const headers = await getAuthHeaders();

  // Si se proporciona un token específico, usarlo en su lugar
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: `
        query Users($roles: [ValidRoles!]) {
          users(roles: $roles) {
            id
            fullName
            email
            roles
            isActive
            lastUpdateBy {
              id
              fullName
            }
          }
        }
      `,
      variables: { roles: [] }, // Array vacío para obtener todos los usuarios
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Error response body:", errorText);
    throw new Error("Error al cargar los usuarios");
  }

  const result = await response.json();

  if (result.errors) {
    console.error("❌ GraphQL errors:", result.errors);

    // Si es un error de permisos, no lanzar error sino devolver una lista vacía
    // Esto evita que falle toda la cadena de llamadas
    if (
      result.errors.some(
        (err: any) =>
          err.message.includes("superUser") ||
          err.extensions?.code === "FORBIDDEN"
      )
    ) {
      console.warn("⚠️ Error de permisos en getUsers, devolviendo lista vacía");
      return { data: [] };
    }

    throw new Error(result.errors.map((err: any) => err.message).join(", "));
  }

  return { data: result.data.users || [] };
}

export async function getUsersPaginated(
  filters: UsersFilterArgs = {},
  token?: string
): Promise<PaginatedUsersResponse> {
  const { roles = [], search, page = 1, limit = 10 } = filters;

  console.log("🔍 Obteniendo usuarios paginados:", {
    roles,
    search,
    page,
    limit,
  });

  const headers = await getAuthHeaders();

  // Si se proporciona un token específico, usarlo en su lugar
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: `
        query UsersPaginated($roles: [ValidRoles!], $search: String, $page: Int, $limit: Int) {
          usersPaginated(roles: $roles, search: $search, page: $page, limit: $limit) {
            users {
              id
              fullName
              email
              roles
              isActive
              lastUpdateBy {
                id
                fullName
              }
            }
            total
            page
            limit
            totalPages
            hasNextPage
            hasPreviousPage
          }
        }
      `,
      variables: { roles, search, page, limit },
    }),
  });

  console.log("📥 Respuesta HTTP:", response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Error en respuesta HTTP:", errorText);
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const result = await response.json();

  if (result.errors) {
    console.error("❌ GraphQL errors:", result.errors);

    // Si es un error de permisos, devolver respuesta vacía
    if (
      result.errors.some(
        (err: any) =>
          err.message.includes("superUser") ||
          err.extensions?.code === "FORBIDDEN"
      )
    ) {
      console.warn(
        "⚠️ Error de permisos en getUsersPaginated, devolviendo respuesta vacía"
      );
      return {
        data: {
          users: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }

    throw new Error(result.errors.map((err: any) => err.message).join(", "));
  }

  const paginatedData = result.data.usersPaginated;
  console.log(
    `✅ Se encontraron ${paginatedData.total} usuarios (página ${paginatedData.page})`
  );

  return { data: paginatedData };
}

export async function getUser(
  id: string,
  token?: string
): Promise<ActionResponse<User>> {
  try {
    if (!id) {
      throw new Error("ID inválido");
    }

    const headers = await getAuthHeaders();

    // Si se proporciona un token específico, usarlo en su lugar
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
              lastUpdateBy {
                id
                fullName
              }
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

    const headers = await getAuthHeaders();

    // Si se proporciona un token específico, usarlo en su lugar
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
              lastUpdateBy {
                id
                fullName
              }
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

export async function getUsersByRole(
  roles: string[],
  token?: string
): Promise<UsersResponse> {
  const headers = await getAuthHeaders();

  // Si se proporciona un token específico, usarlo en su lugar
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: `
        query Users($roles: [ValidRoles!]!) {
          users(roles: $roles) {
            id
            fullName
            email
            roles
            isActive
            lastUpdateBy {
              id
              fullName
            }
          }
        }
      `,
      variables: { roles },
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

export async function getTeachers(token?: string): Promise<UsersResponse> {
  console.log("🔍 getTeachers called");

  // Obtener encabezados de autenticación
  const headers = await getAuthHeaders();

  console.log(
    "🔐 Headers Auth:",
    headers.Authorization ? "Token presente" : "Sin token"
  );

  // Si se proporciona un token específico, usarlo en su lugar
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log("🔐 Token proporcionado externamente");
  }

  try {
    // Primero intentar directamente con la API GraphQL para usuarios con rol de docente
    console.log("📤 Consultando profesores (docentes) directamente");

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query Users {
            users(roles: [docente]) {
              id
              fullName
              email
              roles
              isActive
            }
          }
        `,
      }),
    });

    console.log("📥 Respuesta HTTP:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error en respuesta HTTP:", errorText);
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error("❌ Errores GraphQL:", result.errors);
      // Si hay un error de permisos, probablemente sea porque 'admin' no tiene permiso
      // para usar users(roles: [docente]) en el backend
      if (result.errors.some((err: any) => err.message.includes("superUser"))) {
        console.log(
          "⚠️ Error de permisos detectado, utilizando método alternativo"
        );
        return getTeachersFallback(token);
      }
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    const teachers = result.data?.users || [];
    console.log(`✅ Se encontraron ${teachers.length} profesores`);

    return { data: teachers };
  } catch (error) {
    console.error("❌ Excepción al obtener profesores:", error);
    console.log("🔄 Intentando con getUsersByRole como alternativa");

    // Si falla, intentar con getUsersByRole como fallback
    try {
      const roleResult = await getUsersByRole(["docente"], token);
      if (roleResult.data && roleResult.data.length > 0) {
        return roleResult;
      }
      throw new Error("getUsersByRole no devolvió resultados");
    } catch (fallbackError) {
      console.error("❌ Fallback getUsersByRole también falló:", fallbackError);
      console.log(
        "🔄 Intentando con getTeachersFallback como última alternativa"
      );

      // Si ambos métodos anteriores fallan, usar nuestro método custom que filtra todos los usuarios
      return getTeachersFallback(token);
    }
  }
}

// Función alternativa como fallback que no requiere permisos especiales
async function getTeachersFallback(token?: string): Promise<UsersResponse> {
  console.log(
    "🚀 Usando método alternativo con getAllUsers para obtener profesores"
  );

  try {
    // Intentar obtener usuarios con el enfoque normal
    const allUsers = await getUsers(token);

    if (allUsers.data && allUsers.data.length > 0) {
      console.log(
        `✅ Se encontraron ${allUsers.data.length} usuarios en total`
      );
      // Filtrar solo usuarios con rol docente
      const teacherUsers = allUsers.data.filter((user) =>
        user.roles.includes("docente")
      );

      console.log(
        `✅ Se encontraron ${teacherUsers.length} profesores entre todos los usuarios`
      );

      // Si encontramos profesores, retornarlos
      if (teacherUsers.length > 0) {
        return { data: teacherUsers };
      }
    }

    // Si llegamos aquí, significa que no se encontraron profesores o hubo un problema
    // En ese caso, intentar extraer profesores de contenidos existentes en la base de datos
    console.log(
      "🔍 Extrayendo profesores reales de contenidos existentes en la base de datos"
    );

    const teachersFromDatabase = await extractTeachersFromContents(token);
    if (teachersFromDatabase.length > 0) {
      console.log(
        `✅ Se extrajeron ${teachersFromDatabase.length} profesores reales de la base de datos`
      );
      return { data: teachersFromDatabase };
    }

    console.warn("⚠️ No se pudieron obtener profesores de la base de datos");
    return { data: [] };
  } catch (error) {
    console.error("❌ El método alternativo también falló:", error);
    // Como último recurso, intentar extraer profesores de contenidos existentes
    console.log(
      "🔍 Intentando extraer profesores de contenidos como último recurso"
    );

    const teachersFromDatabase = await extractTeachersFromContents(token);
    if (teachersFromDatabase.length > 0) {
      console.log(
        `✅ Se extrajeron ${teachersFromDatabase.length} profesores reales de la base de datos`
      );
      return { data: teachersFromDatabase };
    }

    console.warn("⚠️ No se pudieron obtener profesores de ninguna fuente");
    return { data: [] };
  }
}

// Función para extraer profesores reales de contenidos existentes en la base de datos
async function extractTeachersFromContents(token?: string): Promise<User[]> {
  try {
    const headers = await getAuthHeaders();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Intentar múltiples endpoints para obtener contenidos con profesores
    const queries = [
      // Query 1: Obtener contenidos por nivel (usando un nivel genérico)
      {
        query: `
          query {
            contentsByLevel(levelId: "cualquiera") {
              id
              assignedTeachers {
                id
                fullName
                email
                roles
                isActive
              }
            }
          }
        `,
        name: "contentsByLevel",
      },
      // Query 2: Obtener contenidos por skill (usando un skill genérico)
      {
        query: `
          query {
            contentsBySkill(skillId: "cualquiera") {
              id
              assignedTeachers {
                id
                fullName
                email
                roles
                isActive
              }
            }
          }
        `,
        name: "contentsBySkill",
      },
      // Query 3: Obtener mis contenidos asignados
      {
        query: `
          query {
            myAssignedContents {
              id
              assignedTeachers {
                id
                fullName
                email
                roles
                isActive
              }
            }
          }
        `,
        name: "myAssignedContents",
      },
    ];

    const allTeachers = new Map<string, User>();

    for (const queryDef of queries) {
      try {
        console.log(`🔍 Probando query: ${queryDef.name}`);

        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: "POST",
          headers,
          body: JSON.stringify({ query: queryDef.query }),
        });

        if (response.ok) {
          const result = await response.json();

          if (!result.errors && result.data) {
            // Extraer profesores de cualquier campo que sea un array de contenidos
            Object.values(result.data).forEach((contents: any) => {
              if (Array.isArray(contents)) {
                contents.forEach((content: any) => {
                  if (content.assignedTeachers) {
                    content.assignedTeachers.forEach((teacher: User) => {
                      if (
                        teacher.roles.includes("docente") &&
                        teacher.isActive
                      ) {
                        allTeachers.set(teacher.id, teacher);
                      }
                    });
                  }
                });
              }
            });
          }
        }
      } catch (queryError) {
        console.warn(`⚠️ Query ${queryDef.name} falló:`, queryError);
        continue;
      }
    }

    return Array.from(allTeachers.values());
  } catch (error) {
    console.error("❌ Error al extraer profesores de contenidos:", error);
    return [];
  }
}

/**
 * Actualiza los roles de un usuario
 */
export async function updateUserRoles(
  input: UpdateUserRolesInput,
  token?: string
): Promise<ActionResponse<User>> {
  try {
    if (!input.id || !input.roles || input.roles.length === 0) {
      throw new Error("ID de usuario y roles son requeridos");
    }

    const headers = await getAuthHeaders();

    // Si se proporciona un token específico, usarlo en su lugar
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          mutation UpdateUserRoles($updateUserRolesInput: UpdateUserRolesInput!) {
            updateUserRoles(updateUserRolesInput: $updateUserRolesInput) {
              id
              fullName
              email
              roles
              isActive
              lastUpdateBy {
                id
                fullName
              }
            }
          }
        `,
        variables: { updateUserRolesInput: input },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar los roles del usuario");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.updateUserRoles };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
