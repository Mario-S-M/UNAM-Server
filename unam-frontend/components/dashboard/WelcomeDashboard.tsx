'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export function WelcomeDashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="max-w-3xl w-full space-y-8 p-4">
        <Card className="w-full">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Bienvenido al Dashboard</CardTitle>
                <CardDescription>
                  Tu espacio de aprendizaje personalizado
                </CardDescription>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Bienvenido a tu dashboard de aprendizaje. Aquí podrás acceder a todas las herramientas y recursos necesarios para tu desarrollo académico.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}