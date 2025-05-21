"use client";
import { Switch } from "@heroui/react";
import { useState, useEffect } from "react";
import { TextIcon, FileTextIcon } from "lucide-react";

export function DyslexiaFontToggle() {
  const [dyslexiaFontEnabled, setDyslexiaFontEnabled] =
    useState<boolean>(false);

  useEffect(() => {
    // Recuperar la preferencia guardada
    const savedPreference = localStorage.getItem("dyslexia-font");
    if (savedPreference === "true") {
      setDyslexiaFontEnabled(true);
      applyDyslexiaFont(true);
    }
  }, []);

  const applyDyslexiaFont = (enable: boolean): void => {
    // Crear o actualizar el elemento de estilo
    let styleElement = document.getElementById("dyslexia-font-style");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "dyslexia-font-style";
      document.head.appendChild(styleElement);
    }

    if (enable) {
      // Aplicar la fuente para dislexia y sus características
      styleElement.textContent = `
        body, p, span, h1, h2, h3, h4, h5, h6, div, a, button, input, textarea, li, ul, ol {
          font-family: 'OpenDyslexic', 'Comic Sans MS', sans-serif !important;
          letter-spacing: 0.05em !important;
          word-spacing: 0.1em !important;
          line-height: 1.5 !important;
          font-weight: normal !important;
        }
        
        /* Cargar la fuente OpenDyslexic si el usuario no la tiene instalada */
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('https://cdn.jsdelivr.net/npm/font-open-dyslexic@1.0.3/fonts/OpenDyslexic-Regular.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
        }
        
        /* Mejorar la legibilidad del texto */
        p, li {
          max-width: 70ch !important;
          text-align: left !important;
        }
        
        /* Evitar que el texto sea demasiado pequeño */
        body {
          font-size: 1.05rem !important;
        }
      `;
    } else {
      // Restaurar fuentes originales
      styleElement.textContent = "";
    }

    // Guardar preferencia
    localStorage.setItem("dyslexia-font", enable.toString());
  };

  const handleToggle = (isSelected: boolean): void => {
    setDyslexiaFontEnabled(isSelected);
    applyDyslexiaFont(isSelected);
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        color="primary"
        size="lg"
        isSelected={dyslexiaFontEnabled}
        onValueChange={handleToggle}
        thumbIcon={({
          isSelected,
          className,
        }: {
          isSelected: boolean;
          className: string;
        }) =>
          isSelected ? (
            <FileTextIcon className={className} size={16} />
          ) : (
            <TextIcon className={className} size={16} />
          )
        }
      >
        <span className="ml-2">Texto para dislexia</span>
      </Switch>
    </div>
  );
}
