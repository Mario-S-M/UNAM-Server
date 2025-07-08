import React from "react";
import { UsersTableProps } from "@/app/interfaces/users-interfaces";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { Users } from "lucide-react";
import { UserRow } from "./UserRow";
import UsersTableHeader from "./UsersTableHeader";
import UsersEmptyState from "./UsersEmptyState";
import UsersPagination from "./UsersPagination";
import UsersPaginationInfo from "./UsersPaginationInfo";

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  usersLoading,
  currentPage,
  totalPages,
  pageSize,
  paginatedData,
  searchTerm,
  roleFilter,
  onPageChange,
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">
          Lista de Usuarios
          {paginatedData && (
            <span className="text-sm font-normal text-foreground/60 ml-2">
              (Página {currentPage} de {totalPages} - {paginatedData.total}{" "}
              usuarios totales)
            </span>
          )}
        </h2>
      </div>
    </CardHeader>
    <CardBody>
      {usersLoading ? (
        <div className="flex justify-center py-12">
          <span>Cargando...</span>
        </div>
      ) : !users || users.length === 0 ? (
        <UsersEmptyState searchTerm={searchTerm} roleFilter={roleFilter} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <UsersTableHeader />
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
        <UsersPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
      {/* Información de paginación */}
      {paginatedData && (
        <UsersPaginationInfo
          currentPage={currentPage}
          pageSize={pageSize}
          total={paginatedData.total}
          totalPages={totalPages}
        />
      )}
    </CardBody>
  </Card>
);
