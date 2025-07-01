import { LenguageResponse, SingleLenguageResponse } from "../interfaces";
import {
  graphqlLenguagesResponseSchema,
  graphqlSingleLenguageResponseSchema,
} from "../schemas/lenguage-schema";
import { getAuthHeaders } from "./user-actions";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export async function getActiveLenguages(): Promise<LenguageResponse> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
        query LenguagesActivate {
          lenguagesActivate {
            id
            name
            isActive
          }
        }
              `,
      }),
    });

    if (!response.ok) {
      console.error(`Error HTTP ${response.status}: ${response.statusText}`);
      throw new Error("Error al cargar los idiomas");
    }

    const result = await response.json();
    console.log(
      "🔍 Respuesta del servidor (getActiveLenguages):",
      JSON.stringify(result, null, 2)
    );

    // Manejar errores de GraphQL
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    const validated = graphqlLenguagesResponseSchema.safeParse(result);
    if (!validated.success) {
      console.error("Error de validación:", validated.error.errors);
      console.error("Datos recibidos:", result);

      // Intentar una validación más permisiva
      if (result.data && result.data.lenguagesActivate) {
        console.log("🔧 Intentando validación permisiva...");
        return { data: result.data.lenguagesActivate };
      }

      throw new Error("Formato de respuesta inválido del servidor");
    }
    return { data: validated.data.data.lenguagesActivate };
  } catch (error) {
    console.error("Error en getActiveLenguages:", error);
    throw error;
  }
}

// Public version - no authentication required
export async function getActiveLenguagesPublic(): Promise<LenguageResponse> {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        query Lenguages {
          lenguages {
            id
            name
            isActive
          }
        }
              `,
      }),
    });

    if (!response.ok) throw new Error("Error al cargar los idiomas");

    const result = await response.json();

    // Manejar errores de GraphQL
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    // Para la versión pública, usar el campo 'lenguages' y filtrar solo activos
    const languages =
      result.data?.lenguages?.filter((lang: any) => lang.isActive) || [];

    return { data: languages };
  } catch (error) {
    console.error("Error en getActiveLenguagesPublic:", error);
    throw error;
  }
}

export async function getLanguageById(
  id: string
): Promise<SingleLenguageResponse> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      query Lenguage($id: ID!) {
        lenguage(id: $id) {
          id
          name
          isActive
        }
      }
      `,
      variables: { id },
    }),
  });
  if (!response.ok) throw new Error("Error al cargar el idioma");
  const result = await response.json();
  const validated = graphqlSingleLenguageResponseSchema.safeParse(result);
  if (!validated.success) {
    console.error("Error de validación:", validated.error.errors);
    throw new Error("Formato de respuesta inválido del servidor");
  }
  return { data: validated.data.data.lenguage };
}

export async function createLenguage(
  formData: FormData
): Promise<{ data?: any; error?: string }> {
  try {
    const name = formData.get("name")?.toString() || "";

    if (!name.trim()) {
      return { error: "El nombre es requerido" };
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation CreateLenguage($name: String!) {
            createLenguage(createLenguageInput: { name: $name }) {
              id
              name
              isActive
            }
          }
        `,
        variables: { name },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al crear el idioma");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.createLenguage };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
