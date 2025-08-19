"use client";

import { useState } from "react";
import { BookOpen, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface SidebarSkill {
  id: string;
  name: string;
}

interface SidebarLevel {
  id: string;
  name: string;
  description: string;
  difficulty: string; // Básico, Básico-Intermedio, Intermedio, Intermedio-Avanzado, Avanzado
  skills: SidebarSkill[];
}

interface SidebarLanguage {
  id: string;
  name: string;
  icons: string[];
  levels: SidebarLevel[];
}

interface LanguageItemProps {
  language: SidebarLanguage;
  isExpanded: boolean;
  onToggle: (languageId: string) => void;
}



export function LanguageItem({
  language,
  isExpanded,
  onToggle,
}: LanguageItemProps) {
  const router = useRouter();
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());

  const handleLanguageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navegar a la página del idioma
    router.push(`/dashboard/lenguage/${language.id}`);
    // Expandir automáticamente el sidebar para mostrar los niveles
    if (!isExpanded) {
      onToggle(language.id);
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(language.id);
  };

  const toggleLevel = (levelId: string) => {
    setExpandedLevels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(levelId)) {
        newSet.delete(levelId);
      } else {
        newSet.add(levelId);
      }
      return newSet;
    });
  };

  // Función para obtener la bandera del idioma
  const getLanguageFlag = (name: string) => {
    switch (name.toLowerCase()) {
      case 'inglés':
      case 'english':
        return '🇺🇸';
      case 'francés':
      case 'français':
      case 'french':
        return '🇫🇷';
      case 'alemán':
      case 'deutsch':
      case 'german':
        return '🇩🇪';
      case 'italiano':
      case 'italian':
        return '🇮🇹';
      case 'portugués':
      case 'português':
      case 'portuguese':
        return '🇵🇹';
      case 'japonés':
      case '日本語':
      case 'japanese':
        return '🇯🇵';
      case 'chino':
      case '中文':
      case 'chinese':
        return '🇨🇳';
      case 'español':
      case 'spanish':
        return '🇪🇸';
      case 'ruso':
      case 'русский':
      case 'russian':
        return '🇷🇺';
      case 'árabe':
      case 'العربية':
      case 'arabic':
        return '🇸🇦';
      case 'coreano':
      case '한국어':
      case 'korean':
        return '🇰🇷';
      default:
        return language.icons && language.icons.length > 0 ? language.icons[0] : '🌍';
    }
  };

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <Button
        variant="ghost"
        onClick={handleLanguageClick}
        className="w-full justify-start p-3 h-auto hover:bg-blue-50/50"
      >
        <div className="flex items-center gap-3 w-full">
          <div className="text-2xl">
            {getLanguageFlag(language.name)}
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-gray-800">{language.name}</div>
            <div className="text-sm text-gray-500">
              {language.levels.length} niveles disponibles
            </div>
          </div>
        </div>
      </Button>

      {isExpanded && (
        <div className="bg-blue-50/20">
          {language.levels.map((level: SidebarLevel) => (
            <div key={level.id} className="border-b border-gray-100 last:border-b-0">
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  // Si el nivel no está expandido, expandirlo y navegar
                  if (!expandedLevels.has(level.id)) {
                    toggleLevel(level.id);
                  }
                  router.push(`/dashboard/level/${level.id}`);
                }}
                className="w-full justify-start p-3 pl-6 h-auto hover:bg-green-50/50"
              >
                <div className="flex items-center gap-3 w-full">
                  <BookOpen className="w-4 h-4 text-green-600" />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm text-gray-700">{level.name}</div>
                    <div className="text-xs text-gray-500">{level.difficulty}</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {level.skills.length} skills
                  </Badge>
                </div>
              </Button>

              {/* Skills del nivel */}
              {expandedLevels.has(level.id) && (
                <div className="bg-green-50/20">
                  {level.skills.length === 0 ? (
                    <div className="px-12 py-2 text-xs text-gray-500">
                      No hay skills disponibles
                    </div>
                  ) : (
                    level.skills.map((skill: SidebarSkill) => (
                      <div key={skill.id} className="border-b border-gray-100 last:border-b-0">
                        <Button
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/skill/${skill.id}`);
                          }}
                          className="w-full justify-start p-3 pl-12 h-auto hover:bg-purple-50/50"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <Target className="w-4 h-4 text-purple-600" />
                            <div className="flex-1 text-left">
                              <div className="font-medium text-sm text-gray-700">{skill.name}</div>
                            </div>
                          </div>
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}