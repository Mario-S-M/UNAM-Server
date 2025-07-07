"use client";
import { useAccessibility } from "@/app/providers";
import { Tabs, Tab } from "@heroui/react";
import { AlignJustify } from "lucide-react";

export function LineSpacingToggle({
  size = "md",
  classNames = {},
}: {
  size?: "sm" | "md";
  classNames?: any;
}) {
  const { lineSpacing, setLineSpacing } = useAccessibility();

  const handleSpacingChange = (key: string) => {
    setLineSpacing(key as "normal" | "relaxed" | "loose");
  };

  return (
    <Tabs
      selectedKey={lineSpacing}
      onSelectionChange={(key) => handleSpacingChange(key as string)}
      variant="bordered"
      classNames={{
        tabList:
          size === "sm"
            ? "gap-1 w-full rounded p-0.5 bg-transparent"
            : "gap-2 w-full relative rounded-lg p-1 bg-transparent",
        cursor:
          size === "sm"
            ? "w-full bg-primary rounded shadow"
            : "w-full bg-primary rounded-lg shadow-md",
        tab:
          size === "sm"
            ? "flex-1 w-full h-7 rounded bg-transparent border-0 text-xs"
            : "flex-1 w-full h-10 rounded-lg bg-transparent border-0 text-base",
        ...classNames,
      }}
    >
      <Tab key="normal" title={<AlignJustify className="w-4 h-4 mr-1" />}>
        Normal
      </Tab>
      <Tab key="relaxed" title={<AlignJustify className="w-4 h-4 mr-1" />}>
        Relajado
      </Tab>
      <Tab key="loose" title={<AlignJustify className="w-4 h-4 mr-1" />}>
        Muy relajado
      </Tab>
    </Tabs>
  );
}
