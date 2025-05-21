"use client";
import React from "react";
import { getLevel } from "@/app/actions";
import { useQuery } from "@tanstack/react-query";
import GlobalInput from "@/components/global/globalInput";
import GlobalTextArea from "@/components/global/globalTextArea";
import GlobalButton from "@/components/global/globalButton";
import { Card, CardBody, CardHeader } from "@heroui/react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function LevelsEditPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const {
    data: level,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["level", id],
    queryFn: () => getLevel(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!level) return <div>Intenta con otro Dato</div>;

  return (
    <div className="flex justify-center items-center w-full p-4">
      <Card className="w-full max-w-md border-3 border-current border-opacity-35 rounded-lg p-4 bg-transparent">
        <CardHeader className="flex justify-between items-center">
          <h2 className="w-full text-center text-2xl bg-primary-600 text-content1 rounded-md">
            Editar Nivel
          </h2>
        </CardHeader>
        <CardBody className="gap-4 relative">
          <form>
            <div className="space-y-2">
              <GlobalInput
                defaultValue={`${level.data?.name}`}
                label="Nombre Materia"
              />
              <GlobalTextArea
                defaultValue={`${level.data?.description}`}
                label="Descripción de la Materia"
              />
              <div className="w-full flex items-center justify-center">
                <GlobalButton color="warning" text="Actualizar" />
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}