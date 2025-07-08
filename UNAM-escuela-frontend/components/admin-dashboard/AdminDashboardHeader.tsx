import React from "react";
import { AdminDashboardHeaderProps } from "@/app/interfaces/admin-dashboard-interfaces";

export const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({
  title,
  subtitle,
  structureDescription,
}) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-primary mb-2">{title}</h1>
    <p className="text-foreground/70">{subtitle}</p>
    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg mt-4">
      <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
        Estructura del Sistema
      </h3>
      <p className="text-blue-700 dark:text-blue-300">{structureDescription}</p>
    </div>
  </div>
);
