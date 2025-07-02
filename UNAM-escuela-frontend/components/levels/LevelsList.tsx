"use client";
import React, { useState, useMemo } from "react";
import { useLevelsByLanguage } from "@/app/hooks";
import { Button, Pagination, CircularProgress } from "@heroui/react";
import { useRouter } from "next/navigation";

interface LevelsListProps {
  languageId: string;
}

export function LevelsList({ languageId }: LevelsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const router = useRouter();

  const {
    data: levelsData,
    isLoading,
    error,
    refetch,
  } = useLevelsByLanguage(languageId, false); // false = no requiere autenticación

  // Calcular paginación
  const totalItems = levelsData?.data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedLevels = useMemo(() => {
    if (!levelsData?.data) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return levelsData.data.slice(startIndex, endIndex);
  }, [levelsData?.data, currentPage, itemsPerPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <CircularProgress aria-label="Cargando niveles..." />
        <span className="ml-4 text-foreground">Cargando niveles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error.message}</span>
        <Button
          onClick={() => refetch()}
          className="mt-2"
          color="danger"
          variant="bordered"
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {levelsData?.data?.length ? (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {paginatedLevels.map((level, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
              return (
                <div
                  key={level.id}
                  className="bg-background border border-divider rounded-2xl p-10 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                  onClick={() => router.push(`/main/content?level=${level.id}`)}
                >
                  {/* Level number badge - positioned at top */}
                  <div className="flex justify-center mb-8">
                    <div className="w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center font-medium text-lg shadow-sm">
                      {globalIndex}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-2xl font-medium text-foreground mb-4 leading-snug">
                      {level.name}
                    </h3>
                    {level.difficulty && (
                      <div className="mb-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            level.difficulty === "beginner"
                              ? "bg-green-100 text-green-600"
                              : level.difficulty === "intermediate"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {level.difficulty === "beginner"
                            ? "Principiante"
                            : level.difficulty === "intermediate"
                            ? "Intermedio"
                            : "Avanzado"}
                        </span>
                      </div>
                    )}
                    <p className="text-default-500 leading-relaxed font-light text-base">
                      {level.description}
                    </p>
                  </div>

                  {/* Bottom decoration line */}
                  <div className="mt-8 pt-6 border-t border-divider">
                    <div className="w-8 h-px bg-default-300 mx-auto"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={setCurrentPage}
                color="primary"
                variant="light"
                size="lg"
                showControls
                className="gap-1"
                classNames={{
                  wrapper: "gap-1 overflow-visible shadow-none",
                  item: "w-10 h-10 text-sm bg-transparent border-0 rounded-lg hover:bg-default-100 text-default-600 hover:text-foreground",
                  cursor:
                    "bg-primary text-primary-foreground font-semibold shadow-sm",
                  prev: "bg-transparent hover:bg-default-100 border-0 rounded-lg text-default-600 hover:text-foreground",
                  next: "bg-transparent hover:bg-default-100 border-0 rounded-lg text-default-600 hover:text-foreground",
                  base: "gap-1",
                }}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24">
          <div className="max-w-sm mx-auto">
            <div className="w-20 h-20 bg-default-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-divider">
              <span className="text-3xl text-default-300">📚</span>
            </div>
            <h3 className="text-2xl font-light text-foreground mb-4">
              No hay niveles disponibles
            </h3>
            <div className="w-12 h-px bg-default-300 mx-auto mb-4"></div>
            <p className="text-default-500 font-light text-lg">
              No se encontraron niveles para este idioma
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
