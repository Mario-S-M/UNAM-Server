"use server";

import { cookies } from "next/headers";
import { BasicSkillSchema, FullSkillSchema } from "../schemas";
import {
  SkillsResponse,
  CreateSkillInput,
  UpdateSkillInput,
  Skill,
  PaginatedSkillsResponse,
  SkillsFilterArgs,
} from "@/app/interfaces/skill-interfaces";
import { getAuthHeaders } from "../utils/auth-headers";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export async function getSkillsList() {
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
          query GetSkills {
            skills {
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

    const skillsData = result.data.skills;

    // Validar cada habilidad con Zod
    const validatedSkills = skillsData
      .map((skill: any) => {
        try {
          return BasicSkillSchema.parse(skill);
        } catch (error) {
          return null;
        }
      })
      .filter(Boolean);

    return { success: true, data: validatedSkills };
  } catch (error) {
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function getSkillById(skillId: string) {
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
          query GetSkillById($id: String!) {
            skill(id: $id) {
              id
              name
              description
              isActive
              createdAt
              updatedAt
            }
          }
        `,
        variables: { id: skillId },
      }),
    });

    if (!response.ok) {
      return { success: false, error: "Error en la respuesta del servidor" };
    }

    const result = await response.json();

    if (result.errors) {
      return { success: false, error: "Error en GraphQL" };
    }

    const skillData = result.data.skill;

    if (!skillData) {
      return { success: false, error: "Habilidad no encontrada" };
    }

    // Validar la habilidad con Zod
    const validatedSkill = FullSkillSchema.parse(skillData);

    return { success: true, data: validatedSkill };
  } catch (error) {
    return { success: false, error: "Error interno del servidor" };
  }
}

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

export async function getActiveSkills() {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query GetActiveSkills {
            skillsActive {
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
      return { error: `Error HTTP: ${response.status}` };
    }

    const result = await response.json();

    if (result.errors) {
      return { error: result.errors[0].message };
    }

    const skills = result.data.skillsActive;

    // Validar con Zod
    const validatedSkills = skills.map((skill: any) =>
      FullSkillSchema.parse(skill)
    );

    return { data: validatedSkills };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error desconocido",
    };
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

export async function getSkillsPaginated(
  filters: SkillsFilterArgs = {}
): Promise<PaginatedSkillsResponse> {
  const { search, page = 1, limit = 10, isActive } = filters;

  console.log("🔍 Obteniendo skills paginados:", {
    search,
    page,
    limit,
    isActive,
  });

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("UNAM-INCLUSION-TOKEN")?.value;

    if (!token) {
      return {
        data: {
          skills: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query SkillsPaginated($search: String, $page: Int, $limit: Int, $isActive: Boolean) {
            skillsPaginated(search: $search, page: $page, limit: $limit, isActive: $isActive) {
              skills {
                id
                name
                description
                color
                isActive
              }
              total
              page
              limit
              totalPages
              hasNextPage
              hasPreviousPage
            }
          }
        `,
        variables: { search, page, limit, isActive },
      }),
    });

    console.log("📥 Respuesta HTTP:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error en respuesta HTTP:", errorText);
      return {
        data: {
          skills: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }

    const result = await response.json();

    if (result.errors) {
      console.error("❌ GraphQL errors:", result.errors);
      return {
        data: {
          skills: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }

    console.log("✅ Skills paginados obtenidos exitosamente");
    return { data: result.data.skillsPaginated };
  } catch (error) {
    console.error("❌ Error obteniendo skills paginados:", error);
    return {
      data: {
        skills: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}
