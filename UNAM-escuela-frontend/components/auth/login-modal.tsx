"use client";

import { useState } from "react";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import { Card, CardBody, addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginAction } from "@/app/actions";
import { reestablishAuthCookie } from "@/app/utils/cookie-recovery";

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
        // Guardar el token para recuperación de cookies si es necesario
        if (result.token) {
          console.log("💾 Modal: Guardando token para recuperación:", {
            hasToken: !!result.token,
            tokenLength: result.token.length,
          });

          // También intentar establecer la cookie desde el cliente como respaldo
          try {
            reestablishAuthCookie({
              token: result.token,
              secure: process.env.NODE_ENV === "production",
            });
          } catch (error) {
            console.warn(
              "⚠️ Modal: No se pudo establecer cookie desde cliente:",
              error
            );
          }
        }

        // Invalidar el query del usuario para que se actualice el estado
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });

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

        // Estrategia mejorada para asegurar que la cookie se mantenga
        console.log(
          "🔄 Modal: Preparando redirección después del login exitoso..."
        );

        // Primero: Forzar invalidación y refetch del usuario actual
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });

        // Segundo: Esperar un tiempo más largo para que la cookie se establezca
        setTimeout(async () => {
          // Tercero: Verificar que el usuario esté disponible antes de redirigir
          console.log(
            "🔍 Modal: Verificando estado de autenticación antes de redirigir..."
          );

          try {
            // Forzar un refetch del usuario para asegurar que la cookie funciona
            await queryClient.refetchQueries({ queryKey: ["currentUser"] });

            if (result.redirect) {
              console.log(
                "🔄 Modal: Redirigiendo a:",
                result.redirect.destination
              );
              // Usar push en lugar de replace para mejor manejo de cookies
              router.push(result.redirect.destination);
            } else {
              // Fallback a dashboard de admin si es superUser o admin
              const userRoles = result.data?.roles || [];
              if (
                userRoles.includes("superUser") ||
                userRoles.includes("admin")
              ) {
                router.push("/main/admin-dashboard");
              } else if (userRoles.includes("docente")) {
                router.push("/main/teacher");
              } else {
                router.push("/main/student");
              }
            }
          } catch (error) {
            console.error(
              "❌ Modal: Error verificando usuario antes de redirigir:",
              error
            );
            // Intentar redirección de todas formas
            if (result.redirect) {
              router.push(result.redirect.destination);
            } else {
              router.push("/main/student");
            }
          }
        }, 1500); // Aumentar significativamente el delay para producción
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
