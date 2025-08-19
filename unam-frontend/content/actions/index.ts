import {
  GET_ACTIVE_LANGUAGES,
  GET_ACTIVE_SKILLS,
  GET_LEVELS_BY_LANGUAGE,
  GET_CONTENTS_BY_LEVEL,
  GET_CONTENTS_BY_SKILL,
  GET_CONTENTS_BY_LEVEL_AND_SKILL,
} from "@/lib/graphql/contentGraphqlSchema";
import {
  Language,
  Skill,
  Level,
  Content,
  LanguagesResponseSchema,
  SkillsResponseSchema,
  LevelsResponseSchema,
  ContentsResponseSchema,
  ContentsBySkillResponseSchema,
  ContentsByLevelAndSkillResponseSchema,
} from "../schemas";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

interface GraphQLVariables {
  [key: string]: string | number | boolean | null | undefined | string[];
}

const fetchGraphQL = async (query: string, variables?: GraphQLVariables) => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Languages Actions
export const getActiveLanguages = async (): Promise<Language[]> => {
  try {
    const data = await fetchGraphQL(GET_ACTIVE_LANGUAGES);
    const parsed = LanguagesResponseSchema.safeParse(data);
    
    if (!parsed.success) {
      console.error("Invalid API response for languages", parsed.error);
      return [];
    }
    
    return parsed.data.data.lenguagesActivate;
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
};

// Skills Actions
export const getActiveSkills = async (): Promise<Skill[]> => {
  try {
    const data = await fetchGraphQL(GET_ACTIVE_SKILLS);
    const parsed = SkillsResponseSchema.safeParse(data);
    
    if (!parsed.success) {
      console.error("Invalid API response for skills", parsed.error);
      return [];
    }
    
    return parsed.data.data.skillsActivePublic;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
};

// Levels Actions
export const getLevelsByLanguage = async (languageId: string): Promise<Level[]> => {
  try {
    const data = await fetchGraphQL(GET_LEVELS_BY_LANGUAGE, { lenguageId: languageId });
    const parsed = LevelsResponseSchema.safeParse(data);
    
    if (!parsed.success) {
      console.error("Invalid API response for levels", parsed.error);
      return [];
    }
    
    return parsed.data.data.levelsByLenguage;
  } catch (error) {
    console.error("Error fetching levels:", error);
    return [];
  }
};

// Contents Actions
export const getContentsByLevel = async (levelId: string): Promise<Content[]> => {
  try {
    const data = await fetchGraphQL(GET_CONTENTS_BY_LEVEL, { levelId });
    const parsed = ContentsResponseSchema.safeParse(data);
    
    if (!parsed.success) {
      console.error("Invalid API response for contents by level", parsed.error);
      return [];
    }
    
    return parsed.data.data.contentsByLevelPublic;
  } catch (error) {
    console.error("Error fetching contents by level:", error);
    return [];
  }
};

export const getContentsBySkill = async (skillId: string): Promise<Content[]> => {
  try {
    const data = await fetchGraphQL(GET_CONTENTS_BY_SKILL, { skillId });
    const parsed = ContentsBySkillResponseSchema.safeParse(data);
    
    if (!parsed.success) {
      console.error("Invalid API response for contents by skill", parsed.error);
      return [];
    }
    
    return parsed.data.data.contentsBySkillPublic;
  } catch (error) {
    console.error("Error fetching contents by skill:", error);
    return [];
  }
};

export const getContentsByLevelAndSkill = async (
  levelId: string,
  skillId: string
): Promise<Content[]> => {
  try {
    const data = await fetchGraphQL(GET_CONTENTS_BY_LEVEL_AND_SKILL, { levelId, skillId });
    const parsed = ContentsByLevelAndSkillResponseSchema.safeParse(data);
    
    if (!parsed.success) {
      console.error("Invalid API response for contents by level and skill", parsed.error);
      return [];
    }
    
    return parsed.data.data.contentsByLevelAndSkillPublic;
  } catch (error) {
    console.error("Error fetching contents by level and skill:", error);
    return [];
  }
};