"use client";

import React, { useState, useEffect } from "react";
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
  Globe,
} from "lucide-react";
import { usePermissions } from "@/app/hooks/use-authorization";
import { useUpdateUserRolesWithLanguage } from "@/app/hooks/use-users";
import { useActiveLenguages } from "@/app/hooks/use-lenguages";
import { addToast } from "@heroui/react";
import { Role } from "@/app/dal/auth-dal";

interface AssignAdminWithLanguageModalProps {
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
    description: "Gestión de usuarios y contenido para un idioma específico",
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

export function AssignAdminWithLanguageModal({
  isOpen,
  onOpenChange,
  user,
}: AssignAdminWithLanguageModalProps) {
  const { getAssignableRoles, canChangeUserRole, userRole } = usePermissions();
  const updateUserRolesMutation = useUpdateUserRolesWithLanguage();
  const { data: languages, isLoading: languagesLoading } = useActiveLenguages();

  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  // Obtener el rol actual más alto del usuario
  const currentHighestRole =
    user?.roles?.find((role: string) => role !== "mortal") || "mortal";

  // Obtener roles que el usuario actual puede asignar
  const assignableRoles = getAssignableRoles();

  // Reset selections when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedRole("");
      setSelectedLanguage("");
    }
  }, [isOpen]);

  const handleRoleUpdate = async () => {
    if (!user?.id || !selectedRole) return;

    // Si el rol seleccionado es admin, requerir idioma
    if (selectedRole === "admin" && !selectedLanguage) {
      addToast({
        title: "Error",
        description: "Debes seleccionar un idioma para el administrador",
        color: "danger",
        timeout: 3000,
      });
      return;
    }

    try {
      // Actualizar roles y asignar idioma si es admin
      await updateUserRolesMutation.mutateAsync({
        userId: user.id,
        roles: [selectedRole],
        languageId: selectedRole === "admin" ? selectedLanguage : null,
      });

      onOpenChange(false);
      setSelectedRole("");
      setSelectedLanguage("");
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRoleUpdate();
  };

  const onClose = () => {
    onOpenChange(false);
    setSelectedRole("");
    setSelectedLanguage("");
  };

  if (!canChangeUserRole(user, selectedRole ? [selectedRole as Role] : [])) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                <span>Asignar Rol y Permisos</span>
              </div>
            </ModalHeader>
            <ModalBody className="gap-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información del usuario */}
                <div className="bg-content2 p-4 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">
                    Usuario a modificar:
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user?.fullName}</p>
                      <p className="text-sm text-foreground/70">
                        {user?.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-default-600">
                        Rol actual:
                      </span>
                      <Chip
                        color={
                          roleConfig[
                            currentHighestRole as keyof typeof roleConfig
                          ].color
                        }
                        size="sm"
                        startContent={
                          roleConfig[
                            currentHighestRole as keyof typeof roleConfig
                          ].icon
                        }
                      >
                        {
                          roleConfig[
                            currentHighestRole as keyof typeof roleConfig
                          ].label
                        }
                      </Chip>
                    </div>
                  </div>
                </div>

                {/* Selección de rol */}
                <div>
                  <Select
                    label="Nuevo Rol"
                    placeholder="Selecciona un rol"
                    selectedKeys={
                      selectedRole ? new Set([selectedRole]) : new Set()
                    }
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setSelectedRole(selected || "");
                    }}
                    startContent={<UserCheck className="h-4 w-4" />}
                    isRequired
                  >
                    {assignableRoles.map((role) => (
                      <SelectItem
                        key={role}
                        textValue={
                          roleConfig[role as keyof typeof roleConfig].label
                        }
                        startContent={
                          roleConfig[role as keyof typeof roleConfig].icon
                        }
                      >
                        <div>
                          <div className="font-medium">
                            {roleConfig[role as keyof typeof roleConfig].label}
                          </div>
                          <div className="text-sm text-default-500">
                            {
                              roleConfig[role as keyof typeof roleConfig]
                                .description
                            }
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Selección de idioma (solo para admin) */}
                {selectedRole === "admin" && (
                  <div className="space-y-3">
                    <div className="bg-warning-50 border border-warning-200 text-warning-800 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="h-4 w-4" />
                        <span className="font-medium">
                          Asignación de Idioma
                        </span>
                      </div>
                      <p className="text-sm">
                        Los administradores solo pueden gestionar contenido del
                        idioma que se les asigne.
                      </p>
                    </div>

                    <Select
                      label="Idioma a Administrar"
                      placeholder="Selecciona el idioma que administrará"
                      selectedKeys={
                        selectedLanguage
                          ? new Set([selectedLanguage])
                          : new Set()
                      }
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        setSelectedLanguage(selected || "");
                      }}
                      startContent={<Globe className="h-4 w-4" />}
                      isRequired
                      isLoading={languagesLoading}
                    >
                      {(languages?.data ?? []).map((language: any) => (
                        <SelectItem key={language.id} textValue={language.name}>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-primary" />
                            <span>{language.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                )}

                {/* Información de permisos */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Tu nivel de acceso:
                  </h4>
                  <div className="flex items-center gap-2">
                    <Chip
                      color={
                        roleConfig[userRole as keyof typeof roleConfig]
                          ?.color || "default"
                      }
                      size="sm"
                      startContent={
                        roleConfig[userRole as keyof typeof roleConfig]
                          ?.icon || <User className="h-4 w-4" />
                      }
                    >
                      {roleConfig[userRole as keyof typeof roleConfig]?.label ||
                        "Usuario"}
                    </Chip>
                  </div>
                </div>

                {selectedRole && (
                  <div className="bg-content2 p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">
                      Resumen de cambios:
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Nuevo rol:</span>
                        <Chip
                          color={
                            roleConfig[selectedRole as keyof typeof roleConfig]
                              .color
                          }
                          size="sm"
                          startContent={
                            roleConfig[selectedRole as keyof typeof roleConfig]
                              .icon
                          }
                        >
                          {
                            roleConfig[selectedRole as keyof typeof roleConfig]
                              .label
                          }
                        </Chip>
                      </div>
                      {selectedRole === "admin" && selectedLanguage && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Idioma asignado:</span>
                          <Chip
                            color="primary"
                            size="sm"
                            startContent={<Globe className="h-4 w-4" />}
                          >
                            {
                              languages?.data?.find(
                                (l) => l.id === selectedLanguage
                              )?.name
                            }
                          </Chip>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={handleRoleUpdate}
                isDisabled={
                  !selectedRole ||
                  assignableRoles.length === 0 ||
                  !canChangeUserRole(user, [selectedRole as Role]) ||
                  (selectedRole === "admin" && !selectedLanguage)
                }
                isLoading={updateUserRolesMutation.isPending}
              >
                Asignar Rol
                {selectedRole === "admin" && " e Idioma"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
