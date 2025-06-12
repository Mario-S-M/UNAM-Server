"use client";
import React, { useState, useMemo } from "react";
import { useActiveLenguages } from "@/app/hooks";
import { Button, Card, CardBody, Pagination } from "@heroui/react";
import Link from "next/link";

export function LanguagesList() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const {
    data: languagesData,
    isLoading,
    error,
    refetch,
  } = useActiveLenguages();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-2 text-foreground">Cargando lenguajes...</span>
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
      <h1 className="text-3xl font-bold mb-6 text-center text-foreground">
        Lenguajes Disponibles
      </h1>

      {languagesData?.data?.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {languagesData.data.map((language) => (
            <Link
              key={language.id}
              href={`/main/lenguages/${language.id}/view`}
              className="group"
            >
              <Card
                className="border border-divider hover:border-primary transition-all duration-300 shadow-none hover:shadow-sm bg-content1/50 backdrop-blur-sm"
                isPressable
              >
                <CardBody className="p-6 flex items-center justify-center min-h-[120px]">
                  <h3 className="text-xl font-semibold text-center text-foreground group-hover:text-primary transition-colors duration-300">
                    {language.name}
                  </h3>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-default-500 text-lg">
            No hay lenguajes disponibles
          </p>
        </div>
      )}
    </div>
  );
}
