"use client";
import { Switch } from "@heroui/react";
import { useState, useEffect } from "react";
import { ImageIcon, ImageOffIcon } from "lucide-react";

export function HideImagesToggle() {
  const [hideImages, setHideImages] = useState(false);

  useEffect(() => {
    // Recuperar la preferencia guardada
    const savedPreference = localStorage.getItem("hide-images");
    if (savedPreference) {
      setHideImages(savedPreference === "true");
      if (savedPreference === "true") {
        applyImageVisibility(true);
      }
    }
  }, []);

  const applyImageVisibility = (hide: boolean): void => {
    // Crear o actualizar el elemento de estilo
    let styleElement = document.getElementById("image-visibility-style");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "image-visibility-style";
      document.head.appendChild(styleElement);
    }

    if (hide) {
      // Ocultar todas las imágenes
      styleElement.textContent = `
        img, svg:not(.lucide), picture, video, canvas, figure {
          opacity: 0 !important;
          visibility: hidden !important;
          position: relative !important;
        }
        
        img:after, picture:after, figure:after {
          content: "Imagen oculta" !important;
          display: inline-block !important;
          background-color: #f0f0f0 !important;
          border: 1px dashed #ccc !important;
          padding: 0.5rem !important;
          text-align: center !important;
          color: #666 !important;
          font-style: italic !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }
      `;
    } else {
      // Mostrar todas las imágenes
      styleElement.textContent = "";
    }

    // Guardar preferencia
    localStorage.setItem("hide-images", hide.toString());
  };

  const handleToggle = (isSelected: boolean): void => {
    setHideImages(isSelected);
    applyImageVisibility(isSelected);
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        color="primary"
        size="lg"
        isSelected={hideImages}
        onValueChange={handleToggle}
        thumbIcon={({
          isSelected,
          className,
        }: {
          isSelected: boolean;
          className: string;
        }) =>
          isSelected ? (
            <ImageOffIcon className={className} size={16} />
          ) : (
            <ImageIcon className={className} size={16} />
          )
        }
      >
        <span className="ml-2">Ocultar imágenes</span>
      </Switch>
    </div>
  );
}
