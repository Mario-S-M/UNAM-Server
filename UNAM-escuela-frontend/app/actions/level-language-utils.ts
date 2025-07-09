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
    if (!levelId) {
      console.warn("getLevelLanguageInfo: levelId is empty");
      return null;
    }

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
      console.error(
        "Level language info fetch failed:",
        response.status,
        response.statusText
      );
      return null; // Return null instead of throwing error
    }

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors in getLevelLanguageInfo:", result.errors);
      return null; // Return null instead of throwing error
    }

    const level = result.data?.level;
    if (!level || !level.lenguageId) {
      console.warn("Level or language ID not found for level:", levelId);
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
      console.error(
        "Language info fetch failed:",
        languageResponse.status,
        languageResponse.statusText
      );
      return null; // Return null instead of throwing error
    }

    const languageResult = await languageResponse.json();

    if (languageResult.errors) {
      console.error("GraphQL errors in language fetch:", languageResult.errors);
      return null; // Return null instead of throwing error
    }

    const language = languageResult.data?.lenguage;
    if (!language) {
      console.warn("Language not found for ID:", level.lenguageId);
      return null;
    }

    return {
      languageId: level.lenguageId,
      languageName: language.name,
    };
  } catch (error) {
    console.error("Error getting level language info:", error);
    // Return null instead of throwing to prevent breaking the app
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
  console.log("🔍 === INICIANDO FILTRADO DE PROFESORES ===");
  console.log(`📊 Profesores iniciales: ${teachers.length}`);
  console.log(
    `🔐 Restricción de idioma: ${userLanguageRestriction || "ninguna"}`
  );
  console.log(`📚 Nivel ID: ${levelId}`);

  try {
    // Primero filtrar profesores activos con rol docente
    const activeTeachers = teachers.filter(
      (teacher) => teacher.roles?.includes("docente") && teacher.isActive
    );

    console.log(
      `✅ Profesores activos con rol docente: ${activeTeachers.length}`
    );
    activeTeachers.forEach((teacher, index) => {
      console.log(`  ${index + 1}. ${teacher.fullName} (${teacher.email})`);
    });

    // TEMPORAL: Devolver TODOS los profesores activos sin filtrar por idioma
    console.log(
      "🎯 TEMPORAL: Devolviendo todos los profesores activos sin filtrar"
    );
    return activeTeachers;

    // TODO: Reactivar filtrado por idioma cuando sea necesario
    /*
    // Si no hay restricción de idioma del usuario, devolver todos los profesores activos
    if (!userLanguageRestriction) {
      console.log("✅ Sin restricción de idioma, devolviendo todos los profesores activos");
      return activeTeachers;
    }

    // Si hay restricción de idioma, validar el nivel
    console.log("🔍 Verificando compatibilidad de idioma...");
    const levelLanguageInfo = await getLevelLanguageInfo(levelId);

    if (!levelLanguageInfo) {
      console.warn("⚠️ No se pudo determinar el idioma del nivel");
      console.log("🎯 Devolviendo todos los profesores activos como fallback");
      return activeTeachers;
    }

    console.log(`📋 Idioma del nivel: ${levelLanguageInfo.languageName} (${levelLanguageInfo.languageId})`);

    // Verificar compatibilidad de idioma
    if (levelLanguageInfo.languageId !== userLanguageRestriction) {
      console.warn(
        `⚠️ Incompatibilidad: Nivel pertenece a ${levelLanguageInfo.languageName}, pero usuario restringido a ${userLanguageRestriction}`
      );
      console.log("🎯 Devolviendo todos los profesores activos para evitar bloqueo total");
      return activeTeachers;
    }

    console.log("✅ Idioma compatible, devolviendo profesores filtrados");
    return activeTeachers;
    */
  } catch (error) {
    console.error("❌ Error en filtrado de profesores:", error);

    // En caso de error, devolver todos los profesores activos como fallback
    const fallbackTeachers = teachers.filter(
      (teacher) => teacher.roles?.includes("docente") && teacher.isActive
    );

    console.log(
      `🎯 Fallback: devolviendo ${fallbackTeachers.length} profesores activos`
    );
    return fallbackTeachers;
  }
}
