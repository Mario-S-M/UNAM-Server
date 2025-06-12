"use client";
import React from "react";
import { LevelsList } from "@/components/levels/LevelsList";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function ContentLenguage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  return (
    <div className="container mx-auto">
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h1 className="text-2xl font-bold text-blue-800">
          Contenido del Lenguaje
        </h1>
        <p className="text-blue-600">ID del Lenguaje: {id}</p>
      </div>

      <LevelsList languageId={id} />
    </div>
  );
}

export default ContentLenguage;
