"use client";

import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentItem } from "./ContentItem";
import { SidebarSkill } from "./types";

interface SkillItemProps {
  skill: SidebarSkill;
  isExpanded: boolean;
  onToggle: (skillId: string) => void;
}

export function SkillItem({ skill, isExpanded, onToggle }: SkillItemProps) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <Button
        variant="ghost"
        onClick={() => onToggle(skill.id)}
        className="w-full justify-start p-3 pl-12 h-auto hover:bg-purple-50/50"
      >
        <div className="flex items-center gap-3 w-full">
          <Target className="w-4 h-4 text-purple-600" />
          <div className="flex-1 text-left">
            <div className="font-medium text-sm text-gray-700">{skill.name}</div>
          </div>
          <Badge variant="outline" className="text-xs">
            {skill.contents.length}
          </Badge>
        </div>
      </Button>

      {isExpanded && (
        <div className="bg-gray-50/50">
          {skill.contents.length > 0 ? (
            skill.contents.map((content) => (
              <ContentItem key={content.id} content={content} />
            ))
          ) : (
            <div className="p-3 pl-16 text-xs text-gray-500 italic">
              No hay contenidos disponibles para esta skill
            </div>
          )}
        </div>
      )}
    </div>
  );
}