// Interfaces para componentes de gestión de usuarios admin
import { ReactNode } from "react";

export interface UsersHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
}

export interface UsersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  onCreateUser: () => void;
}

export interface UsersStatsProps {
  total: number;
  active: number;
  inactive: number;
  teachers: number;
}

export interface UsersTableProps {
  users: any[];
  usersLoading: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: any;
  searchTerm: string;
  roleFilter: string;
  onPageChange: (page: number) => void;
}

export interface UserRowProps {
  user: any;
}
