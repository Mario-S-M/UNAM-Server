import {
  SkillsResponse,
  CreateSkillInput,
  UpdateSkillInput,
  Skill,
} from "@/app/interfaces/skill-interfaces";
import { getAuthHeaders } from "../utils/auth-headers";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export async function getSkills(): Promise<SkillsResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: `
        query Skills {
          skills {
            id
            name
            description
            color
            isActive
            createdAt
            updatedAt
          }
        }
      `,
    }),
  });

  if (!response.ok) {
    throw new Error("Error al cargar las skills");
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors.map((err: any) => err.message).join(", "));
  }

  return { data: result.data.skills || [] };
}

export async function getActiveSkills(): Promise<SkillsResponse> {
  try {
    const headers = await getAuthHeaders();
    console.log("🔧 getActiveSkills - Headers:", {
      ...headers,
      Authorization: headers.Authorization ? "[TOKEN_PRESENT]" : "[NO_TOKEN]",
    });

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query SkillsActivePublic {
            skillsActivePublic {
              id
              name
              description
              color
              isActive
              createdAt
              updatedAt
            }
          }
        `,
      }),
    });

    console.log("🔧 getActiveSkills - Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🔧 getActiveSkills - Response error:", errorText);
      throw new Error(
        `Error al cargar las skills activas: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("🔧 getActiveSkills - Result:", result);

    if (result.errors) {
      console.error("🔧 getActiveSkills - GraphQL errors:", result.errors);
      throw new Error(result.errors.map((err: any) => err.message).join(", "));
    }

    return { data: result.data.skillsActivePublic || [] };
  } catch (error: any) {
    console.error("🔧 getActiveSkills - Full error:", error);
    throw error;
  }
}

export async function createSkill(input: CreateSkillInput): Promise<Skill> {
  const headers = await getAuthHeaders();
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: `
        mutation CreateSkill($input: CreateSkillInput!) {
          createSkill(createSkillInput: $input) {
            id
            name
            description
            color
            isActive
            createdAt
            updatedAt
          }
        }
      `,
      variables: { input },
    }),
  });

  if (!response.ok) {
    throw new Error("Error al crear la skill");
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors.map((err: any) => err.message).join(", "));
  }

  return result.data.createSkill;
}

export async function updateSkill(input: UpdateSkillInput): Promise<Skill> {
  const headers = await getAuthHeaders();
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: `
        mutation UpdateSkill($input: UpdateSkillInput!) {
          updateSkill(updateSkillInput: $input) {
            id
            name
            description
            color
            isActive
            createdAt
            updatedAt
          }
        }
      `,
      variables: { input },
    }),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar la skill");
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors.map((err: any) => err.message).join(", "));
  }

  return result.data.updateSkill;
}

export async function deleteSkill(id: string): Promise<Skill> {
  const headers = await getAuthHeaders();
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: `
        mutation RemoveSkill($id: ID!) {
          removeSkill(id: $id) {
            id
            name
            description
            color
            isActive
            createdAt
            updatedAt
          }
        }
      `,
      variables: { id },
    }),
  });

  if (!response.ok) {
    throw new Error("Error al eliminar la skill");
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors.map((err: any) => err.message).join(", "));
  }

  return result.data.removeSkill;
}

export async function toggleSkillActive(id: string): Promise<Skill> {
  const headers = await getAuthHeaders();
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: `
        mutation ToggleSkillActive($id: ID!) {
          toggleSkillActive(id: $id) {
            id
            name
            description
            color
            isActive
            createdAt
            updatedAt
          }
        }
      `,
      variables: { id },
    }),
  });

  if (!response.ok) {
    throw new Error("Error al cambiar el estado de la skill");
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors.map((err: any) => err.message).join(", "));
  }

  return result.data.toggleSkillActive;
}
