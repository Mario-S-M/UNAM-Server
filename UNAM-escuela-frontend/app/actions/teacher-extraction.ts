"use server";

import { cookies } from "next/headers";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

interface User {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

// Helper function to get auth headers
async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("UNAM-INCLUSION-TOKEN")?.value;

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("Could not get auth token:", error);
  }

  return headers;
}

/**
 * Función especializada para extraer profesores reales de la base de datos
 * utilizando múltiples estrategias
 */
export async function extractRealTeachersFromDatabase(
  token?: string
): Promise<User[]> {
  console.log("🔍 === INICIANDO EXTRACCIÓN DE PROFESORES REALES ===");

  const headers = await getAuthHeaders();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const allTeachers = new Map<string, User>();

  // Estrategia 1: Obtener todos los niveles y luego sus contenidos
  try {
    console.log("📋 Estrategia 1: Obteniendo niveles disponibles");

    const levelsResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query {
            levels {
              id
              name
              language {
                id
                name
              }
            }
          }
        `,
      }),
    });

    if (levelsResponse.ok) {
      const levelsResult = await levelsResponse.json();
      console.log("📋 Respuesta de niveles:", levelsResult);

      if (!levelsResult.errors && levelsResult.data?.levels) {
        const levels = levelsResult.data.levels;
        console.log(`✅ Se encontraron ${levels.length} niveles`);

        // Para cada nivel, obtener sus contenidos
        for (const level of levels.slice(0, 10)) {
          // Limitar a 10 niveles
          try {
            console.log(
              `📚 Obteniendo contenidos para nivel: ${level.name} (${level.id})`
            );

            const contentsResponse = await fetch(GRAPHQL_ENDPOINT, {
              method: "POST",
              headers,
              body: JSON.stringify({
                query: `
                  query ContentsByLevel($levelId: ID!) {
                    contentsByLevel(levelId: $levelId) {
                      id
                      name
                      assignedTeachers {
                        id
                        fullName
                        email
                        roles
                        isActive
                      }
                    }
                  }
                `,
                variables: { levelId: level.id },
              }),
            });

            if (contentsResponse.ok) {
              const contentsResult = await contentsResponse.json();

              if (
                !contentsResult.errors &&
                contentsResult.data?.contentsByLevel
              ) {
                const contents = contentsResult.data.contentsByLevel;
                console.log(
                  `📚 Nivel ${level.name}: ${contents.length} contenidos`
                );

                contents.forEach((content: any) => {
                  if (
                    content.assignedTeachers &&
                    Array.isArray(content.assignedTeachers)
                  ) {
                    content.assignedTeachers.forEach((teacher: User) => {
                      if (
                        teacher.roles.includes("docente") &&
                        teacher.isActive
                      ) {
                        allTeachers.set(teacher.id, teacher);
                        console.log(
                          `✅ Profesor encontrado: ${teacher.fullName} (${teacher.email})`
                        );
                      }
                    });
                  }
                });
              } else if (contentsResult.errors) {
                console.warn(
                  `⚠️ Errores en contenidos del nivel ${level.name}:`,
                  contentsResult.errors
                );
              }
            }
          } catch (levelError) {
            console.warn(
              `⚠️ Error al procesar nivel ${level.name}:`,
              levelError
            );
            continue;
          }
        }
      }
    }
  } catch (error) {
    console.warn("⚠️ Estrategia 1 falló:", error);
  }

  // Estrategia 2: Obtener todos los idiomas y sus niveles
  if (allTeachers.size === 0) {
    try {
      console.log("🌐 Estrategia 2: Obteniendo idiomas y sus niveles");

      const languagesResponse = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: `
            query {
              lenguages {
                id
                name
                isActive
              }
            }
          `,
        }),
      });

      if (languagesResponse.ok) {
        const languagesResult = await languagesResponse.json();

        if (!languagesResult.errors && languagesResult.data?.lenguages) {
          const languages = languagesResult.data.lenguages;
          console.log(`✅ Se encontraron ${languages.length} idiomas`);

          for (const language of languages.slice(0, 5)) {
            // Limitar a 5 idiomas
            try {
              console.log(
                `🌐 Obteniendo niveles para idioma: ${language.name}`
              );

              const levelsResponse = await fetch(GRAPHQL_ENDPOINT, {
                method: "POST",
                headers,
                body: JSON.stringify({
                  query: `
                    query LevelsByLanguage($languageId: ID!) {
                      levelsByLenguage(lenguageId: $languageId) {
                        id
                        name
                      }
                    }
                  `,
                  variables: { languageId: language.id },
                }),
              });

              if (levelsResponse.ok) {
                const levelsResult = await levelsResponse.json();

                if (
                  !levelsResult.errors &&
                  levelsResult.data?.levelsByLenguage
                ) {
                  const levels = levelsResult.data.levelsByLenguage;

                  for (const level of levels.slice(0, 5)) {
                    // Limitar a 5 niveles por idioma
                    // Mismo código que la estrategia 1 para obtener contenidos
                    try {
                      const contentsResponse = await fetch(GRAPHQL_ENDPOINT, {
                        method: "POST",
                        headers,
                        body: JSON.stringify({
                          query: `
                            query ContentsByLevel($levelId: ID!) {
                              contentsByLevel(levelId: $levelId) {
                                id
                                name
                                assignedTeachers {
                                  id
                                  fullName
                                  email
                                  roles
                                  isActive
                                }
                              }
                            }
                          `,
                          variables: { levelId: level.id },
                        }),
                      });

                      if (contentsResponse.ok) {
                        const contentsResult = await contentsResponse.json();

                        if (
                          !contentsResult.errors &&
                          contentsResult.data?.contentsByLevel
                        ) {
                          const contents = contentsResult.data.contentsByLevel;

                          contents.forEach((content: any) => {
                            if (
                              content.assignedTeachers &&
                              Array.isArray(content.assignedTeachers)
                            ) {
                              content.assignedTeachers.forEach(
                                (teacher: User) => {
                                  if (
                                    teacher.roles.includes("docente") &&
                                    teacher.isActive
                                  ) {
                                    allTeachers.set(teacher.id, teacher);
                                    console.log(
                                      `✅ Profesor encontrado: ${teacher.fullName} (${teacher.email})`
                                    );
                                  }
                                }
                              );
                            }
                          });
                        }
                      }
                    } catch (contentError) {
                      console.warn(
                        `⚠️ Error al obtener contenidos del nivel ${level.name}:`,
                        contentError
                      );
                      continue;
                    }
                  }
                }
              }
            } catch (languageError) {
              console.warn(
                `⚠️ Error al procesar idioma ${language.name}:`,
                languageError
              );
              continue;
            }
          }
        }
      }
    } catch (error) {
      console.warn("⚠️ Estrategia 2 falló:", error);
    }
  }

  // Estrategia 3: Usar myAssignedContents (debería funcionar para cualquier usuario autenticado)
  if (allTeachers.size === 0) {
    try {
      console.log("👤 Estrategia 3: Obteniendo mis contenidos asignados");

      const myContentsResponse = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: `
            query {
              myAssignedContents {
                id
                name
                assignedTeachers {
                  id
                  fullName
                  email
                  roles
                  isActive
                }
              }
            }
          `,
        }),
      });

      if (myContentsResponse.ok) {
        const myContentsResult = await myContentsResponse.json();
        console.log("👤 Respuesta de mis contenidos:", myContentsResult);

        if (
          !myContentsResult.errors &&
          myContentsResult.data?.myAssignedContents
        ) {
          const contents = myContentsResult.data.myAssignedContents;
          console.log(
            `✅ Se encontraron ${contents.length} contenidos asignados al usuario actual`
          );

          contents.forEach((content: any) => {
            if (
              content.assignedTeachers &&
              Array.isArray(content.assignedTeachers)
            ) {
              content.assignedTeachers.forEach((teacher: User) => {
                if (teacher.roles.includes("docente") && teacher.isActive) {
                  allTeachers.set(teacher.id, teacher);
                  console.log(
                    `✅ Profesor encontrado: ${teacher.fullName} (${teacher.email})`
                  );
                }
              });
            }
          });
        } else if (myContentsResult.errors) {
          console.warn(
            "⚠️ Errores en mis contenidos:",
            myContentsResult.errors
          );
        }
      }
    } catch (error) {
      console.warn("⚠️ Estrategia 3 falló:", error);
    }
  }

  const finalTeachers = Array.from(allTeachers.values());
  console.log(
    `🎯 === EXTRACCIÓN COMPLETADA: ${finalTeachers.length} profesores únicos encontrados ===`
  );

  if (finalTeachers.length > 0) {
    console.log("📋 Lista de profesores encontrados:");
    finalTeachers.forEach((teacher, index) => {
      console.log(
        `  ${index + 1}. ${teacher.fullName} (${teacher.email}) - ID: ${
          teacher.id
        }`
      );
    });
  }

  return finalTeachers;
}
