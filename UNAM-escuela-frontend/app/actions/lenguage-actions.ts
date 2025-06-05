import { LenguageResponse } from "../interfaces";
import { graphqlLenguagesResponseSchema } from "../schemas/lenguage-schema";

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
  if (!response.ok) throw new Error("Error al cargar los lenguajes");
  const result = await response.json();
  const validated = graphqlLenguagesResponseSchema.safeParse(result);
  if (!validated.success) {
    console.error("Error de validación:", validated.error.errors);
    throw new Error("Formato de respuesta inválido del servidor");
  }
  return { data: validated.data.data.lenguagesActivate };
}
