"use client";
import { LanguagesList } from "@/components/languages/LanguagesList";
import React from "react";
import { Header } from "@/components/layout/header";
import { WelcomeSection } from "@/components/home/WelcomeSection";

// Hacer la página dinámica
export const dynamic = "force-dynamic";

const HomePage = () => {
  return (
    <div className="min-h-screen px-4 py-8 md:px-8 lg:px-16">
      <Header />
      <div className="flex flex-col justify-center items-center space-y-8">
        <WelcomeSection
          title="Bienvenido"
          subtitle="Plataforma de aprendizaje totalmente accesible"
          description="Inicia sesión o crea una cuenta para acceder a todos los contenidos"
        />
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
