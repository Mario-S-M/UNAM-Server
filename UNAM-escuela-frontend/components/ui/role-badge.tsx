"use client";

import { Chip } from "@heroui/react";

interface RoleBadgeProps {
  roles: string[];
}

const roleStyles = {
  superUser: { color: "danger" as const, label: "Super Administrador" },
  admin: { color: "warning" as const, label: "Administrador" },
  docente: { color: "primary" as const, label: "Maestro" },
  alumno: { color: "success" as const, label: "Alumno" },
  mortal: { color: "default" as const, label: "Usuario" },
};

export function RoleBadge({ roles }: RoleBadgeProps) {
  // Obtener el rol más alto (el primer rol que no sea 'mortal')
  const primaryRole = roles.find((role) => role !== "mortal") || "mortal";
  const roleConfig =
    roleStyles[primaryRole as keyof typeof roleStyles] || roleStyles.mortal;

  return (
    <Chip color={roleConfig.color} size="sm" variant="flat">
      {roleConfig.label}
    </Chip>
  );
}
