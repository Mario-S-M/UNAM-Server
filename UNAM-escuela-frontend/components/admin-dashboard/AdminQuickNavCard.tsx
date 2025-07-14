import React from "react";
import Link from "next/link";
import { Card, CardBody } from "@heroui/react";
import { AdminQuickNavCardProps } from "@/app/interfaces/admin-dashboard-interfaces";

export const AdminQuickNavCard: React.FC<AdminQuickNavCardProps> = ({
  href,
  icon,
  title,
  description,
  colorClass,
}) => (
  <Link href={href} className="group">
    <Card className="hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200">
      <CardBody className="p-6 text-center">
        <div className={colorClass + " mx-auto mb-3"}>{icon}</div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-foreground/60">{description}</p>
        {/* Flecha de navegación */}
        <div className="h-4 w-4 text-primary mt-2 mx-auto">
          {/* Puedes pasar un icono de flecha si lo deseas */}
        </div>
      </CardBody>
    </Card>
  </Link>
);
