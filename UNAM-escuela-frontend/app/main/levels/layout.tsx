'use client';

import { ReactNode } from "react";
import {Button} from "@heroui/button";
import { ArrowLeft } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function LevelLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col mt-4">
      <header className="p-2 flex items-center gap-4">
        <Button 
          isIconOnly 
          variant="flat" 
          color="primary" 
          aria-label="Regresar a la pantalla anterior"
          onPress={() => window.history.back()}
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">Niveles de Aprendizaje</h1>
      </header>

      <main className="flex-grow container mx-auto px-2 py-4">{children}</main>
    </div>
  );
}
