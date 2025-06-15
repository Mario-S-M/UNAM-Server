"use client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { useRouter } from "next/navigation";
import { getActiveLenguages } from "@/app/actions";
import { Lenguage, LenguageResponse } from "@/app/interfaces";

export default function LenguageList() {
  const router = useRouter();
  const { data, error, isLoading } = useQuery<LenguageResponse>({
    queryKey: ["lenguages"],
    queryFn: getActiveLenguages,
    refetchOnWindowFocus: true,
  });

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }
  if (isLoading) return <div>Cargando...</div>;
  if (!data?.data) return <div>No hay idiomas disponibles</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {data.data
        .sort((a: Lenguage, b: Lenguage) => a.name.localeCompare(b.name))
        .map((lenguage: Lenguage) => (
          <Card
            key={lenguage.id}
            className="w-full max-w-sm border-gray-400 border-3 rounded-lg p-4 bg-transparent"
          >
            <CardBody className="gap-4 relative">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">{lenguage.name}</h2>
                <Button
                  variant="flat"
                  color="warning"
                  onPress={() =>
                    router.push(`/main/levels/${lenguage.id}/view`)
                  }
                >
                  Ir al lenguaje
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
    </div>
  );
}
