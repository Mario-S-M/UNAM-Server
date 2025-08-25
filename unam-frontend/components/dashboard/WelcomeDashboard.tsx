'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";

export function WelcomeDashboard() {
  const { selectedSkill } = useDashboard();
  
  // No mostrar el componente de bienvenida si hay una skill seleccionada
  if (selectedSkill) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="max-w-3xl w-full space-y-8 p-4">
        <Card className="w-full">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Bienvenido al Dashboard</CardTitle>
                <CardDescription>
                  Explora idiomas, niveles y habilidades para tu aprendizaje
                </CardDescription>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Selecciona un idioma en el menú lateral para comenzar tu viaje de aprendizaje.
              Explora los diferentes niveles y habilidades disponibles.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Idiomas</h3>
                <p className="text-sm text-gray-500">
                  Explora diferentes idiomas y sus niveles asociados
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Habilidades</h3>
                <p className="text-sm text-gray-500">
                  Descubre habilidades específicas dentro de cada nivel
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}