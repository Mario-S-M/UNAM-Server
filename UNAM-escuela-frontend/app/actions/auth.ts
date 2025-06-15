"use server";

import { cookies } from "next/headers";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("UNAM-INCLUSION-TOKEN")?.value;

    if (!token) {
      return null;
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query Revalidate {
            revalidate {
              token
              user {
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

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    if (result.errors || !result.data?.revalidate) {
      return null;
    }

    return result.data.revalidate.user;
  } catch (error) {
    return null;
  }
}

export async function logoutServerAction() {
  const cookieStore = await cookies();
  cookieStore.delete("UNAM-INCLUSION-TOKEN");
}
