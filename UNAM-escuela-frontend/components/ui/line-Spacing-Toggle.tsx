"use client";
import { useState, useEffect } from "react";
import {
  AlignJustify,
  ArrowDownWideNarrow,
  ArrowDownSquare,
} from "lucide-react";
import { Tabs, Tab } from "@heroui/react";

type SpacingType = "normal" | "increased" | "large";

export function LineSpacingToggle() {
  const [selected, setSelected] = useState<SpacingType>("normal");

  useEffect(() => {
    // Recuperar la preferencia guardada si existe
    const savedSpacing = localStorage.getItem("line-spacing") || "normal";
    setSelected(savedSpacing as SpacingType);

    // Aplicar el espaciado guardado al cargar la página
    applyLineSpacing(savedSpacing as SpacingType);
  }, []);

  const applyLineSpacing = (spacing: SpacingType): void => {
    // Crear o actualizar el elemento de estilo
    let styleElement = document.getElementById("line-spacing-style");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "line-spacing-style";
      document.head.appendChild(styleElement);
    }

    // Definir los valores de spacing para cada opción
    let lineHeightValue;
    switch (spacing) {
      case "normal":
        lineHeightValue = "1.5";
        break;
      case "increased":
        lineHeightValue = "1.8";
        break;
      case "large":
        lineHeightValue = "2.2";
        break;
      default:
        lineHeightValue = "1.5";
    }

    // Aplicar el estilo a los elementos de texto
    styleElement.textContent = `
      p, span, div, li, td, th, input, textarea, blockquote, h1, h2, h3, h4, h5, h6, a, button {
        line-height: ${lineHeightValue} !important;
      }
    `;

    // Guardar la preferencia
    localStorage.setItem("line-spacing", spacing);

    console.log(
      "Espaciado entre líneas aplicado:",
      spacing,
      "con valor:",
      lineHeightValue
    );
  };

  const handleSpacingChange = (key: string): void => {
    const spacing = key as SpacingType;
    setSelected(spacing);
    applyLineSpacing(spacing);
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
            <AlignJustify size={18} />
            <span>Normal</span>
          </div>
        }
      />
      <Tab
        key="increased"
        title={
          <div className="flex items-center space-x-2">
            <ArrowDownWideNarrow size={18} />
            <span>Ampliado</span>
          </div>
        }
      />
      <Tab
        key="large"
        title={
          <div className="flex items-center space-x-2">
            <ArrowDownSquare size={18} />
            <span>Grande</span>
          </div>
        }
      />
    </Tabs>
  );
}
