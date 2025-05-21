"use client";
import { useState, useEffect } from "react";
import { Tabs, Tab } from "@heroui/react";
import {
  AlignJustify,
  ArrowDownWideNarrow,
  ArrowDownSquare,
} from "lucide-react";

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

  const handleSpacingChange = (key: SpacingType): void => {
    setSelected(key);
    applyLineSpacing(key);
  };

  // Ejemplos visuales para las pestañas
  const getSpacingExample = (type: SpacingType): { lineHeight: string } => {
    switch (type) {
      case "normal":
        return { lineHeight: "1.5" };
      case "increased":
        return { lineHeight: "1.8" };
      case "large":
        return { lineHeight: "2.2" };
      default:
        return { lineHeight: "1.5" };
    }
  };

  return (
    <div className="line-spacing-toggle">
      <Tabs
        aria-label="Opciones de espaciado entre líneas"
        color="primary"
        variant="bordered"
        selectedKey={selected}
        onSelectionChange={(key) =>
          handleSpacingChange(key.toString() as SpacingType)
        }
      >
        <Tab
          key="normal"
          title={
            <div className="flex items-center space-x-2 hover:!text-inherit">
              <AlignJustify />
              <span style={getSpacingExample("normal")}>Normal</span>
            </div>
          }
        />
        <Tab
          key="increased"
          title={
            <div className="flex items-center space-x-2 hover:!text-inherit">
              <ArrowDownWideNarrow />
              <span style={getSpacingExample("increased")}>Ampliado</span>
            </div>
          }
        />
        <Tab
          key="large"
          title={
            <div className="flex items-center space-x-2 hover:!text-inherit">
              <ArrowDownSquare />
              <span style={getSpacingExample("large")}>Grande</span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
