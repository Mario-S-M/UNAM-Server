import { LenguageResponse, SingleLenguageResponse } from "../interfaces";
import {
  graphqlLenguagesResponseSchema,
  graphqlSingleLenguageResponseSchema,
} from "../schemas/lenguage-schema";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export async function getActiveLenguages(): Promise<LenguageResponse> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
  if (!response.ok) throw new Error("Error al cargar los idiomas");
  const result = await response.json();
  const validated = graphqlLenguagesResponseSchema.safeParse(result);
  if (!validated.success) {
    console.error("Error de validación:", validated.error.errors);
    throw new Error("Formato de respuesta inválido del servidor");
  }
  return { data: validated.data.data.lenguagesActivate };
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
