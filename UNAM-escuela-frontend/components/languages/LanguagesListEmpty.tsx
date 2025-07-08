import React from "react";

export const LanguagesListEmpty: React.FC = () => (
  <div className="text-center py-24">
    <div className="max-w-sm mx-auto">
      <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-divider/50 shadow-sm">
        <span className="text-4xl">💻</span>
      </div>
      <h3 className="text-2xl font-light text-foreground mb-4">
        No hay idiomas disponibles
      </h3>
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-default-300 to-transparent mx-auto mb-6"></div>
      <p className="text-default-500 font-light text-lg">
        Próximamente tendremos nuevos idiomas para ti
      </p>
    </div>
  </div>
);
