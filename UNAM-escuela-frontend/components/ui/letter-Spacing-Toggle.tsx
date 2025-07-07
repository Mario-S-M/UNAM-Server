"use client";
import { useAccessibility } from "@/app/providers";
import { useEffect } from "react";
import { ArrowRightLeft } from "lucide-react";
import { Tabs, Tab } from "@heroui/react";

export function LetterSpacingToggle({
  size = "md",
  classNames = {},
}: {
  size?: "sm" | "md";
  classNames?: any;
}) {
  const { letterSpacing, setLetterSpacing } = useAccessibility();

  const handleSpacingChange = (key: string) => {
    setLetterSpacing(key as "normal" | "wide" | "wider");
  };

  return (
    <Tabs
      selectedKey={letterSpacing}
      onSelectionChange={(key) => handleSpacingChange(key as string)}
      variant="bordered"
      classNames={{
        tabList:
          size === "sm"
            ? "gap-1 w-full rounded p-0.5 bg-transparent flex"
            : "gap-2 w-full relative rounded-lg p-1 bg-transparent flex",
        cursor:
          size === "sm"
            ? "w-full bg-primary rounded shadow"
            : "w-full bg-primary rounded-lg shadow-md",
        tab:
          size === "sm"
            ? "flex-1 w-full px-2 h-7 rounded bg-transparent border-0 text-xs"
            : "flex-1 w-full px-4 h-10 rounded-lg bg-transparent border-0",
        tabContent:
          size === "sm"
            ? "group-data-[selected=true]:text-primary-foreground group-data-[selected=false]:text-foreground opacity-80"
            : "group-data-[selected=true]:text-primary-foreground group-data-[selected=false]:text-foreground opacity-70",
        ...classNames,
      }}
    >
      <Tab
        key="normal"
        title={
          <div className="flex items-center space-x-2">
            <ArrowRightLeft size={18} />
            <span>Pequeño</span>
          </div>
        }
      />
      <Tab
        key="wide"
        title={
          <div className="flex items-center space-x-2">
            <ArrowRightLeft size={18} />
            <span>Normal</span>
          </div>
        }
      />
      <Tab
        key="wider"
        title={
          <div className="flex items-center space-x-2">
            <ArrowRightLeft size={18} />
            <span>Grande</span>
          </div>
        }
      />
    </Tabs>
  );
}
