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
      console.log("🔐 Modal: Iniciando login con:", credentials.email);
      const result = await loginAction(credentials);
      console.log("📋 Modal: Resultado del login:", result);
      return result;
    },
    onSuccess: (result) => {
      console.log("✅ Modal: Login exitoso:", result);

      if (result.error) {
        console.error("❌ Modal: Error en resultado:", result.error);
        throw new Error(result.error);
      }

      if (result.data) {
        console.log(
          "✅ Modal: Login exitoso, preparando redirección simple..."
        );

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

        // ESTRATEGIA SIMPLE: Solo invalidar UNA VEZ y redirigir
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });

        // Redirección simple con un delay mínimo
        setTimeout(() => {
          if (result.redirect) {
            console.log(
              "🔄 Modal: Redirigiendo a:",
              result.redirect.destination
            );
            window.location.href = result.redirect.destination;
          } else {
            // Fallback simple
            const userRoles = result.data?.roles || [];
            if (
              userRoles.includes("superUser") ||
              userRoles.includes("admin")
            ) {
              window.location.href = "/main/admin-dashboard";
            } else if (userRoles.includes("docente")) {
              window.location.href = "/main/teacher";
            } else {
              window.location.href = "/main/student";
            }
          }
        }, 1000); // Delay mínimo pero suficiente
      }
    },
    onError: (error) => {
      console.error("❌ Modal: Error en login:", error);
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

    console.log("📤 Modal: Enviando formulario de login");
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
