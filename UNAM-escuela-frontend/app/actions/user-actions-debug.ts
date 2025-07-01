"use server";

import { cookies } from "next/headers";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

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

export interface User {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  isActive: boolean;
  assignedLanguageId?: string;
  assignedLanguage?: {
    id: string;
    name: string;
    isActive: boolean;
  };
}

export interface UsersResponse {
  data: User[];
}

// Fix #1: Corrected GraphQL query with proper syntax for roles
export async function getTeachersFixed(token?: string): Promise<UsersResponse> {
  // Obtain auth headers
  const headers = await getAuthHeaders();

  // If a specific token is provided, use it instead
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    console.log(
      "Sending GraphQL request for teachers with headers:",
      Object.keys(headers).map(
        (key) =>
          `${key}: ${key === "Authorization" ? "[REDACTED]" : headers[key]}`
      )
    );

    // Fix: Using query with variables properly and ensuring string literals are quoted
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          query GetTeachers($roles: [ValidRoles!]) {
            users(roles: $roles) {
              id
              fullName
              email
              roles
              isActive
            }
          }
        `,
        variables: { roles: ["docente"] },
      }),
    });

    if (!response.ok) {
      console.error(
        "Error in HTTP request:",
        response.statusText,
        "Status:",
        response.status
      );
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      return { data: [] };
    }

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors when fetching teachers:", result.errors);
      return { data: [] };
    }

    // Verify data structure before returning
    if (result.data && result.data.users) {
      console.log(
        `Successfully retrieved ${result.data.users.length} teachers`
      );
      return { data: result.data.users };
    }

    console.warn("No teachers found in response:", result);
    return { data: [] };
  } catch (error) {
    console.error("Exception when fetching teachers:", error);
    return { data: [] };
  }
}

// Fix #2: Alternative implementation with hardcoded values for testing
export async function getTeachersTest(): Promise<UsersResponse> {
  // Simulate a delay for a realistic API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    data: [
      {
        id: "test-teacher-1",
        fullName: "Profesor de Prueba",
        email: "profesor1@test.com",
        roles: ["docente"],
        isActive: true,
      },
      {
        id: "test-teacher-2",
        fullName: "Profesora de Prueba",
        email: "profesora2@test.com",
        roles: ["docente", "alumno"],
        isActive: true,
      },
    ],
  };
}
