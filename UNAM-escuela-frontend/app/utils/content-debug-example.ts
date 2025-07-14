// Ejemplo de uso del ContentDebugger
import { ContentDebugger, useContentDebugger } from "./content-debug";

/**
 * Ejemplo de uso directo del ContentDebugger
 */
export async function exampleUsage() {
  // Ejemplo 1: Diagnosticar un contenido específico
  const contentId = "550e8400-e29b-41d4-a716-446655440000"; // UUID de ejemplo

  console.log("🔍 Ejecutando diagnóstico de contenido...");
  const diagnostic = await ContentDebugger.diagnoseContent(contentId);

  // Log del diagnóstico
  ContentDebugger.logDiagnostic(diagnostic);

  // Obtener reporte formateado
  const report = ContentDebugger.formatDiagnosticReport(diagnostic);
  console.log(report);

  // Ejemplo 2: Obtener información de autenticación
  console.log("🔍 Verificando información de autenticación...");
  const authInfo = ContentDebugger.getAuthInfo();
  console.table(authInfo.cookieDetails);
  console.log("Token válido:", authInfo.isValid);
  console.log("Usuario logueado:", authInfo.isLoggedIn);

  return diagnostic;
}

/**
 * Ejemplo de uso en un componente React (para copiar/pegar)
 */
export const ReactComponentExample = `
import { useContentDebugger } from "@/app/utils/content-debug";

function MyContentComponent({ contentId }: { contentId: string }) {
  const { diagnoseContent, logError } = useContentDebugger();
  
  const handleDiagnose = async () => {
    try {
      const diagnostic = await diagnoseContent(contentId);
      
      if (!diagnostic.checks.serverReachable) {
        alert("El servidor no está disponible");
      } else if (!diagnostic.checks.hasPermissions) {
        alert("Problema de autenticación. Intenta iniciar sesión nuevamente.");
      } else if (!diagnostic.checks.idFormat) {
        alert("El ID del contenido no es válido");
      }
    } catch (error) {
      logError(error, "Diagnóstico de contenido");
    }
  };
  
  return (
    <button onClick={handleDiagnose}>
      🔍 Diagnosticar Contenido
    </button>
  );
}
`;

/**
 * Función de utilidad para debugging rápido en consola del navegador
 * Ejecutar: window.debugContent('tu-content-id-aqui')
 */
export function setupGlobalDebugger() {
  if (typeof window !== "undefined") {
    (window as any).debugContent = async (contentId: string) => {
      const diagnostic = await ContentDebugger.diagnoseContent(contentId);
      ContentDebugger.logDiagnostic(diagnostic);
      console.log("\n" + ContentDebugger.formatDiagnosticReport(diagnostic));
      return diagnostic;
    };

    (window as any).debugAuth = () => {
      const authInfo = ContentDebugger.getAuthInfo();
      console.table(authInfo);
      return authInfo;
    };

    console.log("🔧 Debug functions available:");
    console.log("- window.debugContent('content-id') - Diagnosticar contenido");
    console.log("- window.debugAuth() - Verificar autenticación");
  }
}
