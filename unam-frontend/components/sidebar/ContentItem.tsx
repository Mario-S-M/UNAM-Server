"use client";

import { FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarContent } from "./types";
import { useRouter } from "next/navigation";

interface ContentItemProps {
  content: SidebarContent;
}

function getContentIcon(type: string) {
  switch (type) {
    case "video":
      return "🎥";
    case "article":
      return "📄";

    default:
      return "📝";
  }
}

export function ContentItem({ content }: ContentItemProps) {
  const router = useRouter();

  const handleContentClick = () => {
    // Navegar al contenido específico
    router.push(`/dashboard/content/${content.id}`);
  };

  return (
    <Button
      variant="ghost"
      onClick={handleContentClick}
      className="w-full justify-start p-3 pl-16 h-auto hover:bg-orange-50/50 text-left"
    >
      <div className="flex items-center gap-3 w-full">
        <span className="text-sm">{getContentIcon(content.type)}</span>
        <FileText className="w-3 h-3 text-orange-600" />
        <div className="flex-1">
          <div className="text-sm text-gray-700 font-medium">
            {content.name}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {content.type}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {content.isCompleted && (
            <CheckCircle className="w-3 h-3 text-green-600" />
          )}
          <Badge variant="outline" className="text-xs">
            {content.validationStatus === 'APPROVED' ? 'Aprobado' : content.validationStatus}
          </Badge>
        </div>
      </div>
    </Button>
  );
}