"use server";

import { cookies } from "next/headers";
import { BasicLanguageSchema, FullLanguageSchema } from "../schemas";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export async function getLanguagesList() {
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
          query GetLanguages {
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
      return { success: false, error: "Error en la respuesta del servidor" };
    }

    const result = await response.json();

    if (result.errors) {
      return { success: false, error: "Error en GraphQL" };
    }

    const languagesData = result.data.lenguagesActivate;

    // Validar cada idioma con Zod
    const validatedLanguages = languagesData
      .map((language: any) => {
        try {
          return BasicLanguageSchema.parse(language);
        } catch (error) {
          return null;
        }
      })
      .filter(Boolean);

    return { success: true, data: validatedLanguages };
  } catch (error) {
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function getLanguageById(languageId: string) {
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
          query GetLanguageById($id: String!) {
            lenguage(id: $id) {
              id
              name
              description
              isActive
              createdAt
              updatedAt
            }
          }
        `,
        variables: { id: languageId },
      }),
    });

    if (!response.ok) {
      return { success: false, error: "Error en la respuesta del servidor" };
    }

    const result = await response.json();

    if (result.errors) {
      return { success: false, error: "Error en GraphQL" };
    }

    const languageData = result.data.lenguage;

    if (!languageData) {
      return { success: false, error: "Idioma no encontrado" };
    }

    // Validar el idioma con Zod
    const validatedLanguage = FullLanguageSchema.parse(languageData);

    return { success: true, data: validatedLanguage };
  } catch (error) {
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function getLanguagesListPublic() {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetLanguagesPublic {
            lenguages {
              id
              name
              isActive
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

    const languagesData = result.data.lenguages;

    // Validar cada idioma con Zod
    const validatedLanguages = languagesData
      .map((language: any) => {
        try {
          return BasicLanguageSchema.parse(language);
        } catch (error) {
          return null;
        }
      })
      .filter(Boolean);

    return { success: true, data: validatedLanguages };
  } catch (error) {
    return { success: false, error: "Error interno del servidor" };
  }
}
