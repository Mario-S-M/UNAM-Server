'use client';

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Lenguage } from "../schemas/languageSchema";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";

interface LanguageCardProps {
  language: Lenguage;
}

export default function LanguageCard({ language }: LanguageCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/idiomas/${language.id}`);
  };

  return (
    <Card
      key={language.id}
      onClick={handleClick}
      className="border-2 border-gray-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 bg-white rounded-2xl flex flex-col items-center justify-center min-h-[220px] min-w-[180px] p-4 cursor-pointer transform hover:-translate-y-2 hover:scale-105"
    >
      <CardHeader className="flex flex-col items-center pb-2">
        <div className="mb-4 flex gap-2 text-6xl">
          {language.icons && language.icons.length > 0 ? (
            language.icons.slice(0, 2).map((icon, idx) => (
              <span key={idx} className="animate-pulse">{icon}</span>
            ))
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              {language.name === 'Inglés' ? (
                <span className="text-3xl">🇺🇸</span>
              ) : language.name === 'Francés' ? (
                <span className="text-3xl">🇫🇷</span>
              ) : language.name === 'Alemán' ? (
                <span className="text-3xl">🇩🇪</span>
              ) : language.name === 'Italiano' ? (
                <span className="text-3xl">🇮🇹</span>
              ) : language.name === 'Portugués' ? (
                <span className="text-3xl">🇵🇹</span>
              ) : language.name === 'Japonés' ? (
                <span className="text-3xl">🇯🇵</span>
              ) : language.name === 'Chino' ? (
                <span className="text-3xl">🇨🇳</span>
              ) : (
                <Globe className="h-10 w-10 text-white" />
              )}
            </div>
          )}
        </div>
        <CardTitle className="text-xl font-bold text-gray-800 mt-2 text-center hover:text-indigo-600 transition-colors">
          {language.name}
        </CardTitle>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 text-center">
          {language.eslogan_atractivo || language.descripcion_corta || 'Descripción no disponible'}
        </p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
              {language.nivel || 'Nivel no especificado'}
            </span>
            <span className="text-gray-600 font-medium">{language.duracion_total_horas || 0}h</span>
          </div>
          {language.badge_destacado && (
            <div className="flex justify-center">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                {language.badge_destacado}
              </span>
            </div>
          )}
        </div>
        <div className="text-center">
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 font-medium">
            Ver detalles
          </button>
        </div>
      </CardHeader>
    </Card>
  );
}
