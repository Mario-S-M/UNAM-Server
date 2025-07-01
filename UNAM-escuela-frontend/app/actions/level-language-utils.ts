import { getAuthHeaders } from "./user-actions";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

/**
 * Get the language information for a specific level
 */
export async function getLevelLanguageInfo(
  levelId: string
): Promise<{ languageId: string; languageName: string } | null> {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query GetLevelLanguage($levelId: ID!) {
            level(id: $levelId) {
              id
              lenguageId
            }
          }
        `,
        variables: { levelId },
      }),
    });

    if (!response.ok) {
      throw new Error("Error al obtener información del nivel");
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    const level = result.data?.level;
    if (!level || !level.lenguageId) {
      return null;
    }

    // Get language details
    const languageResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query GetLanguage($languageId: ID!) {
            lenguage(id: $languageId) {
              id
              name
            }
          }
        `,
        variables: { languageId: level.lenguageId },
      }),
    });

    if (!languageResponse.ok) {
      throw new Error("Error al obtener información del idioma");
    }

    const languageResult = await languageResponse.json();

    if (languageResult.errors) {
      throw new Error(
        languageResult.errors.map((err: any) => err.message).join(", ")
      );
    }

    const language = languageResult.data?.lenguage;
    if (!language) {
      return null;
    }

    return {
      languageId: level.lenguageId,
      languageName: language.name,
    };
  } catch (error) {
    console.error("Error getting level language info:", error);
    return null;
  }
}

/**
 * Check if a teacher is compatible with a specific language
 * For now, all teachers are compatible with all languages
 * In the future, this could check teacher language assignments
 */
export function isTeacherCompatibleWithLanguage(
  teacher: any,
  languageId: string
): boolean {
  // Future implementation: check if teacher has language compatibility
  // For now, return true for all teachers
  return true;
}

/**
 * Filter teachers based on language compatibility for content assignment
 */
export async function filterTeachersForLanguageCompatibility(
  teachers: any[],
  levelId: string,
  userLanguageRestriction?: string
): Promise<any[]> {
  try {
    // If user has language restriction, validate the level belongs to their language
    if (userLanguageRestriction) {
      const levelLanguageInfo = await getLevelLanguageInfo(levelId);

      if (!levelLanguageInfo) {
        console.warn(
          "Could not determine level language, returning empty teacher list"
        );
        return [];
      }

      // If the level doesn't belong to the user's assigned language, return empty array
      if (levelLanguageInfo.languageId !== userLanguageRestriction) {
        console.warn(
          `Level belongs to language ${levelLanguageInfo.languageName}, but user is restricted to language ${userLanguageRestriction}`
        );
        return [];
      }
    }

    // Filter teachers based on language compatibility
    // For now, return all teachers since we don't have teacher-language assignments yet
    return teachers.filter(
      (teacher) => teacher.roles?.includes("docente") && teacher.isActive
    );
  } catch (error) {
    console.error(
      "Error filtering teachers for language compatibility:",
      error
    );
    return teachers; // Return all teachers on error to avoid breaking the UI
  }
}
