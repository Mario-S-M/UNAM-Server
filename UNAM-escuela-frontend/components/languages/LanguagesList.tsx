"use client";
import React, { useState, useMemo } from "react";
import { useActiveLenguages } from "@/app/hooks";
import { Pagination } from "@heroui/react";
import { LanguageCard } from "./LanguageCard";
import { LanguagesListError } from "./LanguagesListError";
import { LanguagesListLoading } from "./LanguagesListLoading";
import { LanguagesListEmpty } from "./LanguagesListEmpty";
import { Lenguage } from "@/app/interfaces/lenguage-interfaces";

export function LanguagesList() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const {
    data: languages,
    isLoading,
    error,
    refetch,
  } = useActiveLenguages(false); // Use public version for public pages

  // Calcular paginación
  const totalItems = languages?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedLanguages = useMemo(() => {
    if (!languages) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return languages.slice(startIndex, endIndex);
  }, [languages, currentPage, itemsPerPage]);

  if (isLoading) {
    return <LanguagesListLoading />;
  }

  if (error) {
    return (
      <LanguagesListError errorMessage={error.message} onRetry={refetch} />
    );
  }

  if (!languages || languages.length === 0) {
    return <LanguagesListEmpty />;
  }

  return (
    <div className="p-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light text-foreground mb-4">
          Idiomas Disponibles
        </h1>
        <div className="w-24 h-px bg-divider mx-auto mb-6"></div>
        <p className="text-foreground/70 text-lg max-w-2xl mx-auto font-light">
          Descubre los idiomas que puedes aprender y dominar en nuestra
          plataforma. Cada idioma ofrece una experiencia única y recursos
          diseñados para ayudarte a alcanzar tus metas de aprendizaje.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {paginatedLanguages.map((language: Lenguage, index: number) => {
            const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
            return (
              <LanguageCard
                key={language.id}
                language={language}
                globalIndex={globalIndex}
              />
            );
          })}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-16">
            <Pagination
              total={totalPages}
              page={currentPage}
              onChange={setCurrentPage}
              color="primary"
              variant="light"
              size="lg"
              showControls
              className="gap-2"
              classNames={{
                wrapper: "gap-2 overflow-visible shadow-none",
                item: "w-12 h-12 text-sm bg-transparent border-0 rounded-xl text-default-600 transition-all duration-200 font-medium",
                cursor:
                  "bg-gradient-to-br from-primary to-primary-600 text-primary-foreground font-semibold shadow-lg rounded-xl",
                prev: "bg-transparent border-0 rounded-xl text-default-600 transition-all duration-200",
                next: "bg-transparent border-0 rounded-xl text-default-600 transition-all duration-200",
                base: "gap-2",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
