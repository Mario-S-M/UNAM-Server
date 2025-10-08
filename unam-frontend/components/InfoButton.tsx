"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoButtonProps {
  className?: string;
  variant?: "floating" | "inline";
}

const InfoButton: React.FC<InfoButtonProps> = ({
  className,
  variant = "floating",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  const buttonClasses = cn(
    variant === "floating" && [
      "fixed bottom-6 right-24 z-50",
      "h-14 w-14 rounded-full shadow-lg",
      "bg-blue-600 text-white",
      "hover:bg-blue-700 hover:shadow-xl",
      "transition-all duration-200",
      "border-2 border-background",
    ],
    variant === "inline" && ["h-10 w-10"],
    className
  );

  const button = (
    <Button
      onClick={handleClick}
      className={buttonClasses}
      size={variant === "floating" ? "icon" : "sm"}
      aria-label="Información de la UNAM"
    >
      <Info
          className={variant === "floating" ? "h-40 w-40" : "h-36 w-36"}
          size={160}
        />
    </Button>
  );

  const tooltipButton =
    variant === "floating" ? (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="left">
            <p>Información UNAM</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : (
      button
    );

  return (
    <>
      {tooltipButton}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 100 100"
                  className="text-blue-600"
                >
                  <rect width="100" height="100" fill="#003f7f" rx="8" />
                  <text
                    x="50"
                    y="35"
                    textAnchor="middle"
                    fill="#ffd700"
                    fontSize="24"
                    fontWeight="bold"
                    fontFamily="serif"
                  >
                    UNAM
                  </text>
                  <text
                    x="50"
                    y="55"
                    textAnchor="middle"
                    fill="#ffd700"
                    fontSize="8"
                    fontFamily="serif"
                  >
                    UNIVERSIDAD
                  </text>
                  <text
                    x="50"
                    y="65"
                    textAnchor="middle"
                    fill="#ffd700"
                    fontSize="8"
                    fontFamily="serif"
                  >
                    NACIONAL
                  </text>
                  <text
                    x="50"
                    y="75"
                    textAnchor="middle"
                    fill="#ffd700"
                    fontSize="8"
                    fontFamily="serif"
                  >
                    AUTÓNOMA
                  </text>
                  <text
                    x="50"
                    y="85"
                    textAnchor="middle"
                    fill="#ffd700"
                    fontSize="8"
                    fontFamily="serif"
                  >
                    DE MÉXICO
                  </text>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-600">
                  Escuela Nacional de Estudios Superiores Unidad Morelia
                </h2>
                <p className="text-sm text-muted-foreground">
                  ENES Morelia - UNAM
                </p>
              </div>
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              Información institucional y datos de contacto
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Información Institucional */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600">
                Nuestra Institución
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                La Escuela Nacional de Estudios Superiores Unidad Morelia (ENES
                Morelia) es una entidad académica multidisciplinaria de la
                Universidad Nacional Autónoma de México, dedicada a la formación
                de profesionales de excelencia, la investigación científica y la
                extensión universitaria en el estado de Michoacán.
              </p>
            </div>

            {/* Información del Proyecto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600">
                Acerca de este Proyecto
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Producto realizado con el apoyo del programa PAPIME PE405625
              </p>
            </div>

            {/* Datos de Contacto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-600">Contacto</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Dirección</p>
                    <p className="text-sm text-muted-foreground">
                      Antigua Carretera a Pátzcuaro No. 8701, Col. Ex Hacienda
                      de San José de la Huerta, 58190 Morelia, Michoacán
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Teléfono</p>
                    <p className="text-sm text-muted-foreground">
                      443 689 3500
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Correo Electrónico</p>
                    <p className="text-sm text-muted-foreground">
                      eskani@enesmorelia.unam.mx
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { InfoButton };
export default InfoButton;