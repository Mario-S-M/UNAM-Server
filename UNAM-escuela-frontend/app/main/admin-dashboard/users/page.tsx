"use client";

import React, { useState, useCallback, useEffect } from "react";
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
  Pagination,
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
  Settings,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";
import { useAuth } from "@/components/providers/auth-provider";
import { useDebouncedSearch } from "@/app/hooks/use-debounced-value";
import { ChangeUserRoleModal } from "@/components/ui/change-user-role-modal";
import { useBlockUser } from "@/app/hooks/use-users";
import Link from "next/link";
import {
  getUsers,
  getUsersPaginated,
  blockUser,
} from "@/app/actions/user-actions";
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  // Debouncing para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Resetear a la página 1 cuando se busca
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Preparar filtros para la query
  const filters = {
    search: debouncedSearchTerm || undefined,
    roles: roleFilter ? [roleFilter] : undefined,
    page: currentPage,
    limit: pageSize,
  };

  // Query para usuarios paginados
  const {
    data: paginatedUsersResponse,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["usersPaginated", filters],
    queryFn: () => getUsersPaginated(filters),
    staleTime: 1000 * 60, // 1 minuto
  });

  const paginatedData = paginatedUsersResponse?.data;
  const users = paginatedData?.users || [];
  const totalPages = paginatedData?.totalPages || 1;

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

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
                classNames={{
                  trigger: "border-default-200 hover:border-default-300",
                  value: "text-default-700",
                  label: "text-default-600",
                  selectorIcon: "text-default-600", // Fuerza el color del icono
                }}
              >
                <SelectItem key="superUser">Super Usuario</SelectItem>
                <SelectItem key="admin">Administrador</SelectItem>
                <SelectItem key="docente">Docente</SelectItem>
                <SelectItem key="alumno">Alumno</SelectItem>
                <SelectItem key="mortal">Usuario Normal</SelectItem>
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
                {paginatedData?.total || 0}
              </p>
              <p className="text-sm text-blue-500">Total Usuarios</p>
            </CardBody>
          </Card>

          <Card className="bg-green-50 dark:bg-green-950/30">
            <CardBody className="p-4 text-center">
              <UserCheck className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {users?.filter((u: any) => u.isActive).length || 0}
              </p>
              <p className="text-sm text-green-500">Activos</p>
            </CardBody>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-950/30">
            <CardBody className="p-4 text-center">
              <UserX className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">
                {users?.filter((u: any) => !u.isActive).length || 0}
              </p>
              <p className="text-sm text-orange-500">Inactivos</p>
            </CardBody>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-950/30">
            <CardBody className="p-4 text-center">
              <Mail className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">
                {users?.filter((u: any) => u.roles.includes("docente"))
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
                {paginatedData && (
                  <span className="text-sm font-normal text-foreground/60 ml-2">
                    (Página {currentPage} de {totalPages} -{" "}
                    {paginatedData.total} usuarios totales)
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
            ) : !users || users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-default-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-default-500 mb-2">
                  No hay usuarios
                </h3>
                <p className="text-default-400 mb-4">
                  {searchTerm || roleFilter
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
                    {users.map((user: any) => (
                      <UserRow key={user.id} user={user} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Paginación */}
            {users && users.length > 0 && totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  total={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  variant="light"
                  size="lg"
                  showControls
                  className="gap-2"
                  classNames={{
                    wrapper: "gap-2 overflow-visible shadow-none",
                    item: "w-10 h-10 text-sm bg-transparent border-0 rounded-lg hover:bg-default-100 text-default-600 hover:text-foreground",
                    cursor:
                      "bg-primary text-primary-foreground font-semibold shadow-sm",
                    prev: "bg-transparent hover:bg-default-100 border-0 rounded-lg text-default-600 hover:text-foreground",
                    next: "bg-transparent hover:bg-default-100 border-0 rounded-lg text-default-600 hover:text-foreground",
                  }}
                />
              </div>
            )}

            {/* Información de paginación */}
            {paginatedData && (
              <div className="flex justify-between items-center mt-4 text-small text-default-500">
                <span>
                  Mostrando {(currentPage - 1) * pageSize + 1} -{" "}
                  {Math.min(currentPage * pageSize, paginatedData.total)} de{" "}
                  {paginatedData.total} usuarios
                </span>
                <span>
                  Página {currentPage} de {totalPages} (5 usuarios por página)
                </span>
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
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const { canManageUser } = usePermissions();

  // Usar el hook centralizado para bloquear usuarios
  const blockUserMutation = useBlockUser();

  // Check if current user can block this target user
  const canBlockUser = () => {
    if (!currentUser) return false;

    // Users cannot block themselves
    if (currentUser.id === user.id) return false;

    // Use the permission system to check if can manage this user
    return canManageUser(user);
  };

  const handleToggleStatus = () => {
    if (!canBlockUser()) {
      addToast({
        title: "Permisos insuficientes",
        description: "No tienes permisos para bloquear este usuario",
        color: "warning",
        timeout: 3000,
      });
      return;
    }
    blockUserMutation.mutate({ id: user.id });
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
            color="primary"
            onPress={() => setIsRoleModalOpen(true)}
            title="Cambiar rol"
          >
            <Settings className="h-4 w-4" />
          </Button>
          {canBlockUser() && (
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
          )}
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

      {/* Role Change Modal */}
      <ChangeUserRoleModal
        user={user}
        isOpen={isRoleModalOpen}
        onOpenChange={setIsRoleModalOpen}
      />
    </tr>
  );
}
