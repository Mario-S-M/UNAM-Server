"use client";
import React from "react";
import { useActiveLenguages } from "@/app/hooks";
import { Card, CardBody, CardHeader } from "@heroui/react";
import Link from "next/link";

export function LanguagesList() {
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {languagesData.data.map((language) => (
            <Link
              key={language.id}
              href={`/main/lenguages/${language.id}/view`}
            >
              <Card>
                <CardBody className="p-8 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-center text-foreground">
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
