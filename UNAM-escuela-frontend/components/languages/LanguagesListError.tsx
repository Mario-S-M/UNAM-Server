import React from "react";
import { LanguagesListErrorProps } from "@/app/interfaces/home-interfaces";

export const LanguagesListError: React.FC<LanguagesListErrorProps> = ({
  errorMessage,
  onRetry,
}) => (
  <div className="bg-danger-50 border border-danger-200 text-danger-600 px-4 py-3 rounded">
    <strong className="font-bold">Error: </strong>
    <span className="block sm:inline">{errorMessage}</span>
    <button
      onClick={onRetry}
      className="mt-2 bg-danger hover:bg-danger-600 text-danger-foreground font-bold py-2 px-4 rounded"
    >
      Reintentar
    </button>
  </div>
);
