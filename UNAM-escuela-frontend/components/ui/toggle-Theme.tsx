"use client";
import { useState, useEffect } from "react";
import { Tabs, Tab } from "@heroui/react";
import { Contrast, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ToogleTheme() {
  const [, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [selected, setSelected] = useState("unam-light-theme");

  // Efecto para asegurar que el componente está montado (evita problemas de SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sincroniza el estado seleccionado con el tema actual
  useEffect(() => {
    if (theme) {
      setSelected(theme);
    }
  }, [theme]);

  const handleThemeChange = (key: string) => {
    setSelected(key);
    setTheme(key);
    
    // Forzar actualización del DOM (opcional, en algunos casos ayuda)
    document.documentElement.style.setProperty('color-scheme', key.includes('dark') ? 'dark' : 'light');
  };

  return (
    <Tabs
      aria-label="Opciones de tema"
      color="primary"
      variant="bordered"
      selectedKey={selected}
      onSelectionChange={(key) => handleThemeChange(key.toString())}
      className="p-2 rounded-lg shadow-soft transition-all duration-300 ease-in-out"
    >
      <Tab
        key="unam-light-theme"
        title={
          <div className="flex rounded-md transition-all duration-200">
            <Sun className="w-5 h-5" aria-label="Tema claro" />
            <span>Claro</span>
          </div>
        }
      />
      <Tab
        key="unam-dark-theme"
        title={
          <div className="flex rounded-md transition-all duration-200">
            <Moon className="w-5 h-5" aria-label="Tema oscuro" />
            <span>Oscuro</span>
          </div>
        }
      />
      <Tab
        key="contraste"
        title={
          <div className="flex rounded-md transition-all duration-200">
            <Contrast className="w-5 h-5" aria-label="Tema de alto contraste" />
            <span>Contraste</span>
          </div>
        }
      />
    </Tabs>
  );
}