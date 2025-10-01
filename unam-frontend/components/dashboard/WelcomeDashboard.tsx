'use client';

export function WelcomeDashboard() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-medium text-foreground opacity-100">
            Bienvenido a
          </h2>
          <h1 
          className="text-5xl font-bold text-center opacity-100" 
          style={{
            fontSize: 'clamp(2rem, 8vw, 4rem)',
            lineHeight: '1.2',
            minHeight: '2rem'
          }}
        >
          Éskani
        </h1>
        </div>
      </div>
    </div>
  );
}