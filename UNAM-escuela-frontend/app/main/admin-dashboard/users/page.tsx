"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
  Button,
  Input,
  Select,
  SelectItem,
  Avatar,
} from "@heroui/react";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Search,
  ArrowLeft,
  Mail,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";
import Link from "next/link";
import { getUsers, blockUser } from "@/app/actions/user-actions";
import { addToast } from "@heroui/react";

export default function UsersManagementPage() {
  return (
    <RouteGuard requiredPage="/main/admin">
      <UsersManagementContent />
    </RouteGuard>
  );
}

function UsersManagementContent() {
  const { canManageUsers } = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Queries
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const filteredUsers = users?.data?.filter((user: any) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = !roleFilter || user.roles.includes(roleFilter);
    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (!canManageUsers) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Card className="max-w-md">
          <CardBody className="text-center py-8">
            <p className="text-default-500">
              No tienes permisos para acceder a esta página.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/main/admin-dashboard">
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">
                Gestión de Usuarios
              </h1>
              <p className="text-foreground/70">
                Administra los usuarios del sistema
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Buscar"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={<Search className="h-4 w-4" />}
              />

              <Select
                label="Filtrar por Rol"
                placeholder="Todos los roles"
                selectedKeys={roleFilter ? new Set([roleFilter]) : new Set()}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setRoleFilter(selected || "");
                }}
              >
                <SelectItem key="superUser">Super Usuario</SelectItem>
                <SelectItem key="admin">Administrador</SelectItem>
                <SelectItem key="docente">Docente</SelectItem>
                <SelectItem key="alumno">Alumno</SelectItem>
                <SelectItem key="mortal">Usuario Normal</SelectItem>
              </Select>

              <Select
                label="Filtrar por Estado"
                placeholder="Todos los estados"
                selectedKeys={
                  statusFilter ? new Set([statusFilter]) : new Set()
                }
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setStatusFilter(selected || "");
                }}
              >
                <SelectItem key="active">Activo</SelectItem>
                <SelectItem key="inactive">Inactivo</SelectItem>
              </Select>

              <Button
                color="primary"
                startContent={<Plus className="h-4 w-4" />}
                className="h-14"
              >
                Crear Usuario
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-50 dark:bg-blue-950/30">
            <CardBody className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">
                {users?.data?.length || 0}
              </p>
              <p className="text-sm text-blue-500">Total Usuarios</p>
            </CardBody>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950/30">
            <CardBody className="p-4 text-center">
              <UserCheck className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {users?.data?.filter((u: any) => u.isActive).length || 0}
              </p>
              <p className="text-sm text-green-500">Activos</p>
            </CardBody>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-950/30">
            <CardBody className="p-4 text-center">
              <UserX className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">
                {users?.data?.filter((u: any) => !u.isActive).length || 0}
              </p>
              <p className="text-sm text-orange-500">Inactivos</p>
            </CardBody>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-950/30">
            <CardBody className="p-4 text-center">
              <Mail className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">
                {users?.data?.filter((u: any) => u.roles.includes("docente"))
                  .length || 0}
              </p>
              <p className="text-sm text-purple-500">Docentes</p>
            </CardBody>
          </Card>
        </div>

        {/* Tabla de Usuarios */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">
                Lista de Usuarios
                {filteredUsers && (
                  <span className="text-sm font-normal text-foreground/60 ml-2">
                    ({filteredUsers.length} usuarios)
                  </span>
                )}
              </h2>
            </div>
          </CardHeader>
          <CardBody>
            {usersLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : !filteredUsers || filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-default-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-default-500 mb-2">
                  No hay usuarios
                </h3>
                <p className="text-default-400 mb-4">
                  {searchTerm || roleFilter || statusFilter
                    ? "No se encontraron usuarios con los filtros aplicados"
                    : "Aún no hay usuarios en el sistema"}
                </p>
                <Button
                  color="primary"
                  startContent={<Plus className="h-4 w-4" />}
                >
                  Crear Primer Usuario
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-divider">
                      <th className="text-left py-3 px-4 font-medium text-foreground">
                        USUARIO
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">
                        EMAIL
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">
                        ROLES
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">
                        ESTADO
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">
                        ÚLTIMA ACTUALIZACIÓN
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">
                        ACCIONES
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user: any) => (
                      <UserRow key={user.id} user={user} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

// Componente para cada fila de usuario
function UserRow({ user }: { user: any }) {
  const queryClient = useQueryClient();

  const blockUserMutation = useMutation({
    mutationFn: (userId: string) => blockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({
        title: user.isActive ? "Usuario bloqueado" : "Usuario activado",
        description: `${user.fullName} ha sido ${
          user.isActive ? "bloqueado" : "activado"
        } exitosamente`,
        color: "success",
        timeout: 3000,
      });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description:
          error.message || "No se pudo cambiar el estado del usuario",
        color: "danger",
        timeout: 3000,
      });
    },
  });

  const handleToggleStatus = () => {
    blockUserMutation.mutate(user.id);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "superUser":
        return "danger";
      case "admin":
        return "warning";
      case "docente":
        return "primary";
      case "alumno":
        return "success";
      default:
        return "default";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "superUser":
        return "Super Usuario";
      case "admin":
        return "Administrador";
      case "docente":
        return "Docente";
      case "alumno":
        return "Alumno";
      case "mortal":
        return "Usuario";
      default:
        return role;
    }
  };

  return (
    <tr className="border-b border-divider hover:bg-content2/50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <Avatar
            name={user.fullName}
            size="sm"
            className="bg-primary-100 text-primary-600"
          />
          <div>
            <p className="font-medium">{user.fullName}</p>
            <p className="text-xs text-foreground/50">
              ID: {user.id.slice(0, 8)}...
            </p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm">{user.email}</p>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role: string) => (
            <Chip
              key={role}
              size="sm"
              color={getRoleColor(role)}
              variant="flat"
            >
              {getRoleLabel(role)}
            </Chip>
          ))}
        </div>
      </td>
      <td className="py-3 px-4">
        <Chip
          size="sm"
          color={user.isActive ? "success" : "danger"}
          variant="flat"
        >
          {user.isActive ? "Activo" : "Inactivo"}
        </Chip>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm">
          {user.lastUpdateBy
            ? `Por: ${user.lastUpdateBy.fullName}`
            : "Sin actualizaciones"}
        </p>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <Button isIconOnly size="sm" variant="light" title="Editar usuario">
            <Edit className="h-4 w-4 text-foreground" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color={user.isActive ? "warning" : "success"}
            onPress={handleToggleStatus}
            isLoading={blockUserMutation.isPending}
            title={user.isActive ? "Bloquear usuario" : "Activar usuario"}
          >
            {user.isActive ? (
              <UserX className="h-4 w-4" />
            ) : (
              <UserCheck className="h-4 w-4" />
            )}
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color="danger"
            title="Eliminar usuario"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
