"use server";

import { getAuthHeaders } from "./user-actions";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql";

interface CreateTestTeacher {
  fullName: string;
  email: string;
  password: string;
}

export async function createTestTeachers(): Promise<{
  success: boolean;
  message: string;
  teachers?: any[];
}> {
  console.log("🔧 === CREANDO PROFESORES DE PRUEBA ===");

  const testTeachers: CreateTestTeacher[] = [
    {
      fullName: "María García Profesor",
      email: "maria.profesor@test.com",
      password: "profesor123",
    },
    {
      fullName: "Juan López Docente",
      email: "juan.docente@test.com",
      password: "docente123",
    },
    {
      fullName: "Ana Martínez Maestra",
      email: "ana.maestra@test.com",
      password: "maestra123",
    },
  ];

  const headers = await getAuthHeaders();
  const createdTeachers = [];

  try {
    for (const teacher of testTeachers) {
      console.log(`👨‍🏫 Creando profesor: ${teacher.fullName}`);

      // Primero crear el usuario
      const signupResponse = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: `
            mutation Signup($signupInput: SignupInput!) {
              signup(signupInput: $signupInput) {
                user {
                  id
                  fullName
                  email
                  roles
                  isActive
                }
                token
              }
            }
          `,
          variables: {
            signupInput: {
              fullName: teacher.fullName,
              email: teacher.email,
              password: teacher.password,
            },
          },
        }),
      });

      if (!signupResponse.ok) {
        console.warn(
          `⚠️ Error HTTP al crear ${teacher.fullName}: ${signupResponse.status}`
        );
        continue;
      }

      const signupResult = await signupResponse.json();

      if (signupResult.errors) {
        console.warn(
          `⚠️ Error GraphQL al crear ${teacher.fullName}:`,
          signupResult.errors
        );
        continue;
      }

      const newUser = signupResult.data.signup.user;
      console.log(`✅ Usuario creado: ${newUser.fullName} (${newUser.id})`);

      // Ahora asignar el rol de docente
      const roleResponse = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: `
            mutation UpdateUserRoles($updateUserRolesInput: UpdateUserRolesInput!) {
              updateUserRoles(updateUserRolesInput: $updateUserRolesInput) {
                id
                fullName
                email
                roles
                isActive
              }
            }
          `,
          variables: {
            updateUserRolesInput: {
              id: newUser.id,
              roles: ["docente", "mortal"], // Agregar rol docente y mantener mortal
            },
          },
        }),
      });

      if (!roleResponse.ok) {
        console.warn(
          `⚠️ Error HTTP al asignar rol a ${teacher.fullName}: ${roleResponse.status}`
        );
        continue;
      }

      const roleResult = await roleResponse.json();

      if (roleResult.errors) {
        console.warn(
          `⚠️ Error GraphQL al asignar rol a ${teacher.fullName}:`,
          roleResult.errors
        );
        continue;
      }

      const updatedUser = roleResult.data.updateUserRoles;
      console.log(`✅ Rol docente asignado a: ${updatedUser.fullName}`);
      createdTeachers.push(updatedUser);
    }

    if (createdTeachers.length > 0) {
      console.log(
        `🎉 ${createdTeachers.length} profesores creados exitosamente`
      );
      return {
        success: true,
        message: `Se crearon ${createdTeachers.length} profesores de prueba exitosamente`,
        teachers: createdTeachers,
      };
    } else {
      return {
        success: false,
        message:
          "No se pudo crear ningún profesor. Verifica los logs para más detalles.",
      };
    }
  } catch (error) {
    console.error("❌ Error al crear profesores de prueba:", error);
    return {
      success: false,
      message: `Error: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`,
    };
  }
}
