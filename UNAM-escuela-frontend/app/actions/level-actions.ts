"use server";
import {
  levelFormSchema,
  levelResponseSchema,
  graphqlLevelsResponseSchema,
} from "../schemas/level-schema";
import { ActionResponse, Level, LevelsResponse } from "../interfaces";
import { GraphQLResponse } from "../types/graphql";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export async function getLevelsByLenguage(id: string): Promise<LevelsResponse> {
  console.log("Cargando niveles para el lenguaje con ID:", id);
  console.log(GRAPHQL_ENDPOINT)
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query LevelsByLenguage($lenguageId: ID!) {
          levelsByLenguage(lenguageId: $lenguageId) {
            id
            name
            description
          }
        }
      `,
      variables: { lenguageId: id },
    }),
  });
  if (!response.ok) {
    throw new Error("Error al cargar los niveles");
  }

  const result = await response.json();
  const validated = graphqlLevelsResponseSchema.safeParse(result);
  if (!validated.success) {
    console.error("Error de validación:", validated.error.errors);
    throw new Error("Formato de respuesta inválido del servidor");
  }

  return { data: validated.data.data.levelsByLenguage };
}

export async function getLevel(id: string): Promise<ActionResponse<Level>> {
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
          query Level($levelId: ID!) {
            level(id: $levelId) {
              id
              name
              description
              status
            }
          }
        `,
        variables: { levelId: id },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al cargar el nivel");
    }

    const result: GraphQLResponse = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err) => err.message).join(", "));
    }

    const validated = levelResponseSchema.safeParse(
      (result.data as { level: unknown }).level
    );
    if (!validated.success) {
      throw new Error("Formato de respuesta inválido del servidor");
    }

    return { data: validated.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createLevel(
  formData: FormData
): Promise<ActionResponse<Level>> {
  try {
    const rawData = {
      name: formData.get("name")?.toString() || "",
      description: formData.get("description")?.toString() || "",
    };

    const validated = levelFormSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        error: validated.error.errors.map((e) => e.message).join(", "),
      };
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation CreateLevel($name: String!, $description: String!) {
            createLevel(createLevelInput: { name: $name, description: $description }) {
              id
              name
              description
            }
          }
        `,
        variables: validated.data,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al crear el nivel");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    const validatedResponse = levelResponseSchema.safeParse(
      result.data.createLevel
    );
    if (!validatedResponse.success) {
      throw new Error("Formato de respuesta inválido del servidor");
    }

    return { data: validatedResponse.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteLevel(id: string): Promise<ActionResponse<Level>> {
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
          mutation RemoveLevel($removeLevelId: ID!) {
            removeLevel(id: $removeLevelId) {
              id
              name
              description
              isCompleted
              percentaje
              qualification
              createdAt
              updatedAt
              userId
            }
          }
        `,
        variables: { removeLevelId: id },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el nivel");
    }

    const result = await response.json();

    if (result.errors) {
      const errorMessage = result.errors
        .map((err: any) => err.message)
        .join(", ");
      throw new Error(errorMessage);
    }

    if (!result.data?.removeLevel) {
      throw new Error("No se pudo eliminar el nivel - respuesta vacía");
    }

    return { data: result.data.removeLevel };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error detallado:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        cause: error.cause,
      });
    } else {
      console.error("Se supone que esto no deberia pasar:", error);
    }

    return {
      error:
        error instanceof Error
          ? `Error al eliminar: ${error.message}`
          : "Error desconocido al eliminar el nivel",
    };
  }
}
