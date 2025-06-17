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
  const headers = await getAuthHeaders();
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: `
        query ContentsByLevel($levelId: ID!) {
          contentsByLevel(levelId: $levelId) {
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
      variables: { levelId },
    }),
  });

  if (!response.ok) {
    throw new Error("Error al cargar los contenidos");
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors.map((err: any) => err.message).join(", "));
  }

  return { data: result.data.contentsByLevel || [] };
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

    if (!name || !description || !levelId) {
      throw new Error("Nombre, descripción y nivel son obligatorios");
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
      throw new Error("Error al asignar profesores");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
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
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query GetContentMarkdown($contentId: ID!) {
            contentMarkdown(contentId: $contentId)
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
      const errorMessage = result.errors
        .map((err: any) => err.message)
        .join(", ");
      console.error("❌ Error GraphQL:", errorMessage);
      throw new Error(sanitizeErrorMessage(errorMessage));
    }

    console.log(
      "✅ Contenido markdown cargado exitosamente, longitud:",
      result.data.contentMarkdown?.length || 0
    );
    return { data: result.data.contentMarkdown };
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
