"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Select,
  SelectItem,
  Divider,
} from "@heroui/react";
import {
  User,
  Crown,
  UserCheck,
  GraduationCap,
  BookOpen,
  Shield,
} from "lucide-react";
import { usePermissions } from "@/app/hooks/use-authorization";
import { useUpdateUserRoles } from "@/app/hooks/use-users";
import { addToast } from "@heroui/react";
import { Role } from "@/app/dal/auth-dal";

interface ChangeUserRoleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}

const roleConfig = {
  superUser: {
    label: "Super Administrador",
    description: "Acceso completo al sistema",
    color: "danger" as const,
    icon: <Crown className="h-4 w-4" />,
  },
  admin: {
    label: "Administrador",
    description: "Gestión de usuarios y contenido",
    color: "warning" as const,
    icon: <Shield className="h-4 w-4" />,
  },
  docente: {
    label: "Maestro",
    description: "Creación y gestión de contenido educativo",
    color: "primary" as const,
    icon: <GraduationCap className="h-4 w-4" />,
  },
  alumno: {
    label: "Alumno",
    description: "Acceso a contenido educativo",
    color: "success" as const,
    icon: <BookOpen className="h-4 w-4" />,
  },
  mortal: {
    label: "Usuario",
    description: "Acceso básico",
    color: "default" as const,
    icon: <User className="h-4 w-4" />,
  },
};

export function ChangeUserRoleModal({
  isOpen,
  onOpenChange,
  user,
}: ChangeUserRoleModalProps) {
  const { getAssignableRoles, canChangeUserRole, userRole } = usePermissions();
  const updateUserRolesMutation = useUpdateUserRoles();

  const [selectedRole, setSelectedRole] = useState<string>("");

  // Obtener el rol actual más alto del usuario
  const currentHighestRole =
    user?.roles?.find((role: string) => role !== "mortal") || "mortal";

  // Obtener roles que el usuario actual puede asignar
  const assignableRoles = getAssignableRoles();

  const handleRoleUpdate = (newRoles: string[]) => {
    if (!user?.id) return;

    updateUserRolesMutation.mutate(
      {
        input: {
          id: user.id,
          roles: newRoles,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedRole("");
        },
        // Error handling is now handled by the hook
      }
    );
  };

  const handleSubmit = () => {
    if (!selectedRole) {
      addToast({
        title: "Rol requerido",
        description: "Por favor selecciona un rol",
        color: "warning",
      });
      return;
    }

    if (!canChangeUserRole(user, [selectedRole as Role])) {
      addToast({
        title: "Sin permisos",
        description: "No tienes permisos para asignar este rol",
        color: "warning",
      });
      return;
    }

    handleRoleUpdate([selectedRole]);
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <UserCheck className="h-5 w-5 text-primary" />
                <span>Cambiar Rol de Usuario</span>
              </div>
              <p className="text-sm text-default-500 font-normal">
                Gestiona los roles de {user.fullName}
              </p>
            </ModalHeader>
            <ModalBody>
              {/* Información del usuario */}
              <div className="bg-default-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{user.fullName}</h3>
                    <p className="text-sm text-default-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-default-600">Rol actual:</span>
                  <Chip
                    color={
                      roleConfig[currentHighestRole as keyof typeof roleConfig]
                        .color
                    }
                    size="sm"
                    startContent={
                      roleConfig[currentHighestRole as keyof typeof roleConfig]
                        .icon
                    }
                  >
                    {
                      roleConfig[currentHighestRole as keyof typeof roleConfig]
                        .label
                    }
                  </Chip>
                </div>
              </div>

              {/* Información de permisos */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  Tu nivel de acceso:
                </h4>
                <div className="flex items-center gap-2">
                  <Chip
                    color={
                      roleConfig[userRole as keyof typeof roleConfig]?.color ||
                      "default"
                    }
                    size="sm"
                    startContent={
                      roleConfig[userRole as keyof typeof roleConfig]?.icon
                    }
                  >
                    {roleConfig[userRole as keyof typeof roleConfig]?.label ||
                      userRole}
                  </Chip>
                  <span className="text-sm text-blue-600">
                    Solo puedes asignar los roles mostrados abajo
                  </span>
                </div>
              </div>

              <Divider />

              {/* Selección de rol */}
              <div className="space-y-3">
                <h4 className="font-medium">Seleccionar Nuevo Rol</h4>
                {assignableRoles.length > 0 ? (
                  <Select
                    label="Nuevo rol"
                    placeholder="Elige un rol"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    description="Solo se muestran los roles que puedes asignar"
                    classNames={{
                      trigger: "border-default-200 hover:border-default-300",
                      value: "text-default-700",
                      label: "text-default-600",
                      selectorIcon: "text-default-600", // Fuerza el color del icono
                    }}
                  >
                    {assignableRoles.map((role) => (
                      <SelectItem key={role} textValue={roleConfig[role].label}>
                        <div className="flex items-center gap-2">
                          {roleConfig[role].icon}
                          <div>
                            <div>{roleConfig[role].label}</div>
                            <div className="text-xs text-default-500">
                              {roleConfig[role].description}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-default-500">
                      No tienes permisos para cambiar roles de usuarios
                    </p>
                  </div>
                )}
              </div>

              {/* Información sobre la jerarquía */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">
                  Jerarquía de Roles:
                </h4>
                <div className="text-sm text-yellow-700 space-y-1">
                  <p>
                    • <strong>Super Usuario:</strong> Puede asignar: Super
                    Usuario, Administrador, Maestro, Alumno, Usuario
                  </p>
                  <p>
                    • <strong>Administrador:</strong> Puede asignar: Maestro,
                    Alumno, Usuario
                  </p>
                  <p>
                    • <strong>Maestro:</strong> Puede asignar: Alumno, Usuario
                  </p>
                  <p>
                    • <strong>Alumno/Usuario:</strong> No puede asignar roles
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isDisabled={
                  !selectedRole ||
                  assignableRoles.length === 0 ||
                  !canChangeUserRole(user, [selectedRole as Role])
                }
                isLoading={updateUserRolesMutation.isPending}
              >
                Actualizar Rol
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
