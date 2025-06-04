import { LenguageResponse } from "../interfaces";
import { graphqlLenguagesResponseSchema } from "../schemas/lenguage-schema";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://backend:3000/graphql";

export async function getAllLenguages(): Promise<LenguageResponse> {
  console.log("Sale del front", GRAPHQL_ENDPOINT);
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
                        createdAt
                        updatedAt
                        isActive
                    }
                }
            `,
    }),
  });
  if (!response.ok) throw new Error("Error al cargar los lenguajes");
  const result = await response.json();
  console.log("Error del servidor",response);
  const validated = graphqlLenguagesResponseSchema.safeParse(result);
  if (!validated.success) {
    console.error("Error de validación:", validated.error.errors);
    throw new Error("Formato de respuesta inválido del servidor");
  }
  return { data: validated.data.data.lenguages };
}
