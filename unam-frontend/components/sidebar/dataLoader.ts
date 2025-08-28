import {
  getActiveLanguages,
  getActiveSkills,
  getLevelsByLanguage,
  // getContentsByLevel,
  // getContentsBySkill,
  // getContentsByLevelAndSkill,
} from "@/content/actions";
import {
  Language,
  // Skill,
  Level,
  // Content,
} from "@/content/schemas";
import { SidebarLanguage, SidebarLevel, SidebarSkill, SidebarContent } from "./types";
import { GET_CONTENTS_BY_SKILL } from "@/lib/graphql/contentGraphqlSchema";
import { getCookie } from "@/lib/cookies";
import { SKILL_PUBLIC_FRAGMENT, CONTENT_PUBLIC_FRAGMENT } from "@/lib/graphql/fragments";
// GraphQL query para obtener skills por nivel
const GET_SKILLS_BY_LEVEL_QUERY = `
  ${SKILL_PUBLIC_FRAGMENT}
  
  query GetSkillsByLevel($levelId: ID!) {
    skillsByLevelPublic(levelId: $levelId) {
      ...SkillPublicFields
    }
  }
`;

// Función para hacer consultas GraphQL públicas (sin autenticación)
async function queryGraphQLPublic(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }
  
  return result.data;
}

// Función para hacer consultas GraphQL con autenticación
async function queryGraphQL(query: string, variables: Record<string, unknown> = {}) {
  // Get the authentication token from cookies if it exists
  const token = typeof window !== 'undefined' ? getCookie('auth_token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Add authorization header if token exists
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }
  
  return result.data;
}

function getContentType(name: string, description: string): "video" | "article" | "exercise" {
  const text = `${name} ${description}`.toLowerCase();
  if (text.includes("video") || text.includes("vídeo")) return "video";
  if (text.includes("ejercicio") || text.includes("exercise") || text.includes("práctica")) return "exercise";
  return "article";
}

export async function loadLanguagesWithLevels(): Promise<SidebarLanguage[]> {
  try {
    const [languagesData /*, skillsData*/] = await Promise.all([
      getActiveLanguages(),
      getActiveSkills(),
    ]);
    
    if (languagesData.length === 0) {
      console.warn('DataLoader: No languages found!');
      return [];
    }
    
    // Cargar niveles para cada idioma
    const structuredLanguages: SidebarLanguage[] = await Promise.all(
      languagesData.map(async (language: Language) => {
        console.log(`DataLoader: Loading levels for language: ${language.name}`);
        
        try {
          const levelsData = await getLevelsByLanguage(language.id);
          console.log(`DataLoader: Found ${levelsData.length} levels for ${language.name}`);
          
          // Cargar skills para cada nivel usando GraphQL
          const structuredLevels: SidebarLevel[] = await Promise.all(
            levelsData.map(async (level: Level) => {
              console.log(`DataLoader: Loading skills for level: ${level.name}`);
              
              try {
                const data = await queryGraphQLPublic(GET_SKILLS_BY_LEVEL_QUERY, {
                  levelId: level.id,
                });
                
                const skillsData = data.skillsByLevelPublic || [];
                console.log(`DataLoader: Found ${skillsData.length} skills for level ${level.name}`);
                
                // Convertir skills a formato SidebarSkill y cargar contenidos
                const sidebarSkills: SidebarSkill[] = await Promise.all(
                  skillsData.map(async (skill: { id: string; name: string }) => {
                    try {
                      // Cargar contenidos para este skill
                      const contentsData = await queryGraphQLPublic(GET_CONTENTS_BY_SKILL, {
                        skillId: skill.id,
                      });
                      
                      const skillContents = contentsData.contentsBySkillPublic || [];
                      
                      // Convertir contenidos a formato SidebarContent
                      const sidebarContents: SidebarContent[] = skillContents
                        .filter((content: any) => content.validationStatus === 'APPROVED')
                        .map((content: any) => ({
                          id: content.id,
                          name: content.name,
                          description: content.description,
                          isCompleted: content.isCompleted,
                          validationStatus: content.validationStatus,
                          publishedAt: content.publishedAt,
                          type: getContentType(content.name, content.description),
                        }));
                      
                      return {
                        id: skill.id,
                        name: skill.name,
                        contents: sidebarContents,
                      };
                    } catch (error) {
                      console.error(`DataLoader: Error loading contents for skill ${skill.name}:`, error);
                      return {
                        id: skill.id,
                        name: skill.name,
                        contents: [],
                      };
                    }
                  })
                );
                
                return {
                  id: level.id,
                  name: level.name,
                  description: level.description,
                  difficulty: level.difficulty,
                  skills: sidebarSkills,
                };
              } catch (error) {
                console.error(`DataLoader: Error loading skills for level ${level.name}:`, error);
                return {
                  id: level.id,
                  name: level.name,
                  description: level.description,
                  difficulty: level.difficulty,
                  skills: [],
                };
              }
            })
          );
          
          return {
            id: language.id,
            name: language.name,
            icons: language.icons || [],
            levels: structuredLevels,
          };
        } catch (error) {
          console.error(`DataLoader: Error loading levels for language ${language.name}:`, error);
          return {
            id: language.id,
            name: language.name,
            icons: language.icons || [],
            levels: [],
          };
        }
      })
    );
    
    console.log('DataLoader: Final structured languages:', structuredLanguages.length);
    return structuredLanguages;
  } catch (error) {
    console.error('DataLoader: Error loading languages with levels:', error);
    return [];
  }
}