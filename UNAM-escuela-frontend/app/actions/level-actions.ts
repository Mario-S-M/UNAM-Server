"use server";
import {
  levelFormSchema,
  levelResponseSchema,
  graphqlLevelsResponseSchema,
} from "../schemas/level-schema";
import { ActionResponse, Level, LevelsResponse } from "../interfaces";
import { GraphQLResponse } from "../types/graphql";
import { getAuthHeaders } from "./user-actions";
import { cookies } from "next/headers";
import { BasicLevelSchema, FullLevelSchema } from "../schemas";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export async function getLevelsByLenguage(id: string): Promise<LevelsResponse> {
  const headers = await getAuthHeaders();

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: `
        query LevelsByLenguage($lenguageId: ID!) {
          levelsByLenguage(lenguageId: $lenguageId) {
            id
            name
            description
            difficulty
            isActive
          }
        }
      `,
      variables: { lenguageId: id },
    }),
  });
  if (!response.ok) {
    console.error(`Error HTTP ${response.status}: ${response.statusText}`);
    throw new Error("Error al cargar los niveles");
  }

  const result = await response.json();
  console.log(
    "🔍 Respuesta del servidor (getLevelsByLenguage):",
    JSON.stringify(result, null, 2)
  );

  // Manejar errores de GraphQL
  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error(result.errors.map((err: any) => err.message).join(", "));
  }

  const validated = graphqlLevelsResponseSchema.safeParse(result);
  if (!validated.success) {
    console.error("Error de validación:", validated.error.errors);
    console.error("Datos recibidos:", result);

    // Intentar una validación más permisiva
    if (result.data && result.data.levelsByLenguage) {
      console.log("🔧 Intentando validación permisiva...");
      return { data: result.data.levelsByLenguage };
    }

    throw new Error("Formato de respuesta inválido del servidor");
  }

  return { data: validated.data.data.levelsByLenguage };
}

/**
 * Versión pública de getLevelsByLenguage que no requiere autenticación
 * Para uso en páginas públicas como /main/lenguages/[id]/view
 */
export async function getLevelsByLenguagePublic(
  id: string
): Promise<LevelsResponse> {
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
            difficulty
            isActive
          }
        }
      `,
      variables: { lenguageId: id },
    }),
  });

  if (!response.ok) {
    console.error(`Error HTTP ${response.status}: ${response.statusText}`);
    throw new Error("Error al cargar los niveles");
  }

  const result = await response.json();

  // Manejar errores de GraphQL
  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error(result.errors.map((err: any) => err.message).join(", "));
  }

  const validated = graphqlLevelsResponseSchema.safeParse(result);
  if (!validated.success) {
    console.error("Error de validación:", validated.error.errors);
    console.error("Datos recibidos:", result);

    // Intentar una validación más permisiva
    if (result.data && result.data.levelsByLenguage) {
      console.log("🔧 Intentando validación permisiva...");
      return { data: result.data.levelsByLenguage };
    }

    throw new Error("Formato de respuesta inválido del servidor");
  }

  return { data: validated.data.data.levelsByLenguage };
}

export async function getLevel(id: string): Promise<ActionResponse<Level>> {
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
          query Level($levelId: ID!) {
            level(id: $levelId) {
              id
              name
              description
              difficulty
              isActive
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
      difficulty: formData.get("difficulty")?.toString() || "beginner",
      lenguageId: formData.get("lenguageId")?.toString() || "",
    };

    const validated = levelFormSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        error: validated.error.errors.map((e) => e.message).join(", "),
      };
    }

    const headers = await getAuthHeaders();

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          mutation CreateLevel($name: String!, $description: String!, $difficulty: String, $lenguageId: ID!) {
            createLevel(createLevelInput: { name: $name, description: $description, difficulty: $difficulty, lenguageId: $lenguageId }) {
              id
              name
              description
              difficulty
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

export async function updateLevel(
  id: string,
  formData: FormData
): Promise<ActionResponse<Level>> {
  try {
    if (!id) {
      throw new Error("ID inválido");
    }

    const rawData = {
      id,
      name: formData.get("name")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      difficulty: formData.get("difficulty")?.toString() || "beginner",
    };

    // Validar solo los campos que no son ID ni lenguageId
    const updateSchema = levelFormSchema.omit({ lenguageId: true });
    const validated = updateSchema.safeParse({
      ...rawData,
      lenguageId: "dummy", // Agregar valor dummy para pasar validación
    });
    if (!validated.success) {
      return {
        error: validated.error.errors.map((e) => e.message).join(", "),
      };
    }

    const headers = await getAuthHeaders();

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          mutation UpdateLevel($updateLevelInput: UpdateLevelInput!) {
            updateLevel(updateLevelInput: $updateLevelInput) {
              id
              name
              description
              difficulty
              isActive
            }
          }
        `,
        variables: {
          updateLevelInput: {
            id: rawData.id,
            name: rawData.name,
            description: rawData.description,
            difficulty: rawData.difficulty,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el nivel");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    const validatedResponse = levelResponseSchema.safeParse(
      result.data.updateLevel
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

    const headers = await getAuthHeaders();

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
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

export async function getLevelsList() {
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
          query GetLevels {
            levels {
              id
              name
              isActive
              languageId
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

    const levelsData = result.data.levels;

    // Validar cada nivel con Zod
    const validatedLevels = levelsData
      .map((level: any) => {
        try {
          return BasicLevelSchema.parse(level);
        } catch (error) {
          return null;
        }
      })
      .filter(Boolean);

    return { success: true, data: validatedLevels };
  } catch (error) {
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function getLevelById(levelId: string) {
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
          query GetLevelById($id: String!) {
            level(id: $id) {
              id
              name
              description
              isActive
              languageId
              createdAt
              updatedAt
            }
          }
        `,
        variables: { id: levelId },
      }),
    });

    if (!response.ok) {
      return { success: false, error: "Error en la respuesta del servidor" };
    }

    const result = await response.json();

    if (result.errors) {
      return { success: false, error: "Error en GraphQL" };
    }

    const levelData = result.data.level;

    if (!levelData) {
      return { success: false, error: "Nivel no encontrado" };
    }

    // Validar el nivel con Zod
    const validatedLevel = FullLevelSchema.parse(levelData);

    return { success: true, data: validatedLevel };
  } catch (error) {
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function getLevelsByLanguage(languageId: string) {
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
          query GetLevelsByLanguage($languageId: String!) {
            levelsByLanguage(languageId: $languageId) {
              id
              name
              isActive
              languageId
            }
          }
        `,
        variables: { languageId },
      }),
    });

    if (!response.ok) {
      return { success: false, error: "Error en la respuesta del servidor" };
    }

    const result = await response.json();

    if (result.errors) {
      return { success: false, error: "Error en GraphQL" };
    }

    const levelsData = result.data.levelsByLanguage;

    // Validar cada nivel con Zod
    const validatedLevels = levelsData
      .map((level: any) => {
        try {
          return BasicLevelSchema.parse(level);
        } catch (error) {
          return null;
        }
      })
      .filter(Boolean);

    return { success: true, data: validatedLevels };
  } catch (error) {
    return { success: false, error: "Error interno del servidor" };
  }
}
