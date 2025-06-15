"use client";
import { useState, useEffect } from "react";
import { ArrowRightLeft } from "lucide-react";
import { Tabs, Tab } from "@heroui/react";

export function LetterSpacingToggle() {
  const [selected, setSelected] = useState("normal");

  useEffect(() => {
    // Recuperar la preferencia guardada si existe
    const savedSpacing = localStorage.getItem("letter-spacing") || "normal";
    setSelected(savedSpacing);

    // Aplicar el espaciado guardado al cargar la página
    applyLetterSpacing(savedSpacing);
  }, []);

  const applyLetterSpacing = (spacing: string) => {
    // Determinar el valor de letter-spacing según la opción seleccionada
    let spacingValue = "normal";
    if (spacing === "wide") spacingValue = "0.1em";
    if (spacing === "wider") spacingValue = "0.2em";

    // Crear o actualizar el elemento de estilo
    let styleElement = document.getElementById("letter-spacing-style");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "letter-spacing-style";
      document.head.appendChild(styleElement);
    }

    // Aplicar el estilo a todos los elementos de texto
    styleElement.textContent = `
      body, p, span, h1, h2, h3, h4, h5, h6, div, a, button, input, textarea, li, ul, ol {
        letter-spacing: ${spacingValue} !important;
      }
    `;

    // Guardar la preferencia en localStorage
    localStorage.setItem("letter-spacing", spacing);
  };

  const handleSpacingChange = (key: string) => {
    setSelected(key);
    applyLetterSpacing(key);
  };

  return (
    <Tabs
      selectedKey={selected}
      onSelectionChange={(key) => handleSpacingChange(key as string)}
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
