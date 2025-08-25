"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, /* CardDescription, */ CardHeader, CardTitle } from '@/components/ui/card';
import { Languages, Users, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  const adminCards = [
    {
      title: "Idiomas",
      description: "Gestionar idiomas del sistema",
      icon: Languages,
      href: "/admin/idiomas",
      count: "Gestión completa"
    },
    {
      title: "Usuarios",
      description: "Gestionar usuarios y roles",
      icon: Users,
      href: "/admin/usuarios",
      count: "Próximamente"
    },
    {
      title: "Configuración",
      description: "Configuración del sistema",
      icon: Settings,
      href: "/admin/configuracion",
      count: "Próximamente"
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Panel Administrativo</h1>
        <p className="text-muted-foreground">
          Bienvenido, {user?.fullName}. Gestiona el sistema desde aquí.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card 
              key={card.href} 
              className="cursor-pointer border p-2"
              onClick={() => router.push(card.href)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-2xl font-bold mb-2">{card.count}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}