import React from "react";
import { AdminQuickNavGridProps } from "@/app/interfaces/admin-dashboard-interfaces";
import { AdminQuickNavCard } from "./AdminQuickNavCard";

export const AdminQuickNavGrid: React.FC<AdminQuickNavGridProps> = ({
  cards,
  children,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {cards.map((card, idx) => (
      <AdminQuickNavCard key={card.href} {...card} />
    ))}
    {children}
  </div>
);
