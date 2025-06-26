"use client";
import React from "react";
import { LevelsList } from "@/components/levels/LevelsList";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguageById } from "@/app/hooks";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function ContentLenguage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const { data: languageData, isLoading: isLoadingLanguage } =
    useLanguageById(id);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumbs and Back Button */}
        <div className="flex items-center justify-between mb-8">
          <nav className="flex items-center space-x-2 text-sm text-foreground/70">
            <Link href="/" className="hover:text-foreground">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-foreground/50">Idiomas</span>
            <span>/</span>
            <span className="text-foreground">Niveles</span>
          </nav>

          <Button
            onClick={() => router.back()}
            variant="bordered"
            className="border-divider text-foreground/70"
          >
            ← Regresar
          </Button>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-foreground mb-4">
            {isLoadingLanguage
              ? "Cargando..."
              : `Niveles de ${languageData?.data?.name || "Idioma"}`}
          </h1>
          <div className="w-24 h-px bg-divider mx-auto mb-6"></div>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto font-light">
            Explora todos los niveles disponibles y comienza tu aprendizaje
          </p>
        </div>

        <LevelsList languageId={id} />
      </div>
    </div>
  );
}

export default ContentLenguage;
