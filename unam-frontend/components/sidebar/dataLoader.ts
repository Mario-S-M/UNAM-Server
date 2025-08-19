import {
  getActiveLanguages,
  getActiveSkills,
  getLevelsByLanguage,
  getContentsByLevel,
  getContentsBySkill,
  getContentsByLevelAndSkill,
} from "@/content/actions";
import {
  Language,
  Skill,
  Level,
  Content,
} from "@/content/schemas";
import { SidebarLanguage, SidebarLevel, SidebarSkill, SidebarContent } from "./types";
// GraphQL query para obtener skills por nivel
const GET_SKILLS_BY_LEVEL_QUERY = `
  query GetSkillsByLevel($levelId: ID!) {
    skillsByLevelPublic(levelId: $levelId) {
      id
      name
      description
      color
      difficulty
      estimatedHours
      tags
      isActive
    }
  }
`;

// Función para hacer consultas GraphQL usando fetch
async function queryGraphQL(query: string, variables: any = {}) {
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

function getContentType(name: string, description: string): "video" | "article" | "exercise" {
  const text = `${name} ${description}`.toLowerCase();
  if (text.includes("video") || text.includes("vídeo")) return "video";
  if (text.includes("ejercicio") || text.includes("exercise") || text.includes("práctica")) return "exercise";
  return "article";
}

export async function loadLanguagesWithLevels(): Promise<SidebarLanguage[]> {
  try {
    const [languagesData, skillsData] = await Promise.all([
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
                const data = await queryGraphQL(GET_SKILLS_BY_LEVEL_QUERY, {
                  levelId: level.id,
                });
                
                const skillsData = data.skillsByLevelPublic || [];
                console.log(`DataLoader: Found ${skillsData.length} skills for level ${level.name}`);
                
                // Convertir skills a formato SidebarSkill
                const sidebarSkills: SidebarSkill[] = skillsData.map((skill: any) => ({
                  id: skill.id,
                  name: skill.name,
                  contents: [], // Por ahora vacío, se puede llenar después si es necesario
                }));
                
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
            icons: language.icons,
            levels: structuredLevels,
          };
        } catch (error) {
          console.error(`DataLoader: Error loading levels for language ${language.name}:`, error);
          return {
            id: language.id,
            name: language.name,
            icons: language.icons,
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