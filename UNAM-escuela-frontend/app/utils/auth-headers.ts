"use server";

import { cookies } from "next/headers";

/**
 * Helper function to get authorization headers for GraphQL requests
 * @returns Promise<Record<string, string>> - Headers object with authorization token if available
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
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
    
  }

  return headers;
}
