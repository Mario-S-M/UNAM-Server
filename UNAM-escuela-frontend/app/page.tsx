import { LanguagesList } from "@/components/languages/LanguagesList";
import { ServerHeader } from "@/components/layout/server-header";

// Hacer la página dinámica
export const dynamic = "force-dynamic";

const HomePage = () => {
  return (
    <>
      <div className="min-h-screen px-4 py-8 md:px-8 lg:px-16">
        <ServerHeader />
        <div className="flex flex-col justify-center items-center space-y-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 text-foreground">
              Bienvenido
            </h1>
            <p className="text-base md:text-lg mb-4 md:mb-6 text-foreground">
              Plataforma de aprendizaje totalmente accesible
            </p>
            <p className="text-sm md:text-base text-default-600">
              Inicia sesión o crea una cuenta para acceder a todos los
              contenidos
            </p>
          </div>

          {/* Lista de Idiomas */}
          <div className="w-full max-w-6xl">
            <h2 className="text-xl md:text-2xl font-semibold text-center mb-6 text-foreground">
              Idiomas
            </h2>
            <LanguagesList />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
