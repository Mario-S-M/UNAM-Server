"use client";

import { ChevronDown, ChevronRight, BookOpen, Target, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SidebarContent {
  id: string;
  title: string;
  type: "video" | "article" | "exercise";
}

interface SidebarSkill {
  id: string;
  name: string;
  contents: SidebarContent[];
}

interface SidebarLevel {
  id: string;
  name: string;
  description: string;
  difficulty: string; // Básico, Básico-Intermedio, Intermedio, Intermedio-Avanzado, Avanzado
  skills: SidebarSkill[];
}

interface LevelItemProps {
  level: SidebarLevel;
  isExpanded: boolean;
  onToggle: (levelId: string) => void;
  expandedSkills: Set<string>;
  onToggleSkill: (skillId: string) => void;
}

function getContentIcon(type: string) {
  switch (type) {
    case "video":
      return "🎥";
    case "article":
      return "📄";
    case "exercise":
      return "✏️";
    default:
      return "📝";
  }
}

export function LevelItem({
  level,
  isExpanded,
  onToggle,
  expandedSkills,
  onToggleSkill,
}: LevelItemProps) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <Button
        variant="ghost"
        onClick={() => onToggle(level.id)}
        className="w-full justify-start p-3 pl-8 h-auto hover:bg-green-50/50"
      >
        <div className="flex items-center gap-3 w-full">
          {isExpanded ? (
            <ChevronDown className="w-3 h-3 text-gray-400" />
          ) : (
            <ChevronRight className="w-3 h-3 text-gray-400" />
          )}
          <BookOpen className="w-4 h-4 text-green-600" />
          <div className="flex-1 text-left">
            <div className="font-medium text-sm text-gray-700">{level.name}</div>
            <div className="text-xs text-gray-500">{level.description}</div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {level.skills.length}
          </Badge>
        </div>
      </Button>

      {isExpanded && (
        <div className="bg-white/20">
          {level.skills.map((skill) => (
            <div key={skill.id} className="border-b border-gray-100 last:border-b-0">
              <Button
                variant="ghost"
                onClick={() => onToggleSkill(skill.id)}
                className="w-full justify-start p-3 pl-12 h-auto hover:bg-purple-50/50"
              >
                <div className="flex items-center gap-3 w-full">
                  {expandedSkills.has(skill.id) ? (
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                  )}
                  <Target className="w-4 h-4 text-purple-600" />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm text-gray-700">{skill.name}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {skill.contents.length}
                  </Badge>
                </div>
              </Button>

              {expandedSkills.has(skill.id) && (
                <div className="bg-gray-50/50">
                  {skill.contents.map((content) => (
                    <Button
                      key={content.id}
                      variant="ghost"
                      className="w-full justify-start p-3 pl-16 h-auto hover:bg-orange-50/50 text-left"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-sm">{getContentIcon(content.type)}</span>
                        <FileText className="w-3 h-3 text-orange-600" />
                        <div className="flex-1">
                          <div className="text-sm text-gray-700 font-medium">
                            {content.title}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {content.type}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}