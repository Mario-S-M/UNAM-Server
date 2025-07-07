"use client";
import React from "react";
import { Text } from "lucide-react";
import { Tabs, Tab } from "@heroui/react";
import { useAccessibility } from "@/app/providers";

const GlobalFontSizeChanger: React.FC<{
  size?: "sm" | "md";
  classNames?: any;
}> = ({ size = "md", classNames = {} }) => {
  const { fontSize, setFontSize } = useAccessibility();

  const handleFontSizeChange = (key: string) => {
    setFontSize(key as "sm" | "base" | "lg");
  };

  return (
    <Tabs
      selectedKey={fontSize}
      onSelectionChange={(key) => handleFontSizeChange(key as string)}
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
        key="sm"
        title={
          <div className="flex items-center space-x-2">
            <Text size={16} />
            <span>Pequeño</span>
          </div>
        }
      />
      <Tab
        key="base"
        title={
          <div className="flex items-center space-x-2">
            <Text size={20} />
            <span>Normal</span>
          </div>
        }
      />
      <Tab
        key="lg"
        title={
          <div className="flex items-center space-x-2">
            <Text size={24} />
            <span>Grande</span>
          </div>
        }
      />
    </Tabs>
  );
};

export default GlobalFontSizeChanger;
