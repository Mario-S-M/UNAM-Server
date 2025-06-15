"use client";

import { useState } from "react";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import { Card, CardBody, addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerAction } from "@/app/actions";

interface RegisterModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegisterModal({ isOpen, onOpenChange }: RegisterModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: async (credentials: {
      fullName: string;
      email: string;
      password: string;
    }) => {
      console.log(
        "📝 Modal: Iniciando registro con:",
        credentials.email,
        credentials.fullName
      );
      const result = await registerAction(credentials);
      console.log("📋 Modal: Resultado del registro:", result);
      return result;
    },
    onSuccess: (result) => {
      console.log("✅ Modal: Registro exitoso:", result);

      if (result.error) {
        console.error("❌ Modal: Error en resultado:", result.error);
        throw new Error(result.error);
      }

      if (result.data) {
        // Invalidar el query del usuario para que se actualice el estado
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });

        addToast({
          title: "¡Cuenta creada exitosamente!",
          color: "success",
          description: `¡Bienvenid@ ${result.data.fullName}! Tu cuenta ha sido creada como alumno`,
          timeout: 4000,
          shouldShowTimeoutProgress: true,
        });

        // Cerrar modal y limpiar formulario
        onOpenChange(false);
        setFullName("");
        setEmail("");
        setPassword("");

        // Redirigir después de un breve delay para que se actualice el usuario
        setTimeout(() => {
          if (result.redirect) {
            console.log(
              "🔄 Modal: Redirigiendo a:",
              result.redirect.destination
            );
            router.replace(result.redirect.destination);
          } else {
            router.replace("/main/student");
          }
        }, 1000);
      }
    },
    onError: (error) => {
      console.error("❌ Modal: Error en registro:", error);
      addToast({
        title: "Error al crear cuenta",
        color: "danger",
        description:
          error instanceof Error
            ? error.message
            : "Error desconocido al crear la cuenta",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      addToast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        color: "warning",
        timeout: 3000,
      });
      return;
    }

    if (password.length < 6) {
      addToast({
        title: "Contraseña muy corta",
        description: "La contraseña debe tener al menos 6 caracteres",
        color: "warning",
        timeout: 3000,
      });
      return;
    }

    console.log("📤 Modal: Enviando formulario de registro");
    registerMutation.mutate({ fullName, email, password });
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Crear Cuenta Nueva"
    >
      <Card className="!shadow-none">
        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <GlobalInput
                name="fullName"
                type="text"
                label="Nombre Completo"
                color="default"
                isRequired={true}
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFullName(e.target.value)
                }
                isDisabled={registerMutation.isPending}
                classNames={{
                  label: "text-content",
                }}
              />
            </div>

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
                isDisabled={registerMutation.isPending}
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
                isDisabled={registerMutation.isPending}
                classNames={{
                  label: "text-content",
                }}
                description="Mínimo 6 caracteres"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <GlobalButton
                onPress={() => onOpenChange(false)}
                text="Cancelar"
                variant="bordered"
                isDisabled={registerMutation.isPending}
              />
              <GlobalButton
                type="submit"
                text={
                  registerMutation.isPending
                    ? "Creando cuenta..."
                    : "Crear Cuenta"
                }
                variant="solid"
                isLoading={registerMutation.isPending}
                isDisabled={registerMutation.isPending}
              />
            </div>

            {/* Debug info */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-2 rounded text-sm">
                {registerMutation.error && (
                  <p className="text-red-600">
                    <strong>Error:</strong> {registerMutation.error.message}
                  </p>
                )}
              </div>
            )}
          </form>
        </CardBody>
      </Card>
    </GlobalModal>
  );
}
