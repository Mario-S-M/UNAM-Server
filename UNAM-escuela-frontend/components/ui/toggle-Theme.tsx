"use client";
import { useState, useEffect } from "react";
import { Tabs, Tab } from "@heroui/react";
import { Contrast, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ToogleTheme({
  size = "md",
  classNames = {},
}: {
  size?: "sm" | "md";
  classNames?: any;
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Efecto para asegurar que el componente está montado (evita problemas de SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (key: string) => {
    setTheme(key);
  };

  if (!mounted) return null; // Evitar hydration mismatch

  return (
    <Tabs
      aria-label="Opciones de tema"
      color="primary"
      variant="bordered"
      selectedKey={theme || "unam-light-theme"}
      onSelectionChange={(key) => handleThemeChange(key.toString())}
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
            ? "max-w-fit px-2 h-7 rounded bg-transparent border-0 text-xs"
            : "max-w-fit px-4 h-10 rounded-lg bg-transparent border-0",
        tabContent:
          size === "sm"
            ? "group-data-[selected=true]:text-primary-foreground group-data-[selected=false]:text-foreground opacity-80"
            : "group-data-[selected=true]:text-primary-foreground group-data-[selected=false]:text-foreground opacity-70",
        ...classNames,
      }}
    >
      <Tab
        key="unam-light-theme"
        title={
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5" aria-label="Tema claro" />
            <span>Claro</span>
          </div>
        }
      />
      <Tab
        key="unam-dark-theme"
        title={
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5" aria-label="Tema oscuro" />
            <span>Oscuro</span>
          </div>
        }
      />
      <Tab
        key="contraste"
        title={
          <div className="flex items-center gap-2">
            <Contrast className="w-5 h-5" aria-label="Tema de alto contraste" />
            <span>Contraste</span>
          </div>
        }
      />
    </Tabs>
  );
}
