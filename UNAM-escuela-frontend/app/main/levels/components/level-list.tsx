"use client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { useRouter } from "next/navigation";

interface Level {
  id: string;
  name: string;
  description: string;
}

interface LevelsResponse {
  data: Level[];
}

const fetchLevels = async (): Promise<LevelsResponse> => {
  const response = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query Levels {
          levels {
            id
            name
            description
          }
        }
      `
    }),
  });

  if (!response.ok) {
    throw new Error('Error al cargar los niveles');
  }

  const result = await response.json();
  return { data: result.data.levels };
};

export default function LevelList() {
  const router = useRouter();
  const {
    data,
    error,
    isLoading,
  } = useQuery<LevelsResponse>({
    queryKey: ['levels'],
    queryFn: fetchLevels,
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }
  if (isLoading) return <div>Cargando...</div>;
  if (!data?.data) return <div>No hay niveles disponibles</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {data.data
        .sort((a: Level, b: Level) => a.name.localeCompare(b.name))
        .map((level: Level) => (
        <Card
          key={level.id}
          className="w-full max-w-sm border-gray-400 border-3 rounded-lg p-4 bg-transparent"
        >
          <CardBody className="gap-4 relative">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">
                {level.name}
              </h2>
              <p className="text-sm opacity-75">{level.description}</p>
              <Button
                variant="flat"
                color="warning"
                onPress={() => router.push(`/main/skills/${level.id}/view`)}
              >
                Ir al nivel
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
