import React from "react";
import { Button } from "@heroui/react";
import { ArrowLeft, BookOpen } from "lucide-react";

interface SkillsHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
}

export const SkillsHeader: React.FC<SkillsHeaderProps> = ({
  title,
  subtitle,
  onBack,
}) => (
  <div className="flex items-center gap-4 mb-6">
    <Button variant="light" isIconOnly onPress={onBack} aria-label="Volver">
      <ArrowLeft className="h-5 w-5" />
    </Button>
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 p-2 rounded-lg">
        <BookOpen className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-foreground/60">{subtitle}</p>
      </div>
    </div>
  </div>
);
