import { GET_ACTIVE_LANGUAGES } from "@/lib/graphql/languagesGraphqlSchema";
import { Lenguage, LenguagesResponseSchema } from "../schemas/languageSchema";

export const getLanguages = async (): Promise<Lenguage[]> => {
  return fetch(
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: GET_ACTIVE_LANGUAGES }),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const parsed = LenguagesResponseSchema.safeParse(data);
      if (!parsed.success) {
        console.error("Respuesta inválida de la API", parsed.error);
        return [];
      }
      return parsed.data.data.lenguagesActivate;
    });
};