import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import {
  getUsers,
  getUser,
  blockUser,
  revalidateToken,
  updateUserRoles,
  UpdateUserRolesInput,
} from "../actions/user-actions";

// Query hooks
export function useUsers(token?: string) {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(token),
    enabled: !!token,
  });
}

export function useUser(userId: string, token?: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId, token),
    enabled: !!userId && !!token,
  });
}

export function useRevalidateToken(token: string) {
  return useQuery({
    queryKey: ["auth", "revalidate", token],
    queryFn: () => revalidateToken(token),
    enabled: !!token,
    retry: false,
  });
}

// Mutation hooks
export function useBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, token }: { id: string; token?: string }) =>
      blockUser(id, token),
    onSuccess: (response) => {
      // Invalidate and refetch users queries (including paginated)
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["usersPaginated"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Show success toast
      if (response.data) {
        addToast({
          title: response.data.isActive
            ? "Usuario activado"
            : "Usuario bloqueado",
          description: `${response.data.fullName} ha sido ${
            response.data.isActive ? "activado" : "bloqueado"
          } exitosamente`,
          color: "success",
          timeout: 3000,
        });
      }
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description:
          error.message || "No se pudo cambiar el estado del usuario",
        color: "danger",
        timeout: 3000,
      });
    },
  });
}

export function useUpdateUserRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      input,
      token,
    }: {
      input: UpdateUserRolesInput;
      token?: string;
    }) => updateUserRoles(input, token),
    onSuccess: (response) => {
      // Invalidate and refetch users queries (including paginated)
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["usersPaginated"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Show success toast
      if (response.data) {
        addToast({
          title: "¡Éxito!",
          description: `Rol de ${response.data.fullName} actualizado correctamente`,
          color: "success",
          timeout: 3000,
        });
      }
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description:
          error.data?.error || error.message || "Error al actualizar el rol",
        color: "danger",
        timeout: 3000,
      });
    },
  });
}
