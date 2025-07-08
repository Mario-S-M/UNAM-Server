// Interfaces para componentes del dashboard administrativo

import { ReactNode } from "react";

// Header del dashboard
export interface AdminDashboardHeaderProps {
  title: string;
  subtitle: string;
  structureDescription: string;
}

// Tarjeta de navegación rápida
export interface AdminQuickNavCardProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  colorClass?: string;
}

// Grilla de navegación rápida
export interface AdminQuickNavGridProps {
  cards: AdminQuickNavCardProps[];
  children?: ReactNode; // Para casos condicionales como la tarjeta de usuarios
}
