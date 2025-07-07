"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Spinner } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GlobalModal } from "@/components/global/globalModal";
import GlobalInput from "@/components/global/globalInput";
import GlobalButton from "@/components/global/globalButton";
import { updateUser } from "@/app/actions/user-actions";
import { addToast } from "@heroui/react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

interface EditUserModalProps {
  user: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserModal({
  user,
  isOpen,
  onOpenChange,
}: EditUserModalProps) {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  // Reset form when modal opens with new user
  useEffect(() => {
    if (user && isOpen) {
      setFullName(user.fullName || "");
      setPassword("");
      setConfirmPassword("");
    }
  }, [user, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFullName("");
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  // Verificar permisos para cambiar contraseña
  const canChangePassword = () => {
    if (!currentUser) return false;

    const currentUserRoles = currentUser.roles || [];
    const targetUserRoles = user.roles || [];

    // SuperUser puede cambiar contraseña de cualquiera
    if (currentUserRoles.includes("superUser")) {
      return true;
    }

    // Admin puede cambiar contraseña de docentes, alumnos y usuarios normales
    if (currentUserRoles.includes("admin")) {
      return (
        !targetUserRoles.includes("superUser") &&
        !targetUserRoles.includes("admin")
      );
    }

    return false;
  };

  // Verificar si el usuario actual puede editar este usuario específico
  const canEditUser = () => {
    if (!currentUser) return false;

    const currentUserRoles = currentUser.roles || [];
    const targetUserRoles = user.roles || [];

    // SuperUser puede editar cualquiera
    if (currentUserRoles.includes("superUser")) {
      return true;
    }

    // Admin puede editar docentes, alumnos y usuarios normales
    if (currentUserRoles.includes("admin")) {
      return (
        !targetUserRoles.includes("superUser") &&
        !targetUserRoles.includes("admin")
      );
    }

    return false;
  };

  const updateUserMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await updateUser(user.id, formData);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usersPaginated"] });
      addToast({
        title: "¡Éxito!",
        description: "Usuario actualizado exitosamente",
        color: "success",
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "Error al actualizar el usuario",
        color: "danger",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que el nombre no esté vacío
    if (!fullName.trim()) {
      addToast({
        title: "Error de validación",
        description: "El nombre es obligatorio",
        color: "danger",
      });
      return;
    }

    // Si se proporciona contraseña, validar que coincida
    if (password && password !== confirmPassword) {
      addToast({
        title: "Error de validación",
        description: "Las contraseñas no coinciden",
        color: "danger",
      });
      return;
    }

    // Si se proporciona contraseña, validar longitud mínima
    if (password && password.length < 6) {
      addToast({
        title: "Error de validación",
        description: "La contraseña debe tener al menos 6 caracteres",
        color: "danger",
      });
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName.trim());

    // Solo incluir contraseña si se proporcionó una nueva y tiene permisos
    if (password && canChangePassword()) {
      formData.append("password", password);
    }

    updateUserMutation.mutate(formData);
  };

  if (!user) return null;

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`Editar Usuario - ${user.fullName}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Información del usuario */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">
            Información del Usuario
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Email:</strong> {user.email} (no editable)
            </p>
            <p>
              <strong>Roles:</strong> {user.roles.join(", ")}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              <span
                className={
                  user.isActive
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {user.isActive ? "Activo" : "Inactivo"}
              </span>
            </p>
          </div>
        </div>

        {/* Campo de nombre */}
        <GlobalInput
          label="Nombre Completo"
          placeholder="Ingrese el nombre completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          isRequired
        />

        {/* Campo de contraseña con permisos */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Nueva Contraseña{" "}
            {canChangePassword() ? (
              <span className="text-default-400">(Opcional)</span>
            ) : (
              <span className="text-red-500">(Sin permisos)</span>
            )}
          </label>
          <p className="text-xs text-default-500 mb-2">
            {canChangePassword()
              ? "Deja vacío para mantener la contraseña actual"
              : "No tienes permisos para cambiar la contraseña de este usuario"}
          </p>
          <div className="relative">
            <GlobalInput
              type={showPassword ? "text" : "password"}
              placeholder={
                canChangePassword()
                  ? "Nueva contraseña (mínimo 6 caracteres)"
                  : "Sin permisos para cambiar contraseña"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isDisabled={!canChangePassword()}
              endContent={
                canChangePassword() && (
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                )
              }
            />
          </div>
        </div>

        {/* Campo de confirmar contraseña (solo si se proporciona contraseña y tiene permisos) */}
        {password && canChangePassword() && (
          <div className="relative">
            <GlobalInput
              type={showConfirmPassword ? "text" : "password"}
              label="Confirmar Nueva Contraseña"
              placeholder="Confirma la nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isRequired
              endContent={
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              }
            />
          </div>
        )}

        {/* Información de permisos */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Reglas de permisos:</p>
            <ul className="space-y-1 text-xs">
              <li>
                • <strong>SuperUser:</strong> Puede cambiar contraseña de
                cualquier usuario
              </li>
              <li>
                • <strong>Admin:</strong> Puede cambiar contraseña de docentes,
                alumnos y usuarios normales
              </li>
              <li>
                • <strong>Email:</strong> No se puede cambiar por seguridad
              </li>
              <li>
                • <strong>Roles:</strong> Solo se pueden cambiar desde la
                gestión de roles
              </li>
            </ul>
          </div>
        </div>

        {/* Advertencia si no tiene permisos */}
        {!canEditUser() && (
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">Permisos insuficientes:</p>
                <p className="text-xs">
                  No tienes permisos para editar este usuario. Solo puedes
                  editar usuarios con roles menores al tuyo.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-2 pt-4">
          <GlobalButton
            text="Cancelar"
            variant="light"
            onPress={() => onOpenChange(false)}
          />
          <GlobalButton
            text="Actualizar Usuario"
            color="primary"
            type="submit"
            isLoading={updateUserMutation.isPending}
            isDisabled={!canEditUser()}
          />
        </div>
      </form>
    </GlobalModal>
  );
}
