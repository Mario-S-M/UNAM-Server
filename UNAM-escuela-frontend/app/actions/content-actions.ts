"use server";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export interface Content {
  id: string;
  title: string;
  description: string;
  content?: string;
  levelId: string;
  createdAt?: string;
  updatedAt?: string;
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
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query ContentsByLevel($levelId: ID!) {
          contentsByLevel(levelId: $levelId) {
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
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const levelId = formData.get("levelId")?.toString() || "";

    if (!title || !description || !levelId) {
      throw new Error("Título, descripción y nivel son obligatorios");
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation CreateContent($createContentInput: CreateContentInput!) {
            createContent(createContentInput: $createContentInput) {
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
          createContentInput: {
            title,
            description,
            content,
            levelId,
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

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation RemoveContent($removeContentId: ID!) {
            removeContent(id: $removeContentId) {
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
