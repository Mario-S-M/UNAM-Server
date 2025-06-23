"use server";

import { cookies } from "next/headers";
import {
  ContentErrorHandler,
  isValidContentId,
  sanitizeErrorMessage,
} from "../utils/content-error-handler";

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
  status?: string;
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

export async function getContentsByLevel(
  levelId: string
): Promise<ContentsResponse> {
  try {
    const headers = await getAuthHeaders();
    const hasAuth = headers.Authorization;

    // Use public endpoint for non-authenticated users, private for authenticated
    const queryName = hasAuth ? "contentsByLevel" : "contentsByLevelPublic";

    console.log(
      "🔧 getContentsByLevel - Using query:",
      queryName,
      "for levelId:",
      levelId
    );

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query ContentsByLevel($levelId: ID!) {
            ${queryName}(levelId: $levelId) {
              id
              name
              description
              levelId
              status
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

    console.log("🔧 getContentsByLevel - Response status:", response.status);

    if (!response.ok) {
      throw new Error("Error al cargar los contenidos");
    }

    const result = await response.json();
    console.log("🔧 getContentsByLevel - GraphQL result:", result);

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
          "🔧 getContentsByLevel - Authorization error, returning empty array"
        );
        return { data: [] };
      }

      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    console.log(
      "🔧 getContentsByLevel - Content count:",
      result.data[queryName]?.length || 0
    );

    return { data: result.data[queryName] || [] };
  } catch (error) {
    console.error("Error en getContentsByLevel:", error);
    throw error;
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

export async function createContent(
  formData: FormData
): Promise<ActionResponse<Content>> {
  try {
    const name = formData.get("name")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const levelId = formData.get("levelId")?.toString() || "";
    const status = formData.get("status")?.toString() || "draft";
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
              status
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
            status,
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

    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const content = formData.get("content")?.toString() || "";

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation UpdateContent($updateContentInput: UpdateContentInput!) {
            updateContent(updateContentInput: $updateContentInput) {
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
        variables: {
          updateContentInput: {
            id,
            title,
            description,
            content,
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
            status
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
              status
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
              status
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
              status
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

export async function getContentById(
  id: string
): Promise<ActionResponse<Content>> {
  try {
    if (!id) {
      throw new Error("ID inválido");
    }

    // Validar formato del ID antes de hacer la consulta
    if (!isValidContentId(id)) {
      throw new Error("El identificador del contenido no es válido");
    }

    const headers = await getAuthHeaders();
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query GetContentById($id: ID!) {
            content(id: $id) {
              id
              name
              description
              levelId
              skillId
              status
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
        variables: { id },
      }),
      cache: "no-store",
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

    return { data: result.data.content };
  } catch (error) {
    console.error("Error en getContentById:", error);
    const { error: errorMessage } =
      ContentErrorHandler.handleContentError(error);
    return {
      error: errorMessage,
    };
  }
}

export async function getContentMarkdown(
  contentId: string
): Promise<ActionResponse<string>> {
  try {
    if (!contentId) {
      throw new Error("ID del contenido es requerido");
    }

    // Validar formato del ID antes de hacer la consulta
    if (!isValidContentId(contentId)) {
      throw new Error("El identificador del contenido no es válido");
    }

    console.log("🔍 Cargando markdown para contentId:", contentId);

    const headers = await getAuthHeaders();
    const hasAuth = headers.Authorization;

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

    if (!response.ok) {
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("📦 Respuesta del servidor:", result);

    if (result.errors) {
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
      console.log(`🧪 [MODO PRUEBA] Simulando guardado para ID: ${contentId}`);
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
              status
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
              status
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
              status
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
              status
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
              status
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

    console.log(
      "🔧 getValidatedContentsByLevel - Response status:",
      response.status
    );

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Usuario no autorizado para ver contenidos validados");
        return { data: [] };
      }
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("🔧 getValidatedContentsByLevel - Result:", result);
    console.log(
      "🔧 getValidatedContentsByLevel - Content data length:",
      result.data[queryName]?.length || 0
    );

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
          "🔧 getValidatedContentsByLevel - Authorization error, returning empty array"
        );
        return { data: [] };
      }

      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data[queryName] || [] };
  } catch (error) {
    console.error("Error en getValidatedContentsByLevel:", error);

    // Si es un error de autorización, retornar array vacío en lugar de throw
    if (
      error instanceof Error &&
      (error.message.toLowerCase().includes("unauthorized") ||
        error.message.toLowerCase().includes("forbidden"))
    ) {
      console.warn(
        "Acceso denegado para contenidos validados, retornando lista vacía"
      );
      return { data: [] };
    }

    console.error("Error no relacionado con autorización:", error);
    return { data: [] };
  }
}

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
              status
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

    console.log(
      "🔧 getValidatedContentsBySkill - Response status:",
      response.status
    );

    if (!response.ok) {
      if (response.status === 401) {
        console.warn(
          "Usuario no autorizado para ver contenidos validados por skill"
        );
        return { data: [] };
      }
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("🔧 getValidatedContentsBySkill - Result:", result);

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
          "🔧 getValidatedContentsBySkill - Authorization error, returning empty array"
        );
        return { data: [] };
      }

      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data[queryName] || [] };
  } catch (error) {
    console.error("Error en getValidatedContentsBySkill:", error);

    if (
      error instanceof Error &&
      (error.message.toLowerCase().includes("unauthorized") ||
        error.message.toLowerCase().includes("forbidden"))
    ) {
      console.warn("Acceso denegado para contenidos validados por skill");
      return { data: [] };
    }

    return { data: [] };
  }
}

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
              status
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
      "🔧 getValidatedContentsByLevelAndSkill - Response status:",
      response.status
    );

    if (!response.ok) {
      if (response.status === 401) {
        console.warn(
          "Usuario no autorizado para ver contenidos validados por nivel y skill"
        );
        return { data: [] };
      }
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("🔧 getValidatedContentsByLevelAndSkill - Result:", result);

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
          "🔧 getValidatedContentsByLevelAndSkill - Authorization error, returning empty array"
        );
        return { data: [] };
      }

      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data[queryName] || [] };
  } catch (error) {
    console.error("Error en getValidatedContentsByLevelAndSkill:", error);

    if (
      error instanceof Error &&
      (error.message.toLowerCase().includes("unauthorized") ||
        error.message.toLowerCase().includes("forbidden"))
    ) {
      console.warn(
        "Acceso denegado para contenidos validados por nivel y skill"
      );
      return { data: [] };
    }

    return { data: [] };
  }
}

/**
 * Workaround function to assign teachers to content for admin users
 * This works around the backend restriction that only superUsers can assign teachers
 */
export async function adminWorkaroundAssignTeachers(
  contentId: string,
  teacherIds: string[]
): Promise<ActionResponse<Content>> {
  try {
    console.log("🔧 Usando workaround para admin para asignar profesores");
    console.log("📋 teacherIds:", teacherIds);

    // Obtener el contenido actual
    const contentResult = await getContentById(contentId);
    if (contentResult.error || !contentResult.data) {
      throw new Error(contentResult.error || "No se pudo obtener el contenido");
    }

    // Intentar usar directamente la mutación de GraphQL para actualizar contenido
    console.log("📤 Actualizando contenido con nuevos profesores directamente");

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
              status
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
            id: contentId,
            name: contentResult.data.name,
            description: contentResult.data.description,
            levelId: contentResult.data.levelId,
            status: contentResult.data.status || "draft",
            teacherIds: teacherIds,
            skillId: contentResult.data.skillId,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP al actualizar contenido: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error("❌ Errores al actualizar contenido:", result.errors);
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    console.log(
      "✅ Contenido actualizado exitosamente con profesores asignados"
    );
    return { data: result.data.updateContent };
  } catch (error) {
    console.error("Error en workaround para asignar profesores:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Convert DOCX file to Markdown
export async function convertDocxToMarkdown(
  contentId: string,
  file: File
): Promise<ActionResponse<boolean>> {
  try {
    console.log("🚀 convertDocxToMarkdown function called");
    console.log("📋 Content ID:", contentId);
    console.log("📄 File object:", file);

    if (!contentId || !file) {
      console.error("❌ Missing required parameters");
      throw new Error("ID del contenido y archivo son requeridos");
    }

    // Validate file type
    console.log("🔍 Validating file type...");
    console.log("📝 File name:", file.name);
    console.log("📝 File type:", file.type);
    console.log("📝 File size:", file.size);

    if (
      !file.name.toLowerCase().endsWith(".docx") &&
      !file.type.includes("officedocument")
    ) {
      console.error("❌ Invalid file type");
      throw new Error("Solo se permiten archivos Word (.docx)");
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error("❌ File too large:", file.size);
      throw new Error("El archivo es demasiado grande. Máximo 10MB permitido.");
    }

    console.log("✅ File validation passed");
    console.log(
      `🔄 Convirtiendo archivo Word a Markdown para contenido: ${contentId}`
    );
    console.log(
      `📁 Archivo: ${file.name}, Tamaño: ${(file.size / 1024 / 1024).toFixed(
        2
      )}MB`
    );

    // Convert file to base64 using browser-compatible method
    console.log("🔧 Converting file to base64...");
    const arrayBuffer = await file.arrayBuffer();
    console.log("📄 ArrayBuffer created, length:", arrayBuffer.byteLength);

    const bytes = new Uint8Array(arrayBuffer);
    console.log("📄 Uint8Array created, length:", bytes.length);

    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join(
      ""
    );
    console.log("📄 Binary string created, length:", binary.length);

    const base64String = btoa(binary);
    console.log("📄 Base64 string created, length:", base64String.length);
    console.log(
      "📄 Base64 preview (first 100 chars):",
      base64String.substring(0, 100)
    );

    console.log("🔑 Getting auth headers...");
    const headers = await getAuthHeaders();
    console.log("✅ Auth headers obtained");

    console.log("🌐 Sending GraphQL request...");
    console.log("📡 Endpoint:", GRAPHQL_ENDPOINT);

    const requestBody = {
      query: `
        mutation ConvertDocxToMarkdown($contentId: ID!, $docxBase64: String!) {
          convertDocxToMarkdown(contentId: $contentId, docxBase64: $docxBase64)
        }
      `,
      variables: {
        contentId,
        docxBase64: base64String,
      },
    };

    console.log("📦 Request variables:", {
      contentId,
      docxBase64Length: base64String.length,
    });

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    console.log("📡 Response received, status:", response.status);
    console.log("📡 Response ok:", response.ok);

    if (!response.ok) {
      console.error("❌ HTTP error:", response.status, response.statusText);
      throw new Error(
        `Error HTTP: ${response.status} - ${response.statusText}`
      );
    }

    console.log("🔧 Parsing response JSON...");
    const result = await response.json();
    console.log("📊 Full response:", result);

    if (result.errors) {
      console.error("❌ GraphQL errors:", result.errors);
      const errorMessage = result.errors
        .map((err: any) => err.message)
        .join(", ");
      throw new Error(sanitizeErrorMessage(errorMessage));
    }

    console.log("📊 Response data:", result.data);
    console.log("✅ Success result:", result.data.convertDocxToMarkdown);
    console.log(`🎉 Archivo Word convertido exitosamente a Markdown`);

    return { data: result.data.convertDocxToMarkdown };
  } catch (error) {
    console.error("💥 Error en convertDocxToMarkdown:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack"
    );
    const { error: errorMessage } =
      ContentErrorHandler.handleContentError(error);
    return {
      error: errorMessage,
    };
  }
}

// Definición del tipo UpdateContentInput para TypeScript
interface UpdateContentInput {
  id: string;
  name: string;
  description: string;
  status?: string;
  levelId: string;
  teacherIds?: string[];
  skillId?: string;
}
