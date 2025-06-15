import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { RoleBadge } from "@/components/ui/role-badge";
import { User, CheckCircle } from "lucide-react";
import GlobalButton from "@/components/global/globalButton";
import Link from "next/link";
import { ServerHeader } from "@/components/layout/server-header";

// Hacer la página dinámica
export const dynamic = "force-dynamic";

const roleDescriptions = {
  superUser:
    "Tienes acceso completo al sistema. Puedes gestionar usuarios, contenido y todas las funcionalidades administrativas.",
  admin:
    "Puedes administrar contenido y usuarios dentro de tu área de responsabilidad.",
  docente:
    "Puedes crear y gestionar contenido educativo, niveles y actividades para tus estudiantes.",
  alumno:
    "Puedes acceder a todo el contenido educativo y realizar actividades de aprendizaje.",
  mortal: "Tienes acceso básico al contenido público de la plataforma.",
};

export default async function WelcomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const primaryRole =
    user.roles?.find((role: string) => role !== "mortal") || "mortal";
  const roleDescription =
    roleDescriptions[primaryRole as keyof typeof roleDescriptions] ||
    roleDescriptions.mortal;

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 lg:px-16">
      <ServerHeader />
      <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-primary">
                ¡Bienvenido a UNAM Inclusión!
              </h1>
            </div>
          </CardHeader>

          <CardBody className="text-center space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 rounded-full p-3">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {user.fullName}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>

              {user.roles &&
                user.roles.length > 0 &&
                !user.roles.every((role: string) => role === "mortal") && (
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-sm text-gray-600">
                      Tu rol en el sistema:
                    </span>
                    <RoleBadge roles={user.roles} />
                  </div>
                )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{roleDescription}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <GlobalButton
                  text="Ir al Inicio"
                  variant="bordered"
                  color="primary"
                />
              </Link>
              <Link href="/main/levels">
                <GlobalButton text="Explorar Contenido" color="primary" />
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
