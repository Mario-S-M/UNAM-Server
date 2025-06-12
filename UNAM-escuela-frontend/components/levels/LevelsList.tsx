"use client";
import React from "react";
import {
  useLevelsByLanguage,
  useCreateLevel,
  useDeleteLevel,
} from "@/app/hooks";
import { Button } from "@heroui/react";

interface LevelsListProps {
  languageId: string;
}

export function LevelsList({ languageId }: LevelsListProps) {
  const {
    data: levelsData,
    isLoading,
    error,
    refetch,
  } = useLevelsByLanguage(languageId);
  const createLevelMutation = useCreateLevel();
  const deleteLevelMutation = useDeleteLevel();

  const handleCreateLevel = async () => {
    const formData = new FormData();
    formData.append("name", "Nivel de Prueba");
    formData.append("description", "Descripción del nivel de prueba");

    try {
      const result = await createLevelMutation.mutateAsync(formData);
      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        alert("Nivel creado exitosamente");
        refetch(); // Refrescar la lista
      }
    } catch (error) {
      alert(`Error inesperado: ${error}`);
    }
  };

  const handleDeleteLevel = async (levelId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este nivel?")) {
      return;
    }

    try {
      const result = await deleteLevelMutation.mutateAsync(levelId);
      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        alert("Nivel eliminado exitosamente");
        refetch(); // Refrescar la lista
      }
    } catch (error) {
      alert(`Error inesperado: ${error}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-2">Cargando niveles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Niveles del Lenguaje</h2>
        <Button
          onClick={handleCreateLevel}
          color="primary"
          isLoading={createLevelMutation.isPending}
        >
          Crear Nivel de Prueba
        </Button>
      </div>

      {levelsData?.data?.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {levelsData.data.map((level) => (
            <div
              key={level.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">{level.name}</h3>
              <p className="text-gray-600 mb-4">{level.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">ID: {level.id}</span>
                <Button
                  onClick={() => handleDeleteLevel(level.id)}
                  color="danger"
                  size="sm"
                  variant="bordered"
                  isLoading={deleteLevelMutation.isPending}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg mb-4">
            No hay niveles disponibles
          </p>
          <Button
            onClick={handleCreateLevel}
            color="primary"
            isLoading={createLevelMutation.isPending}
          >
            Crear Primer Nivel
          </Button>
        </div>
      )}
    </div>
  );
}
