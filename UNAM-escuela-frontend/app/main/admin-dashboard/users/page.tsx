"use client";

import {
  Card,
  CardBody
} from "@heroui/react";
import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersFilters } from "@/components/users/UsersFilters";
import { UsersStats } from "@/components/users/UsersStats";
import { UsersTable } from "@/components/users/UsersTable";
import useUsersManagement from "./hooks/useUsersManagement";

export default function UsersManagementPage() {
  return (
    <RouteGuard requiredPage="/main/admin-dashboard/users">
      <UsersManagementContent />
    </RouteGuard>
  );
}

function UsersManagementContent() {
  const { canManageUsers } = usePermissions();
  const {
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    isCreateUserModalOpen,
    setIsCreateUserModalOpen,
    users,
    usersLoading,
    usersError,
    paginatedData,
    totalPages,
  } = useUsersManagement();

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
        <UsersHeader
          title="Gestión de Usuarios"
          subtitle="Administra los usuarios del sistema"
          onBack={() => (window.location.href = "/main/admin-dashboard")}
        />
        <UsersFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          onCreateUser={() => setIsCreateUserModalOpen(true)}
        />
        <UsersStats
          total={paginatedData?.total || 0}
          active={users?.filter((u: any) => u.isActive).length || 0}
          inactive={users?.filter((u: any) => !u.isActive).length || 0}
          teachers={
            users?.filter((u: any) => u.roles.includes("docente")).length || 0
          }
        />
        <UsersTable
          users={users}
          usersLoading={usersLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          paginatedData={paginatedData}
          searchTerm={searchTerm}
          roleFilter={roleFilter}
          onPageChange={setCurrentPage}
        />
        {/* Aquí puedes agregar el modal de crear usuario usando isCreateUserModalOpen */}
      </div>
    </div>
  );
}
