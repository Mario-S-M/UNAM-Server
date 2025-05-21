import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function LevelLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col mt-4">
      <header
        className="p-2"
      >
        <h1 className="text-2xl font-bold">Niveles de Aprendizaje</h1>
      </header>

      <main className="flex-grow container mx-auto px-2 py-4">{children}</main>
    </div>
  );
}
