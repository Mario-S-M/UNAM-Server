"use client";

import { useState } from "react";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import { useLogin } from "@/app/hooks/use-auth";
import { Card, CardBody, addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ isOpen, onOpenChange }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();
  const router = useRouter();
  const queryClient = useQueryClient();

  const getRedirectPath = (roles: string[]) => {
    if (roles.includes("superUser")) {
      return "/main/admin-debug";
    } else if (roles.includes("admin")) {
      return "/main/admin";
    } else if (roles.includes("docente")) {
      return "/main/teacher";
    } else if (roles.includes("alumno")) {
      return "/main/student";
    } else {
      return "/main";
    }
  };

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

    console.log("🔐 Modal: Iniciando login con:", email);
    const loginData = { email, password };

    loginMutation.mutate(loginData, {
      onSuccess: (result) => {
        console.log("✅ Modal: Login exitoso:", result);

        if (result.error) {
          console.error("❌ Modal: Error en resultado:", result.error);
          addToast({
            title: "Error de inicio de sesión",
            description: result.error,
            color: "danger",
            timeout: 4000,
            shouldShowTimeoutProgress: true,
          });
          return;
        }

        if (result.data) {
          const redirectPath = getRedirectPath(result.data.roles);

          addToast({
            title: "¡Bienvenido!",
            description: `Hola ${result.data.fullName}, inicio de sesión exitoso`,
            color: "success",
            timeout: 3000,
            shouldShowTimeoutProgress: true,
          });

          onOpenChange(false);
          setEmail("");
          setPassword("");
          queryClient.invalidateQueries({ queryKey: ["currentUser"] });

          console.log("🔄 Modal: Redirigiendo a:", redirectPath);
          router.push(redirectPath);
        }
      },
      onError: (error) => {
        console.error("❌ Modal: Error en login:", error);
        addToast({
          title: "Error de inicio de sesión",
          description:
            error instanceof Error
              ? error.message
              : "Error desconocido en el login",
          color: "danger",
          timeout: 4000,
          shouldShowTimeoutProgress: true,
        });
      },
    });
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Iniciar Sesión"
    >
      <Card shadow="none">
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <GlobalInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <GlobalInput
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-end space-x-2 pt-4">
              <GlobalButton
                type="button"
                variant="bordered"
                onPress={() => onOpenChange(false)}
                text="Cancelar"
              />
              <GlobalButton
                type="submit"
                isLoading={loginMutation.isPending}
                text={
                  loginMutation.isPending ? "Iniciando..." : "Iniciar Sesión"
                }
              />
            </div>
          </form>
        </CardBody>
      </Card>
    </GlobalModal>
  );
}
