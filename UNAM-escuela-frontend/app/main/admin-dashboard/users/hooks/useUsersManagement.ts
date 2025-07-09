import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsersPaginated, UsersFilterArgs } from "@/app/actions/user-actions";
import { useAuthorization } from "@/app/hooks/use-authorization";

export default function useUsersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  // Obtener el usuario actual y su idioma asignado (si es admin)
  const { user, isLoading } = useAuthorization();
  const assignedLanguageId = user?.assignedLanguage?.id;
  const userRoles = user?.roles || [];
  const isSuperUser = userRoles.includes("superUser");
  const isAdmin = userRoles.includes("admin") && !isSuperUser;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filtros base
  let filters: UsersFilterArgs = {
    search: debouncedSearchTerm || undefined,
    roles: roleFilter ? [roleFilter] : undefined,
    page: currentPage,
    limit: pageSize,
  };

  // Si el usuario es admin (no superUser), filtrar docentes por idioma asignado
  if (isAdmin && assignedLanguageId) {
    filters = {
      ...filters,
      roles: ["docente"],
      assignedLanguageId,
    };
  }

  const {
    data: paginatedUsersResponse,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["usersPaginated", filters],
    queryFn: () => getUsersPaginated(filters),
    staleTime: 1000 * 60,
  });

  const paginatedData = paginatedUsersResponse?.data;
  const users = paginatedData?.users || [];
  const totalPages = paginatedData?.totalPages || 1;

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    setDebouncedSearchTerm,
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
    filters,
  };
}
