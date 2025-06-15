"use client";
import React, { useState, useMemo } from "react";
import { useActiveLenguages } from "@/app/hooks";
import { Button, Pagination, CircularProgress } from "@heroui/react";
import Link from "next/link";

export function LanguagesList() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const {
    data: languagesData,
    isLoading,
    error,
    refetch,
  } = useActiveLenguages();

  // Calcular paginación
  const totalItems = languagesData?.data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedLanguages = useMemo(() => {
    if (!languagesData?.data) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return languagesData.data.slice(startIndex, endIndex);
  }, [languagesData?.data, currentPage, itemsPerPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <CircularProgress aria-label="Cargando idiomas..." />
        <span className="ml-4 text-foreground">Cargando idiomas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error.message}</span>
        <button
          onClick={() => refetch()}
          className="mt-2 bg-danger hover:bg-danger-600 text-danger-foreground font-bold py-2 px-4 rounded"
        >
          Reintentar
        </button>
      </div>
    );
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
        {languagesData?.data?.length ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {paginatedLanguages.map((language, index) => {
                const globalIndex =
                  (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <Link
                    key={language.id}
                    href={`/main/lenguages/${language.id}/view`}
                    className="group block"
                  >
                    <div className="bg-background border border-divider rounded-2xl p-10 shadow-sm cursor-pointer hover:shadow-lg transition-all duration-300 group-hover:border-primary/30 group-hover:bg-content1/30">
                      {/* Language number badge */}
                      <div className="flex justify-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-600 text-primary-foreground rounded-2xl flex items-center justify-center font-semibold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {globalIndex}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center">
                        <h3 className="text-2xl font-semibold text-foreground mb-6 leading-snug group transition-colors duration-300">
                          {language.name}
                        </h3>
                        <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto mb-6"></div>
                        <p className="text-default-500 leading-relaxed font-light text-base">
                          Explora y domina {language.name}
                        </p>
                      </div>

                      {/* Bottom decoration */}
                      <div className="mt-8 pt-6 border-t border-divider/50">
                        <div className="flex justify-center">
                          <div className="w-8 h-px bg-gradient-to-r from-transparent via-default-300 to-transparent"></div>
                        </div>
                      </div>
                    </div>
                  </Link>
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
          </>
        ) : (
          <div className="text-center py-24">
            <div className="max-w-sm mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-divider/50 shadow-sm">
                <span className="text-4xl">💻</span>
              </div>
              <h3 className="text-2xl font-light text-foreground mb-4">
                No hay idiomas disponibles
              </h3>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-default-300 to-transparent mx-auto mb-6"></div>
              <p className="text-default-500 font-light text-lg">
                Próximamente tendremos nuevos idiomas para ti
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
