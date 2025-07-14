import React from "react";
import Link from "next/link";
import { LanguageCardProps } from "@/app/interfaces/home-interfaces";

export const LanguageCard: React.FC<LanguageCardProps> = ({
  language,
  globalIndex,
}) => (
  <Link
    key={language.id}
    href={`/main/lenguages/${language.id}/view`}
    className="group block"
  >
    <div className="bg-background border border-divider rounded-2xl p-10 cursor-pointer hover:bg-content1/30 transition-all duration-300 group-hover:border-primary/30">
      <div className="flex justify-center mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-600 text-primary-foreground rounded-2xl flex items-center justify-center font-semibold text-lg group-hover:scale-110 transition-transform duration-300">
          {globalIndex}
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-foreground mb-6 leading-snug group transition-colors duration-300">
          {language.name}
        </h3>
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto mb-6"></div>
        <p className="text-default-500 leading-relaxed font-light text-base">
          Explora y domina {language.name}
        </p>
      </div>
      <div className="mt-8 pt-6 border-t border-divider/50">
        <div className="flex justify-center">
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-default-300 to-transparent"></div>
        </div>
      </div>
    </div>
  </Link>
);
