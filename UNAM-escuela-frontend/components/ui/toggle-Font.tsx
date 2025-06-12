"use client";
import React, { useState, useEffect } from "react";
import { Text } from "lucide-react";
import { Tabs, Tab } from "@heroui/react";

const GlobalFontSizeChanger: React.FC = () => {
  type FontSizeOption = "sm" | "base" | "lg";

  const [mounted, setMounted] = useState(false);
  const [fontSize, setFontSize] = useState<FontSizeOption>("sm");

  useEffect(() => {
    // Retrieve saved font size from localStorage
    const savedFontSize = localStorage.getItem(
      "globalFontSize"
    ) as FontSizeOption;

    // Ensure we have a valid font size
    const validFontSizes: FontSizeOption[] = ["sm", "base", "lg"];
    const initialFontSize = validFontSizes.includes(savedFontSize)
      ? savedFontSize
      : "base";

    setFontSize(initialFontSize);
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only apply styles after mounting to prevent SSR issues
    if (!mounted) return;

    const fontSizeMap = {
      sm: "16px",
      base: "20px",
      lg: "24px",
    };

    // Directly modify document root style
    document.documentElement.style.setProperty(
      "font-size",
      fontSizeMap[fontSize],
      "important"
    );

    // Save to localStorage
    localStorage.setItem("globalFontSize", fontSize);
  }, [fontSize, mounted]);

  // Prevent rendering before mounting to avoid hydration mismatches
  if (!mounted) {
    return null;
  }

  const handleFontSizeChange = (key: string) => {
    const newFontSize = key as FontSizeOption;
    setFontSize(newFontSize);
  };

  return (
    <Tabs
      selectedKey={fontSize}
      onSelectionChange={(key) => handleFontSizeChange(key as string)}
      variant="bordered"
      classNames={{
        tabList: "gap-2 w-full relative rounded-lg p-1 bg-transparent",
        cursor: "w-full bg-primary rounded-lg shadow-md",
        tab: "max-w-fit px-4 h-10 rounded-lg bg-transparent border-0",
        tabContent:
          "group-data-[selected=true]:text-primary-foreground group-data-[selected=false]:text-foreground opacity-70",
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
