"use client";
import { useState, useEffect } from "react";
import { Tabs, Tab } from "@heroui/react";
import { ArrowRightLeft } from "lucide-react";

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
    
    console.log("Espaciado aplicado:", spacing, "con valor:", spacingValue);
  };

  const handleSpacingChange = (key: string) => {
    setSelected(key);
    applyLetterSpacing(key);
  };

  // Estilos de muestra para los textos de las pestañas
  const getSpacingStyle = (type: string) => {
    switch(type) {
      case "normal": return { letterSpacing: "normal" };
      case "wide": return { letterSpacing: "0.1em" };
      case "wider": return { letterSpacing: "0.2em" };
      default: return { letterSpacing: "normal" };
    }
  };

  return (
    <div className="letter-spacing-toggle">
      <Tabs
        aria-label="Opciones de espaciado entre letras"
        color="primary"
        variant="bordered"
        selectedKey={selected}
        onSelectionChange={(key) => handleSpacingChange(key.toString())}
      >
        <Tab
          key="normal"
          title={
            <div className="flex items-center hover:!text-inherit">
              <ArrowRightLeft />
              <span style={getSpacingStyle("normal")}>Pequeño</span>
            </div>
          }
        />
        <Tab
          key="wide"
          title={
            <div className="flex items-center hover:!text-inherit">
              
              <ArrowRightLeft />
              <span style={getSpacingStyle("wide")}>Normal</span>
            </div>
          }
        />
        <Tab
          key="wider"
          title={
            <div className="flex items-center hover:!text-inherit">
              <ArrowRightLeft />
              <span style={getSpacingStyle("wider")}>Grande</span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}