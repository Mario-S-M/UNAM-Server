"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarContent } from "./types";

interface ContentItemProps {
  content: SidebarContent;
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

export function ContentItem({ content }: ContentItemProps) {
  return (
    <Button
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
  );
}