import { LanguagesList } from "@/components/languages/LanguagesList";
import { ServerHeader } from "@/components/layout/server-header";

// Hacer la página dinámica
export const dynamic = "force-dynamic";

const HomePage = () => {
  return (
    <>
      <div className="min-h-screen px-4 py-8 md:px-8 lg:px-16">
        <ServerHeader />
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 text-center">
            Bienvenido a UNAM Inclusión
          </h1>
          <p className="text-base md:text-lg mb-4 md:mb-6 text-center">
            Plataforma de aprendizaje totalmente accesible
          </p>
          <div className="w-full max-w-6xl">
            <LanguagesList />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
