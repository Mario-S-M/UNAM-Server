"use server";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export interface Activity {
  id: string;
  title: string;
  description: string;
  instructions: string;
  contentId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivitiesResponse {
  data: Activity[];
}

export interface ActionResponse<T> {
  data?: T;
  error?: string;
}

export async function getActivitiesByContent(
  contentId: string
): Promise<ActivitiesResponse> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query ActivitiesByContent($contentId: ID!) {
          activitiesByContent(contentId: $contentId) {
            id
            title
            description
            instructions
            contentId
            createdAt
            updatedAt
          }
        }
      `,
      variables: { contentId },
    }),
  });

  if (!response.ok) {
    throw new Error("Error al cargar las actividades");
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors.map((err: any) => err.message).join(", "));
  }

  return { data: result.data.activitiesByContent || [] };
}

export async function getAllActivities(): Promise<ActivitiesResponse> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query Activities {
          activities {
            id
            title
            description
            instructions
            contentId
            createdAt
            updatedAt
          }
        }
      `,
    }),
  });

  if (!response.ok) {
    throw new Error("Error al cargar las actividades");
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors.map((err: any) => err.message).join(", "));
  }

  return { data: result.data.activities || [] };
}

export async function getActivity(
  id: string
): Promise<ActionResponse<Activity>> {
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
          query Activity($activityId: ID!) {
            activity(id: $activityId) {
              id
              title
              description
              instructions
              contentId
              createdAt
              updatedAt
            }
          }
        `,
        variables: { activityId: id },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al cargar la actividad");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.activity };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createActivity(
  formData: FormData
): Promise<ActionResponse<Activity>> {
  try {
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const instructions = formData.get("instructions")?.toString() || "";
    const contentId = formData.get("contentId")?.toString() || "";

    if (!title || !description || !contentId) {
      throw new Error("Título, descripción y contenido son obligatorios");
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation CreateActivity($createActivityInput: CreateActivityInput!) {
            createActivity(createActivityInput: $createActivityInput) {
              id
              title
              description
              instructions
              contentId
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          createActivityInput: {
            title,
            description,
            instructions,
            contentId,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al crear la actividad");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.createActivity };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateActivity(
  id: string,
  formData: FormData
): Promise<ActionResponse<Activity>> {
  try {
    if (!id) {
      throw new Error("ID inválido");
    }

    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const instructions = formData.get("instructions")?.toString() || "";

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation UpdateActivity($updateActivityInput: UpdateActivityInput!) {
            updateActivity(updateActivityInput: $updateActivityInput) {
              id
              title
              description
              instructions
              contentId
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          updateActivityInput: {
            id,
            title,
            description,
            instructions,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar la actividad");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.updateActivity };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteActivity(
  id: string
): Promise<ActionResponse<Activity>> {
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
          mutation RemoveActivity($removeActivityId: ID!) {
            removeActivity(id: $removeActivityId) {
              id
              title
              description
              instructions
              contentId
              createdAt
              updatedAt
            }
          }
        `,
        variables: { removeActivityId: id },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la actividad");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.removeActivity };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
