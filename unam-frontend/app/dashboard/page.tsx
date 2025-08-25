import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-50 border p-12 md:p-16 text-center">
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="h-8 w-8" />
              </div>
            </div>
            <Badge variant="secondary" className="px-4 py-2 mb-6">
              Bienvenido
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Bienvenido a Éskani
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
               Tu página para el aprendizaje de idiomas de manera eficiente y divertida.
             </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}