import React from "react";
import { WelcomeSectionProps } from "@/app/interfaces/home-interfaces";

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  title,
  subtitle,
  description,
}) => (
  <div className="text-center">
    <h1 className="font-bold mb-2 md:mb-4 text-foreground">{title}</h1>
    <p className="mb-4 md:mb-6 text-foreground">{subtitle}</p>
    <p className="text-default-600">{description}</p>
  </div>
);
