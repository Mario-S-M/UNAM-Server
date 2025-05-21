"use client";

import { loginAction } from "@/app/actions";
import GlobalButton from "@/components/global/globalButton"
import GlobalInput from "@/components/global/globalInput"
import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";

export const FormLogin = () => {
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;
            return loginAction({ email, password });
        },
        onSuccess: (result) => {
            if (result.error) {
                throw new Error(result.error);
            }
            
            addToast({
                title: "¡Bienvenid@!",
                color: "success",
                description: "Inicio de Sesión Éxitoso",
                timeout: 2000,
                shouldShowTimeoutProgress: true,
            });

            if (result.redirect) {
                router.replace(result.redirect.destination);
            }
        },
        onError: (error) => {
            addToast({
                title: "Error",
                color: "danger",
                description: error instanceof Error ? error.message : "Error de inicio de sesión",
                timeout: 4000,
                shouldShowTimeoutProgress: true,
            });
        }
    });

    const handleSubmit = (formData: FormData) => {
        loginMutation.mutate(formData);
    };

    return (
        <form action={handleSubmit}>
            <div className="mb-4">
                <GlobalInput
                    name="email"
                    type="email"
                    label="Correo"
                    color="default"
                    isRequired={true}
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
                    classNames={{
                        label: "text-content",
                    }}
                />
            </div>

            <div className="flex justify-center">
                <GlobalButton 
                    type="submit" 
                    text="Iniciar Sesión" 
                    variant="solid"
                />
            </div>
        </form>
    )
}