/**
 * Utilidad para probar el sistema de diagnóstico y repara  static async quickConnectivityTest(): Promise<boolean> {
    try {
      const response = await fetch('/graphql', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: '{ __typename }'
        })
      });
      return response.ok;
    } catch (error) {
      console.warn("⚠️ Prueba de conectividad falló:", error);
      return false;
    }
  }ores
 */

import { ContentDebugger } from "./content-debug";

export class SystemTest {
  /**
   * Ejecuta una prueba completa del sistema de diagnóstico
   */
  static async runCompleteTest(contentId: string): Promise<{
    success: boolean;
    results: any;
    recommendations: string[];
  }> {
    console.log("🧪 Iniciando prueba completa del sistema...");

    try {
      // 1. Probar diagnóstico de contenido
      console.log("1️⃣ Probando diagnóstico de contenido...");
      const diagnostic = await ContentDebugger.diagnoseContent(contentId);

      // 2. Probar información de autenticación
      console.log("2️⃣ Probando información de autenticación...");
      const authInfo = ContentDebugger.getAuthInfo();

      // 3. Generar reporte
      console.log("3️⃣ Generando reporte...");
      const report = ContentDebugger.formatDiagnosticReport(diagnostic);

      // 4. Evaluar el estado general
      const success =
        diagnostic.checks.idFormat && diagnostic.checks.serverReachable;

      const results = {
        diagnostic,
        authInfo,
        report,
        timestamp: new Date().toISOString(),
      };

      const recommendations = [
        ...(diagnostic.recommendations || []),
        ...(authInfo.hasToken ? [] : ["Falta token de autenticación"]),
        ...(authInfo.isValid ? [] : ["Token de autenticación inválido"]),
      ];

      console.log("✅ Prueba completa finalizada");
      return { success, results, recommendations };
    } catch (error: any) {
      console.error("❌ Error en la prueba completa:", error);
      return {
        success: false,
        results: { error: error?.message || String(error) },
        recommendations: ["Error en el sistema de diagnóstico"],
      };
    }
  }

  /**
   * Prueba rápida de conectividad
   */
  static async quickConnectivityTest(): Promise<boolean> {
    try {
      const response = await fetch("/api/health", {
        method: "HEAD",
      });
      return response.ok;
    } catch (error) {
      console.warn("⚠️ Prueba de conectividad falló:", error);
      return false;
    }
  }

  /**
   * Verifica el estado de autenticación
   */
  static checkAuthenticationStatus(): {
    status: "valid" | "invalid" | "missing";
    details: any;
  } {
    const authInfo = ContentDebugger.getAuthInfo();

    if (!authInfo.hasToken) {
      return { status: "missing", details: authInfo };
    }

    if (!authInfo.isValid) {
      return { status: "invalid", details: authInfo };
    }

    return { status: "valid", details: authInfo };
  }

  /**
   * Ejecuta todas las pruebas y devuelve un resumen
   */
  static async runAllTests(contentId: string): Promise<{
    overallStatus: "healthy" | "issues" | "critical";
    tests: {
      connectivity: boolean;
      authentication: "valid" | "invalid" | "missing";
      contentDiagnostic: boolean;
    };
    summary: string;
  }> {
    console.log("🔬 Ejecutando todas las pruebas del sistema...");

    // Prueba de conectividad
    const connectivity = await this.quickConnectivityTest();

    // Prueba de autenticación
    const auth = this.checkAuthenticationStatus();

    // Prueba de diagnóstico de contenido
    let contentDiagnostic = false;
    try {
      const diagnostic = await ContentDebugger.diagnoseContent(contentId);
      contentDiagnostic = diagnostic.checks.idFormat;
    } catch (error) {
      console.warn("Diagnóstico de contenido falló:", error);
    }

    const tests = {
      connectivity,
      authentication: auth.status,
      contentDiagnostic,
    };

    // Determinar estado general
    let overallStatus: "healthy" | "issues" | "critical";
    let summary: string;

    if (connectivity && auth.status === "valid" && contentDiagnostic) {
      overallStatus = "healthy";
      summary = "Sistema funcionando correctamente ✅";
    } else if (connectivity && contentDiagnostic) {
      overallStatus = "issues";
      summary =
        "Sistema con problemas menores (principalmente autenticación) ⚠️";
    } else {
      overallStatus = "critical";
      summary = "Sistema con problemas críticos ❌";
    }

    console.log(`📊 Estado general del sistema: ${overallStatus}`);
    console.log(`📝 Resumen: ${summary}`);

    return { overallStatus, tests, summary };
  }
}
