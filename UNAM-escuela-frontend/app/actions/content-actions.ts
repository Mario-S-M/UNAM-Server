"use server";

import { cookies } from "next/headers";
import {
  ContentErrorHandler,
  isValidContentId,
  sanitizeErrorMessage,
} from "../utils/content-error-handler";
import { BasicContentSchema, FullContentSchema } from "../schemas";

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

export interface Content {
  id: string;
  name: string;
  title?: string; // Para compatibilidad
  description: string;
  content?: string;
  levelId: string;
  skillId?: string;
  createdAt?: string;
  updatedAt?: string;
  markdownPath?: string;
  assignedTeachers?: {
    id: string;
    fullName: string;
    email: string;
    roles: string[];
  }[];
}

export interface ContentsResponse {
  data: Content[];
}

export interface ActionResponse<T> {
  data?: T;
  error?: string;
}

export async function getContentsList() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("UNAM-INCLUSION-TOKEN")?.value;

    if (!token) {
      return { success: false, error: "No hay token disponible" };
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query GetContents {
            contents {
              id
              title
              isActive
              levelId
              skillId
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      return { success: false, error: "Error en la respuesta del servidor" };
    }

    const result = await response.json();

    if (result.errors) {
      return { success: false, error: "Error en GraphQL" };
    }

    const contentsData = result.data.contents;

    // Validar cada contenido con Zod
    const validatedContents = contentsData
      .map((content: any) => {
        try {
          return BasicContentSchema.parse(content);
        } catch (error) {
          return null;
        }
      })
      .filter(Boolean);

    return { success: true, data: validatedContents };
  } catch (error) {
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function getContentById(contentId: string) {
  console.log("🔍 getContentById - Starting with contentId:", contentId);

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("UNAM-INCLUSION-TOKEN")?.value;

    console.log("🔍 getContentById - Token available:", !!token);

    if (!token) {
      console.log("🔍 getContentById - No token available");
      return { success: false, error: "No hay token disponible" };
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query GetContentById($id: String!) {
            content(id: $id) {
              id
              title
              name
              description
              content
              isActive
              levelId
              skillId
              createdAt
              updatedAt
              assignedTeachers {
                id
                fullName
                email
                roles
              }
            }
          }
        `,
        variables: { id: contentId },
      }),
    });

    console.log("🔍 getContentById - Response status:", response.status);
    console.log("🔍 getContentById - Response OK:", response.ok);

    if (!response.ok) {
      console.log(
        "🔍 getContentById - Response not OK:",
        response.status,
        response.statusText
      );
      return { success: false, error: "Error en la respuesta del servidor" };
    }

    const result = await response.json();
    console.log("🔍 getContentById - GraphQL result:", result);

    if (result.errors) {
      console.log("🔍 getContentById - GraphQL errors:", result.errors);
      return { success: false, error: "Error en GraphQL" };
    }

    const contentData = result.data.content;
    console.log("🔍 getContentById - Content data:", contentData);

    if (!contentData) {
      console.log("🔍 getContentById - No content data found");
      return { success: false, error: "Contenido no encontrado" };
    }

    // Validar el contenido con Zod
    const validatedContent = FullContentSchema.parse(contentData);
    console.log("🔍 getContentById - Validation successful");

    return { success: true, data: validatedContent };
  } catch (error) {
    console.error("🔍 getContentById - Error:", error);
    console.error("🔍 getContentById - Error type:", typeof error);
    console.error(
      "🔍 getContentById - Error properties:",
      Object.keys(error || {})
    );

    return { success: false, error: "Error interno del servidor" };
  }
}

export async function getContentsByLevel(levelId: string) {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query GetContentsByLevel($levelId: String!) {
            getContentsByLevel(levelId: $levelId) {
              data {
                id
                name
                description
                isActive
                validationStatus
                levelId
                skillId
                skill {
                  id
                  name
                  color
                  isActive
                }
                assignedTeachers {
                  id
                  fullName
                  email
                  roles
                }
                createdAt
                updatedAt
              }
              error
            }
          }
        `,
        variables: { levelId },
      }),
    });

    if (!response.ok) {
      return { error: `Error HTTP: ${response.status}` };
    }

    const result = await response.json();

    if (result.errors) {
      return { error: result.errors[0].message };
    }

    const contents = result.data.getContentsByLevel;
    if (contents.error) {
      return { error: contents.error };
    }

    // Validar con Zod
    const validatedContents = contents.data.map((content: any) =>
      FullContentSchema.parse(content)
    );

    return { data: validatedContents };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

export async function getContent(id: string): Promise<ActionResponse<Content>> {
  try {
    if (!id) {
      throw new Error("ID inválido");
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query Content($contentId: ID!) {
            content(id: $contentId) {
              id
              title
              description
              content
              levelId
              createdAt
              updatedAt
            }
          }
        `,
        variables: { contentId: id },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al cargar el contenido");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.content };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getContentsPaginated(
  filters: {
    search?: string;
    levelId?: string;
    skillId?: string;
    validationStatus?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<{ data: any } | { error: string }> {
  try {
    const headers = await getAuthHeaders();
    const {
      search,
      levelId,
      skillId,
      validationStatus,
      page = 1,
      limit = 5,
    } = filters;

    console.log("🔧 getContentsPaginated - Filters:", filters);

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query ContentsPaginated(
            $search: String,
            $levelId: String,
            $skillId: String,
            $validationStatus: String,
            $page: Int,
            $limit: Int
          ) {
            contentsPaginated(
              search: $search,
              levelId: $levelId,
              skillId: $skillId,
              validationStatus: $validationStatus,
              page: $page,
              limit: $limit
            ) {
              contents {
                id
                name
                description
                levelId
                validationStatus
                markdownPath
                skillId
                skill {
                  id
                  name
                  description
                  color
                  isActive
                }
                assignedTeachers {
                  id
                  fullName
                  email
                  roles
                }
                createdAt
                updatedAt
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
        variables: { search, levelId, skillId, validationStatus, page, limit },
      }),
    });

    console.log("🔧 getContentsPaginated - Response status:", response.status);

    if (!response.ok) {
      throw new Error("Error al cargar los contenidos paginados");
    }

    const result = await response.json();
    console.log("🔧 getContentsPaginated - GraphQL result:", result);

    if (result.errors) {
      // Handle authorization errors gracefully
      const authErrors = result.errors.some(
        (error: any) =>
          error.message?.includes("Forbidden") ||
          error.message?.includes("Unauthorized") ||
          error.extensions?.code === "FORBIDDEN" ||
          error.extensions?.code === "UNAUTHENTICATED"
      );

      if (authErrors) {
        console.warn(
          "🔧 getContentsPaginated - Authorization error, returning empty data"
        );
        return {
          data: {
            contents: [],
            total: 0,
            page: 1,
            limit: 5,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      }

      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    console.log(
      "🔧 getContentsPaginated - Content count:",
      result.data.contentsPaginated?.contents?.length || 0
    );

    return { data: result.data.contentsPaginated };
  } catch (error) {
    console.error("Error en getContentsPaginated:", error);
    return {
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

export async function createContent(
  formData: FormData
): Promise<ActionResponse<Content>> {
  try {
    const name = formData.get("name")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const levelId = formData.get("levelId")?.toString() || "";
    const skillId = formData.get("skillId")?.toString() || "";

    if (!name || !description || !levelId) {
      throw new Error("Nombre, descripción y nivel son obligatorios");
    }

    if (!skillId) {
      throw new Error("Skill es obligatorio");
    }

    const headers = await getAuthHeaders();
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          mutation CreateContent($createContentInput: CreateContentInput!) {
            createContent(createContentInput: $createContentInput) {
              id
              name
              description
              levelId
              skillId
              skill {
                id
                name
                color
              }
              markdownPath
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          createContentInput: {
            name,
            description,
            levelId,
            skillId,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al crear el contenido");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.createContent };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateContent(
  id: string,
  formData: FormData
): Promise<ActionResponse<Content>> {
  try {
    if (!id) {
      throw new Error("ID inválido");
    }

    const name = formData.get("name")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const levelId = formData.get("levelId")?.toString() || "";
    const skillId = formData.get("skillId")?.toString() || "";

    const headers = await getAuthHeaders();
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          mutation UpdateContent($updateContentInput: UpdateContentInput!) {
            updateContent(updateContentInput: $updateContentInput) {
              id
              name
              description
              levelId
              skillId
              skill {
                id
                name
                color
              }
              markdownPath
              assignedTeachers {
                id
                fullName
                email
                roles
              }
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          updateContentInput: {
            id,
            name,
            description,
            ...(levelId && { levelId }),
            ...(skillId && { skillId }),
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el contenido");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.updateContent };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteContent(
  id: string
): Promise<ActionResponse<Content>> {
  try {
    if (!id) {
      throw new Error("ID inválido");
    }

    const headers = await getAuthHeaders();
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          mutation RemoveContent($removeContentId: ID!) {
            removeContent(id: $removeContentId) {
              id
              name
              description
              levelId
              createdAt
              updatedAt
            }
          }
        `,
        variables: { removeContentId: id },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el contenido");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.removeContent };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getContentsByTeacher(
  teacherId: string
): Promise<ContentsResponse> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query ContentsByTeacher($teacherId: ID!) {
          contentsByTeacher(teacherId: $teacherId) {
            id
            title
            description
            content
            levelId
            markdownPath
            assignedTeachers {
              id
              fullName
              email
              roles
            }
            createdAt
            updatedAt
          }
        }
      `,
      variables: { teacherId },
    }),
  });

  if (!response.ok) {
    throw new Error("Error al cargar los contenidos del profesor");
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors.map((err: any) => err.message).join(", "));
  }

  return { data: result.data.contentsByTeacher || [] };
}

export async function getMyAssignedContents(): Promise<ContentsResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query MyAssignedContents {
            myAssignedContents {
              id
              name
              description
              levelId
              markdownPath
              assignedTeachers {
                id
                fullName
                email
                roles
              }
              createdAt
              updatedAt
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`
      );
    }

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.myAssignedContents || [] };
  } catch (error) {
    console.error("Error en getMyAssignedContents:", error);
    throw error;
  }
}

export async function assignTeachersToContent(
  contentId: string,
  teacherIds: string[]
): Promise<ActionResponse<Content>> {
  try {
    const headers = await getAuthHeaders();
    console.log("📤 Asignando profesores al contenido:", contentId);
    console.log("👨‍🏫 IDs de profesores:", teacherIds);

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          mutation AssignTeachersToContent($contentId: ID!, $teacherIds: [ID!]!) {
            assignTeachersToContent(contentId: $contentId, teacherIds: $teacherIds) {
              id
              name
              description
              levelId
              markdownPath
              assignedTeachers {
                id
                fullName
                email
                roles
              }
              createdAt
              updatedAt
            }
          }
        `,
        variables: { contentId, teacherIds },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error en respuesta HTTP:", errorText);
      throw new Error(`Error HTTP al asignar profesores: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error("❌ Errores GraphQL en asignación:", result.errors);
      const errorMessages = result.errors
        .map((err: any) => err.message)
        .join(", ");

      // Detectar si es un error de permisos relacionado con superUser
      if (errorMessages.includes("superUser")) {
        console.warn(
          "⚠️ Error de permisos detectado: Se requiere superUser para esta operación"
        );
      }

      throw new Error(errorMessages);
    }

    return { data: result.data.assignTeachersToContent };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function removeTeacherFromContent(
  contentId: string,
  teacherId: string
): Promise<ActionResponse<Content>> {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation RemoveTeacherFromContent($contentId: ID!, $teacherId: ID!) {
            removeTeacherFromContent(contentId: $contentId, teacherId: $teacherId) {
              id
              title
              description
              content
              levelId
              markdownPath
              assignedTeachers {
                id
                fullName
                email
                roles
              }
              createdAt
              updatedAt
            }
          }
        `,
        variables: { contentId, teacherId },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al remover profesor");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.removeTeacherFromContent };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getContentMarkdown(
  contentId: string
): Promise<ActionResponse<string>> {
  console.log("🔍 getContentMarkdown - Starting with contentId:", contentId);

  try {
    if (!contentId) {
      console.log("🔍 getContentMarkdown - No contentId provided");
      throw new Error("ID del contenido es requerido");
    }

    // Validar formato del ID antes de hacer la consulta
    if (!isValidContentId(contentId)) {
      console.log(
        "🔍 getContentMarkdown - Invalid contentId format:",
        contentId
      );
      throw new Error("El identificador del contenido no es válido");
    }

    console.log("🔍 Cargando markdown para contentId:", contentId);

    const headers = await getAuthHeaders();
    const hasAuth = headers.Authorization;

    console.log("🔍 getContentMarkdown - Has auth:", !!hasAuth);

    // Use public endpoint for non-authenticated users, private for authenticated
    const queryName = hasAuth ? "contentMarkdown" : "contentMarkdownPublic";

    console.log(
      "🔧 getContentMarkdown - Using query:",
      queryName,
      "for contentId:",
      contentId
    );

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query GetContentMarkdown($contentId: ID!) {
            ${queryName}(contentId: $contentId)
          }
        `,
        variables: { contentId },
      }),
    });

    console.log("🔍 getContentMarkdown - Response status:", response.status);
    console.log("🔍 getContentMarkdown - Response OK:", response.ok);

    if (!response.ok) {
      console.log(
        "🔍 getContentMarkdown - Response not OK:",
        response.status,
        response.statusText
      );
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("📦 Respuesta del servidor:", result);

    if (result.errors) {
      console.log("🔍 getContentMarkdown - GraphQL errors:", result.errors);

      // Handle authorization errors gracefully for public access
      const authErrors = result.errors.some(
        (error: any) =>
          error.message?.includes("Forbidden") ||
          error.message?.includes("Unauthorized") ||
          error.extensions?.code === "FORBIDDEN" ||
          error.extensions?.code === "UNAUTHENTICATED"
      );

      if (authErrors) {
        console.warn(
          "🔧 getContentMarkdown - Authorization error, trying public endpoint"
        );
        // If not already using public endpoint, try it
        if (hasAuth) {
          // Retry with public endpoint
          const publicResponse = await fetch(GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                query GetContentMarkdown($contentId: ID!) {
                  contentMarkdownPublic(contentId: $contentId)
                }
              `,
              variables: { contentId },
            }),
          });

          if (publicResponse.ok) {
            const publicResult = await publicResponse.json();
            if (!publicResult.errors) {
              return { data: publicResult.data.contentMarkdownPublic };
            }
          }
        }

        return {
          error:
            "No tienes permisos para acceder a este contenido o el contenido no está validado",
        };
      }

      const errorMessage = result.errors
        .map((err: any) => err.message)
        .join(", ");
      console.error("❌ Error GraphQL:", errorMessage);
      throw new Error(sanitizeErrorMessage(errorMessage));
    }

    console.log(
      "✅ Contenido markdown cargado exitosamente, longitud:",
      result.data[queryName]?.length || 0
    );
    return { data: result.data[queryName] };
  } catch (error) {
    console.error("❌ Error en getContentMarkdown:", error);
    console.error("❌ Tipo de error:", typeof error);
    console.error("❌ Propiedades del error:", Object.keys(error || {}));

    const { error: errorMessage } =
      ContentErrorHandler.handleContentError(error);
    return {
      error: errorMessage,
    };
  }
}

export async function updateContentMarkdown(
  contentId: string,
  markdownContent: string
): Promise<ActionResponse<boolean>> {
  try {
    if (!contentId || !markdownContent) {
      throw new Error("ID del contenido y contenido markdown son requeridos");
    }

    // Para IDs de prueba, simular el guardado exitoso
    if (contentId.startsWith("test-")) {
      console.log(
        `🧪 [MODO PRUEBA] Simulando el guardado para el ID: ${contentId}`
      );
      console.log(
        `📝 Contenido a guardar: ${markdownContent.substring(0, 100)}...`
      );

      // Simular un pequeño delay como en una operación real
      await new Promise((resolve) => setTimeout(resolve, 200));

      console.log(`✅ [MODO PRUEBA] Guardado simulado exitosamente`);
      return { data: true };
    }

    // Validar formato del ID antes de hacer la consulta
    if (!isValidContentId(contentId)) {
      throw new Error("El identificador del contenido no es válido");
    }

    const headers = await getAuthHeaders();
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          mutation UpdateContentMarkdown($contentId: ID!, $markdownContent: String!) {
            updateContentMarkdown(contentId: $contentId, markdownContent: $markdownContent)
          }
        `,
        variables: { contentId, markdownContent },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`
      );
    }

    const result = await response.json();

    if (result.errors) {
      const errorMessage = result.errors
        .map((err: any) => err.message)
        .join(", ");
      throw new Error(sanitizeErrorMessage(errorMessage));
    }

    return { data: result.data.updateContentMarkdown };
  } catch (error) {
    console.error("Error en updateContentMarkdown:", error);
    const { error: errorMessage } =
      ContentErrorHandler.handleContentError(error);
    return {
      error: errorMessage,
    };
  }
}

export async function getContentsBySkill(
  skillId: string
): Promise<ContentsResponse> {
  try {
    const headers = await getAuthHeaders();
    const hasAuth = headers.Authorization;

    // Use public endpoint for non-authenticated users, private for authenticated
    const queryName = hasAuth ? "contentsBySkill" : "contentsBySkillPublic";

    console.log(
      "🔧 getContentsBySkill - Using query:",
      queryName,
      "for skillId:",
      skillId
    );

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query ContentsBySkill($skillId: ID!) {
            ${queryName}(skillId: $skillId) {
              id
              name
              description
              levelId
              validationStatus
              markdownPath
              skillId
              skill {
                id
                name
                description
                color
                isActive
              }
              assignedTeachers {
                id
                fullName
                email
                roles
              }
              createdAt
              updatedAt
            }
          }
        `,
        variables: { skillId },
      }),
    });

    console.log("🔧 getContentsBySkill - Response status:", response.status);

    if (!response.ok) {
      throw new Error("Error al cargar los contenidos por skill");
    }

    const result = await response.json();
    console.log("🔧 getContentsBySkill - GraphQL result:", result);

    if (result.errors) {
      // Handle authorization errors gracefully
      const authErrors = result.errors.some(
        (error: any) =>
          error.message?.includes("Forbidden") ||
          error.message?.includes("Unauthorized") ||
          error.extensions?.code === "FORBIDDEN" ||
          error.extensions?.code === "UNAUTHENTICATED"
      );

      if (authErrors) {
        console.warn(
          "🔧 getContentsBySkill - Authorization error, returning empty array"
        );
        return { data: [] };
      }

      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    console.log(
      "🔧 getContentsBySkill - Content count:",
      result.data[queryName]?.length || 0
    );

    return { data: result.data[queryName] || [] };
  } catch (error) {
    console.error("Error en getContentsBySkill:", error);
    throw error;
  }
}

export async function getContentsByLevelAndSkill(
  levelId: string,
  skillId: string
): Promise<ContentsResponse> {
  try {
    const headers = await getAuthHeaders();
    const hasAuth = headers.Authorization;

    // Use public endpoint for non-authenticated users, private for authenticated
    const queryName = hasAuth
      ? "contentsByLevelAndSkill"
      : "contentsByLevelAndSkillPublic";

    console.log(
      "🔧 getContentsByLevelAndSkill - Using query:",
      queryName,
      "for levelId:",
      levelId,
      "skillId:",
      skillId
    );

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query ContentsByLevelAndSkill($levelId: ID!, $skillId: ID!) {
            ${queryName}(levelId: $levelId, skillId: $skillId) {
              id
              name
              description
              levelId
              validationStatus
              markdownPath
              skillId
              skill {
                id
                name
                description
                color
                isActive
              }
              assignedTeachers {
                id
                fullName
                email
                roles
              }
              createdAt
              updatedAt
            }
          }
        `,
        variables: { levelId, skillId },
      }),
    });

    console.log(
      "🔧 getContentsByLevelAndSkill - Response status:",
      response.status
    );

    if (!response.ok) {
      throw new Error("Error al cargar los contenidos por nivel y skill");
    }

    const result = await response.json();
    console.log("🔧 getContentsByLevelAndSkill - GraphQL result:", result);

    if (result.errors) {
      // Handle authorization errors gracefully
      const authErrors = result.errors.some(
        (error: any) =>
          error.message?.includes("Forbidden") ||
          error.message?.includes("Unauthorized") ||
          error.extensions?.code === "FORBIDDEN" ||
          error.extensions?.code === "UNAUTHENTICATED"
      );

      if (authErrors) {
        console.warn(
          "🔧 getContentsByLevelAndSkill - Authorization error, returning empty array"
        );
        return { data: [] };
      }

      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    console.log(
      "🔧 getContentsByLevelAndSkill - Content count:",
      result.data[queryName]?.length || 0
    );

    return { data: result.data[queryName] || [] };
  } catch (error) {
    console.error("Error en getContentsByLevelAndSkill:", error);
    throw error;
  }
}

// Validation functions for admins
export async function validateContent(
  contentId: string
): Promise<ActionResponse<Content>> {
  try {
    if (!contentId) {
      throw new Error("ID del contenido es requerido");
    }

    const headers = await getAuthHeaders();
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          mutation ValidateContent($contentId: ID!) {
            validateContent(contentId: $contentId) {
              id
              name
              description
              levelId
              validationStatus
              markdownPath
              skill {
                id
                name
                color
              }
              assignedTeachers {
                id
                fullName
                email
                roles
              }
              createdAt
              updatedAt
            }
          }
        `,
        variables: { contentId },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`
      );
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.validateContent };
  } catch (error) {
    console.error("Error en validateContent:", error);
    return {
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

export async function invalidateContent(
  contentId: string
): Promise<ActionResponse<Content>> {
  try {
    if (!contentId) {
      throw new Error("ID del contenido es requerido");
    }

    const headers = await getAuthHeaders();
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          mutation InvalidateContent($contentId: ID!) {
            invalidateContent(contentId: $contentId) {
              id
              name
              description
              levelId
              validationStatus
              markdownPath
              skill {
                id
                name
                color
              }
              assignedTeachers {
                id
                fullName
                email
                roles
              }
              createdAt
              updatedAt
            }
          }
        `,
        variables: { contentId },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`
      );
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.invalidateContent };
  } catch (error) {
    console.error("Error en invalidateContent:", error);
    return {
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// Get only validated content for student/public view
export async function getValidatedContentsByLevel(
  levelId: string
): Promise<ContentsResponse> {
  try {
    const headers = await getAuthHeaders();
    const hasAuth = headers.Authorization;

    // Use public endpoint for non-authenticated users (which only returns validated content)
    // Use validated endpoint for authenticated users
    const queryName = hasAuth
      ? "validatedContentsByLevel"
      : "contentsByLevelPublic";

    console.log(
      "🔧 getValidatedContentsByLevel - Using query:",
      queryName,
      "for levelId:",
      levelId
    );

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query ValidatedContentsByLevel($levelId: ID!) {
            ${queryName}(levelId: $levelId) {
              id
              name
              description
              levelId
              validationStatus
              markdownPath
              skillId
              skill {
                id
                name
                description
                color
                isActive
              }
              assignedTeachers {
                id
                fullName
                email
                roles
              }
              createdAt
              updatedAt
            }
          }
        `,
        variables: { levelId },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al cargar los contenidos validados");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data[queryName] || [] };
  } catch (error) {
    console.error("Error en getValidatedContentsByLevel:", error);
    throw error;
  }
}

// Get only validated content by skill for student/public view
export async function getValidatedContentsBySkill(
  skillId: string
): Promise<ContentsResponse> {
  try {
    const headers = await getAuthHeaders();
    const hasAuth = headers.Authorization;

    // Use public endpoint for non-authenticated users (which only returns validated content)
    // Use validated endpoint for authenticated users
    const queryName = hasAuth
      ? "validatedContentsBySkill"
      : "contentsBySkillPublic";

    console.log(
      "🔧 getValidatedContentsBySkill - Using query:",
      queryName,
      "for skillId:",
      skillId
    );

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query ValidatedContentsBySkill($skillId: ID!) {
            ${queryName}(skillId: $skillId) {
              id
              name
              description
              levelId
              validationStatus
              markdownPath
              skillId
              skill {
                id
                name
                description
                color
                isActive
              }
              assignedTeachers {
                id
                fullName
                email
                roles
              }
              createdAt
              updatedAt
            }
          }
        `,
        variables: { skillId },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al cargar los contenidos validados por skill");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data[queryName] || [] };
  } catch (error) {
    console.error("Error en getValidatedContentsBySkill:", error);
    throw error;
  }
}

// Get only validated content by level and skill for student/public view
export async function getValidatedContentsByLevelAndSkill(
  levelId: string,
  skillId: string
): Promise<ContentsResponse> {
  try {
    const headers = await getAuthHeaders();
    const hasAuth = headers.Authorization;

    // Use public endpoint for non-authenticated users (which only returns validated content)
    // Use validated endpoint for authenticated users
    const queryName = hasAuth
      ? "validatedContentsByLevelAndSkill"
      : "contentsByLevelAndSkillPublic";

    console.log(
      "🔧 getValidatedContentsByLevelAndSkill - Using query:",
      queryName,
      "for levelId:",
      levelId,
      "skillId:",
      skillId
    );

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query ValidatedContentsByLevelAndSkill($levelId: ID!, $skillId: ID!) {
            ${queryName}(levelId: $levelId, skillId: $skillId) {
              id
              name
              description
              levelId
              validationStatus
              markdownPath
              skillId
              skill {
                id
                name
                description
                color
                isActive
              }
              assignedTeachers {
                id
                fullName
                email
                roles
              }
              createdAt
              updatedAt
            }
          }
        `,
        variables: { levelId, skillId },
      }),
    });

    if (!response.ok) {
      throw new Error(
        "Error al cargar los contenidos validados por nivel y skill"
      );
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data[queryName] || [] };
  } catch (error) {
    console.error("Error en getValidatedContentsByLevelAndSkill:", error);
    throw error;
  }
}
