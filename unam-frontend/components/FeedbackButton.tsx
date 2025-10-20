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
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FeedbackButtonProps {
  className?: string;
  variant?: "floating" | "inline";
}

const email = "eskani@enesmorelia.unam.mx";

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  className,
  variant = "floating",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  const buttonClasses = cn(
    variant === "floating" && [
      "fixed bottom-6 right-40 z-50",
      "h-14 w-14 rounded-full",
      "border-2",
    ],
    variant === "inline" && ["h-10 w-10"],
    className
  );

  const button = (
    <Button
      onClick={handleClick}
      className={buttonClasses}
      size={variant === "floating" ? "icon" : "sm"}
      aria-label="Tu opinión nos importa"
    >
      <Mail className={variant === "floating" ? "h-40 w-40" : "h-36 w-36"} />
    </Button>
  );

  const tooltipButton =
    variant === "floating" ? (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="left">
            <p>Tu opinión nos importa</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : (
      button
    );

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Correo copiado");
    } catch {
      toast.error("No se pudo copiar el correo");
    }
  };

  return (
    <>
      {tooltipButton}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tu opinión nos importa</DialogTitle>
            <DialogDescription>Comunícate con nosotros</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Correo</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCopyEmail}>Copiar correo</Button>
              <Button variant="outline" asChild>
                <a href={`mailto:${email}`}>Abrir correo</a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { FeedbackButton };
export default FeedbackButton;