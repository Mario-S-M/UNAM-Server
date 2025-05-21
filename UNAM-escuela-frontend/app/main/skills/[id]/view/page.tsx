"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLevel } from "@/app/actions";

// Define the Level type
interface Level {
  name: string;
  description: string;
}

// Define the ActionResponse type (based on typical server action response)
interface ActionResponse<T> {
  data?: T;
  error?: string;
  success?: boolean;
}

// Define the props for the component
interface ViewLevelPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ViewLevelPage({ params }: ViewLevelPageProps) {
  const resolvedParams = React.use(params);
    const { id } = resolvedParams;
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [feedbacks, setFeedbacks] = useState<Record<number, boolean>>({});

  const { data: response, error, isLoading } = useQuery<ActionResponse<Level>, Error>({
    queryKey: ["level", id],
    queryFn: () => getLevel(id),
  });

  const level = response?.data; // Extract the Level data from ActionResponse

  const steps = [
    {
      title: "Nombre del Nivel",
      field: "name",
      value: level?.name || "",
    },
    {
      title: "Descripción del Nivel",
      field: "description",
      value: level?.description || "",
    },
  ];

  const handleCheck = (step: number) => {
    if (!feedbacks[step]) {
      setFeedbacks((prev) => ({ ...prev, [step]: true }));
    }
  };

  const handleNext = () => {
    if (feedbacks[currentStep] && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isLoading) return <div className="text-center text-white">Cargando...</div>;
  if (error) return <div className="text-center text-red-400">Error: {error.message}</div>;
  if (!level) return <div className="text-center text-white">Intenta con otro Dato</div>;

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <div className="flex flex-1">
        {/* Sección de explicación a la izquierda */}
        <div className="w-1/3 p-6 bg-gray-100 text-gray-800 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Visualizar Nivel</h2>
          <p className="text-sm mb-4">Tiempo estimado: 5 min</p>
          <p className="text-sm mb-2">
            ¡Bienvenido! En esta sección podrás visualizar los detalles de un nivel educativo.
          </p>
          <p className="text-sm mb-2">Lo que aprenderás:</p>
          <ul className="list-disc list-inside text-sm space-y-2">
            <li>Visualizar el nombre del nivel.</li>
            <li>Explorar la descripción asociada al nivel.</li>
            <li>Interacción básica con los datos del nivel.</li>
          </ul>
          <p className="text-sm mt-4">¡Revisa los detalles y verifica la información para avanzar!</p>
        </div>

        {/* Sección de ejercicio en el centro */}
        <div className="w-2/3 p-8 flex flex-col justify-between">
          <div>
            {steps.map((step, index) => (
              <div
                key={index}
                className={`step ${currentStep === index + 1 ? "block" : "hidden"}`}
                data-step={index + 1}
              >
                <h2 className="text-xl font-semibold mb-4">{step.title}</h2>
                <div className="bg-gray-800 p-4 rounded-lg mb-4">
                  <p className="text-gray-300">{step.field === "name" ? "Nombre:" : "Descripción:"}</p>
                </div>
                {step.field === "name" ? (
                  <input
                    type="text"
                    value={step.value}
                    readOnly
                    className="p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <textarea
                    value={step.value}
                    readOnly
                    className="p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
                <div
                  className={`mt-4 text-gray-300 ${feedbacks[index + 1] ? "block" : "hidden"}`}
                >
                  {feedbacks[index + 1] && (
                    <span className="text-green-400">
                      {step.field === "name"
                        ? "¡Nombre del nivel cargado correctamente!"
                        : "¡Descripción del nivel cargada correctamente!"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Barra de progreso y botones inferior */}
          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`bg-gray-600 text-gray-300 px-4 py-2 rounded ${
                currentStep === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-500"
              }`}
            >
              Back
            </button>
            <span className="text-gray-400">{`${currentStep}/${steps.length}`}</span>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleCheck(currentStep)}
                className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
              >
                Verificar
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!feedbacks[currentStep] || currentStep === steps.length}
                className={`bg-blue-500 text-white px-4 py-2 rounded ${
                  !feedbacks[currentStep] || currentStep === steps.length
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
              >
                Up Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}