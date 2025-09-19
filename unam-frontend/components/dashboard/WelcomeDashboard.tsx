'use client';

export function WelcomeDashboard() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">
          Bienvenido a la página Éskani
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Tu plataforma de aprendizaje de idiomas. Explora contenido educativo, 
          desarrolla nuevas habilidades y alcanza tus objetivos de aprendizaje.
        </p>
      </div>
    </div>
  );
}