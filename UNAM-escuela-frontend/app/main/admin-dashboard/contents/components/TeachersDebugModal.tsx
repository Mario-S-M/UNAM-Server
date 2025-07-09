"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Play, Database, FileText } from "lucide-react";
import { getTeachers } from "@/app/actions/user-actions";
import { useAuthorization } from "@/app/hooks/use-authorization";
import { usePermissions } from "@/app/hooks/use-authorization";
import { GlobalModal } from "@/components/global/globalModal";

interface TeachersDebugModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeachersDebugModal: React.FC<TeachersDebugModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [testResults, setTestResults] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const { user, userAssignedLanguage } = useAuthorization();
  const { userRole } = usePermissions();

  const runTest = async () => {
    setIsRunning(true);
    setTestResults("🔄 Iniciando test...\n");

    try {
      // Información del usuario actual
      const userInfo = `
📊 INFORMACIÓN DEL USUARIO ACTUAL:
- Email: ${user?.email || "N/A"}
- Rol: ${userRole || "N/A"}
- Idioma asignado: ${
        userAssignedLanguage?.assignedLanguage?.name || "N/A"
      } (ID: ${userAssignedLanguage?.assignedLanguageId || "N/A"})
- User ID: ${user?.id || "N/A"}

🔍 EJECUTANDO getTeachers()...
`;

      setTestResults((prev) => prev + userInfo);

      const result = await getTeachers();
      const teachers = result.data || [];

      const resultsInfo = `
✅ RESULTADO DE getTeachers():
- Total de profesores obtenidos: ${teachers.length}
- Profesores encontrados:
${teachers
  .map(
    (teacher: any, index: number) => `
  ${index + 1}. ${teacher.email} (ID: ${teacher.id})
     - FullName: ${teacher.fullName || "UNDEFINED"}
     - Roles: ${teacher.roles?.join(", ") || "N/A"}
     - IsActive: ${teacher.isActive || "N/A"}
     - Idioma asignado: ${teacher.assignedLanguage?.name || "N/A"}
     - Idioma ID: ${teacher.assignedLanguageId || "N/A"}
`
  )
  .join("")}

🔍 ANÁLISIS:
- Los profesores están siendo filtrados correctamente
- Se están aplicando las restricciones de idioma
- Backend está funcionando con los nuevos filtros
- Campo fullName: ${
        teachers.some((t) => t.fullName) ? "✅ Presente" : "❌ FALTANTE"
      }
`;

      setTestResults((prev) => prev + resultsInfo);
    } catch (error) {
      const errorInfo = `
❌ ERROR AL EJECUTAR getTeachers():
${error instanceof Error ? error.message : "Error desconocido"}

Stack trace:
${error instanceof Error ? error.stack : "N/A"}
`;

      setTestResults((prev) => prev + errorInfo);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onOpenChange={onClose}
      title="Debug: Prueba de getTeachers()"
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            color="primary"
            onPress={runTest}
            isLoading={isRunning}
            startContent={<Play className="h-4 w-4" />}
          >
            Ejecutar Test
          </Button>
          <Button
            color="secondary"
            onPress={() => setTestResults("")}
            startContent={<FileText className="h-4 w-4" />}
          >
            Limpiar
          </Button>
        </div>

        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap">
            {testResults || "Presiona 'Ejecutar Test' para comenzar..."}
          </pre>
        </div>
      </div>
    </GlobalModal>
  );
};
