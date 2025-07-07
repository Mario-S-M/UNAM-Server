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
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: async (credentials: {
      fullName: string;
      email: string;
      password: string;
    }) => {
      const result = await registerAction(credentials);
      return result;
    },
    onSuccess: async (result) => {
      if (result.error) {
        addToast({
          title: "Error de Registro",
          color: "danger",
          description: result.error,
          timeout: 5000,
          shouldShowTimeoutProgress: true,
        });
        return;
      }

      if (result.data) {
        addToast({
          title: "¡Registro exitoso!",
          color: "success",
          description: `¡Bienvenid@ ${result.data.fullName}! Tu cuenta ha sido creada exitosamente.`,
          timeout: 5000,
          shouldShowTimeoutProgress: true,
        });

        // Cerrar modal y limpiar formulario
        onOpenChange(false);
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    },
    onError: (error) => {
      addToast({
        title: "Error de Registro",
        color: "danger",
        description:
          error instanceof Error
            ? error.message
            : "Error desconocido al registrarse",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      addToast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        color: "warning",
        timeout: 3000,
      });
      return;
    }

    if (password !== confirmPassword) {
      addToast({
        title: "Contraseñas no coinciden",
        description: "Las contraseñas deben ser iguales",
        color: "warning",
        timeout: 3000,
      });
      return;
    }

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

            <div>
              <GlobalInput
                name="confirmPassword"
                type="password"
                label="Confirmar Contraseña"
                isRequired={true}
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                isDisabled={registerMutation.isPending}
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
