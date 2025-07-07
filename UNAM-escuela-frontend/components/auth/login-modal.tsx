"use client";

import { useState } from "react";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import { Card, CardBody, addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginAction } from "@/app/actions";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const result = await loginAction(credentials);
      return result;
    },
    onSuccess: async (result) => {
      // Si hay un error en el resultado, mostrarlo directamente sin lanzar excepción
      if (result.error) {
        addToast({
          title: "Error de Inicio de Sesión",
          color: "danger",
          description: result.error,
          timeout: 5000,
          shouldShowTimeoutProgress: true,
        });
        return; // Salir temprano sin proceder con el login exitoso
      }

      if (result.data) {
        addToast({
          title: "¡Inicio de sesión exitoso!",
          color: "success",
          description: `¡Bienvenid@ de vuelta ${result.data.fullName}!`,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });

        // Cerrar modal y limpiar formulario
        onOpenChange(false);
        setEmail("");
        setPassword("");

        // Invalidar queries para actualizar el estado
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });

        // Redirección inmediata
        if (result.redirect) {
          window.location.href = result.redirect.destination;
        } else {
          // Fallback inmediato
          const userRoles = result.data?.roles || [];
          if (userRoles.includes("superUser") || userRoles.includes("admin")) {
            window.location.href = "/main/admin-dashboard";
          } else if (userRoles.includes("docente")) {
            window.location.href = "/main/teacher";
          } else {
            window.location.href = "/main/student";
          }
        }
      }
    },
    onError: (error) => {
      addToast({
        title: "Error de Inicio de Sesión",
        color: "danger",
        description:
          error instanceof Error
            ? error.message
            : "Error desconocido al iniciar sesión",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      addToast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        color: "warning",
        timeout: 3000,
      });
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Iniciar Sesión"
    >
      <Card className="!shadow-none">
        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <GlobalInput
                name="email"
                type="email"
                label="Correo Electrónico"
                color="default"
                isRequired={true}
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                isDisabled={loginMutation.isPending}
                classNames={{
                  label: "text-content",
                }}
              />
            </div>

            <div>
              <GlobalInput
                name="password"
                type="password"
                label="Contraseña"
                isRequired={true}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                isDisabled={loginMutation.isPending}
                classNames={{
                  label: "text-content",
                }}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <GlobalButton
                onPress={() => onOpenChange(false)}
                text="Cancelar"
                variant="bordered"
                isDisabled={loginMutation.isPending}
              />
              <GlobalButton
                type="submit"
                text={
                  loginMutation.isPending
                    ? "Iniciando sesión..."
                    : "Iniciar Sesión"
                }
                variant="solid"
                isLoading={loginMutation.isPending}
                isDisabled={loginMutation.isPending}
              />
            </div>
          </form>
        </CardBody>
      </Card>
    </GlobalModal>
  );
}
