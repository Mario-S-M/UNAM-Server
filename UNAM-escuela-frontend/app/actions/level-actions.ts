"use server";
import { client } from "@/lib/apollo-client";
import { CREATE_LEVEL, DELETE_LEVEL, GET_LEVEL, GET_LEVELS } from "../queries";
import {
  levelFormSchema,
  levelResponseSchema,
  graphqlLevelsResponseSchema,
} from "../schemas/level-schema";
import {
  ActionResponse,
  Level,
  LevelsResponse,
  LevelQueryResponse,
} from "../interfaces";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export async function getLevelsByLenguage(id: string): Promise<LevelsResponse> {
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

  // El campo correcto es levelsByLenguage
  return { data: validated.data.data.levelsByLenguage };
}

export async function getLevel(id: string): Promise<ActionResponse<Level>> {
  try {
    if (!id) {
      throw new Error("ID inválido");
    }

    const { data } = await client.query<LevelQueryResponse>({
      query: GET_LEVEL,
      variables: { levelId: id },
    });

    const validated = levelResponseSchema.safeParse(data.level);
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

    const { data } = await client.mutate({
      mutation: CREATE_LEVEL,
      variables: validated.data,
      refetchQueries: [{ query: GET_LEVELS }],
      awaitRefetchQueries: true,
    });

    const validatedResponse = levelResponseSchema.safeParse(data.createLevel);
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
    const response = await client.mutate({
      mutation: DELETE_LEVEL,
      variables: { removeLevelId: id },
      refetchQueries: [{ query: GET_LEVELS }],
      awaitRefetchQueries: true,
    });

    if (response.errors) {
      const errorMessage = response.errors.map((err) => err.message).join(", ");
      throw new Error(errorMessage);
    }

    if (!response.data?.removeLevel) {
      throw new Error("No se pudo eliminar el nivel - respuesta vacía");
    }
    return { data: response.data.removeLevel };
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
