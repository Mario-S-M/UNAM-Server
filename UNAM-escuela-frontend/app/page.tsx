"use client";
import { LanguagesList } from "@/components/languages/LanguagesList";
import { useAccessibility } from "@/app/providers";
import React from "react";
import { Header } from "@/components/layout/header";

// Hacer la página dinámica
export const dynamic = "force-dynamic";

const HomePage = () => {
  return (
    <div className="min-h-screen px-4 py-8 md:px-8 lg:px-16">
      <Header />
      <div className="flex flex-col justify-center items-center space-y-8">
        <div className="text-center">
          <h1 className="font-bold mb-2 md:mb-4 text-foreground">Bienvenido</h1>
          <p className="mb-4 md:mb-6 text-foreground">
            Plataforma de aprendizaje totalmente accesible
          </p>
          <p className="text-default-600">
            Inicia sesión o crea una cuenta para acceder a todos los contenidos
          </p>
        </div>

        {/* Lista de Idiomas */}
        <div className="w-full max-w-6xl">
          <h2 className="font-semibold text-center mb-6 text-foreground">
            Idiomas
          </h2>
          <LanguagesList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
