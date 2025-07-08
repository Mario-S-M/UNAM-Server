import React from "react";
import { CircularProgress } from "@heroui/react";

export const LanguagesListLoading: React.FC = () => (
  <div className="flex justify-center items-center p-8">
    <CircularProgress aria-label="Cargando idiomas..." />
    <span className="ml-4 text-foreground">Cargando idiomas...</span>
  </div>
);
