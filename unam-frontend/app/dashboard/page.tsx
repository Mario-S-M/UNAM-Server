'use client';

import React from 'react';

export default function DashboardPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">¡Bienvenido!</h1>
        <p className="text-gray-600 text-lg">
          Selecciona un idioma del panel lateral para comenzar tu aprendizaje.
        </p>
      </div>
    </div>
  );
}