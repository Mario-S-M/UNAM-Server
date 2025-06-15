"use client";

import { loginAction } from "@/app/actions";
import GlobalButton from "@/components/global/globalButton";
import GlobalInput from "@/components/global/globalInput";
import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const FormLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      console.log("🔐 Iniciando login con:", credentials.email);
      const result = await loginAction(credentials);
      console.log("📋 Resultado del login:", result);
      return result;
    },
    onSuccess: (result) => {
      console.log("✅ Login exitoso:", result);

      if (result.error) {
        console.error("❌ Error en el resultado:", result.error);
        throw new Error(result.error);
      }

      if (result.data) {
        addToast({
          title: "¡Bienvenid@!",
          color: "success",
          description: `Hola ${result.data.fullName}! Inicio de sesión exitoso`,
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });

        // Redirigir después de un breve delay para que se vea el toast
        setTimeout(() => {
          if (result.redirect) {
            console.log("🔄 Redirigiendo a:", result.redirect.destination);
            router.replace(result.redirect.destination);
          } else {
            // Fallback si no hay redirect
            router.replace("/main");
          }
        }, 1000);
      }
    },
    onError: (error) => {
      console.error("❌ Error en login:", error);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      addToast({
        title: "Campos requeridos",
        color: "warning",
        description: "Por favor completa todos los campos",
        timeout: 3000,
      });
      return;
    }

    console.log("📤 Enviando formulario de login");
    loginMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <GlobalInput
          name="email"
          type="email"
          label="Correo"
          color="default"
          isRequired={true}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isDisabled={loginMutation.isPending}
          classNames={{
            label: "text-content",
          }}
        />
      </div>

      <div className="mb-6">
        <GlobalInput
          name="password"
          type="password"
          label="Contraseña"
          isRequired={true}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isDisabled={loginMutation.isPending}
          classNames={{
            label: "text-content",
          }}
        />
      </div>

      <div className="flex justify-center">
        <GlobalButton
          type="submit"
          text={
            loginMutation.isPending ? "Iniciando sesión..." : "Iniciar Sesión"
          }
          variant="solid"
          isLoading={loginMutation.isPending}
          isDisabled={loginMutation.isPending}
        />
      </div>

      {/* Mostrar estado del login para debug */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-sm">
          <p>
            <strong>Estado:</strong>{" "}
            {loginMutation.isPending ? "Cargando..." : "Listo"}
          </p>
          {loginMutation.error && (
            <p className="text-red-600">
              <strong>Error:</strong> {loginMutation.error.message}
            </p>
          )}
        </div>
      )}
    </form>
  );
};
