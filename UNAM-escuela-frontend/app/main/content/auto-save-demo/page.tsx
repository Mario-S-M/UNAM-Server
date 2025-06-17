"use client";
import React from "react";
import type { FC } from "react";
import MilkdownEditorClient from "../../../../components/global/milkdown-editor-client";

// Demo content for testing auto-save
const demoMarkdown = `# Editor con Auto-Guardado 🔄

> Este editor guarda automáticamente cada 5 segundos

## ¿Cómo funciona?

Cuando habilitas el auto-guardado:

1. **Detección automática**: El editor detecta cuando escribes o modificas el contenido
2. **Guardado inteligente**: Solo guarda si hay cambios reales en el contenido
3. **Indicador visual**: Puedes ver el estado del guardado en tiempo real
4. **Guardado manual**: También puedes guardar manualmente cuando quieras

## Prueba el Auto-Guardado

Empieza a escribir aquí y observa cómo se guarda automáticamente:

### Mis notas:
- [ ] Escribir algo aquí
- [ ] Ver cómo se guarda automáticamente
- [ ] Probar el botón de guardado manual

## Tabla de ejemplo

| Función | Descripción | Estado |
|---------|-------------|--------|
| Auto-save | Guarda cada 5s | ✅ Activo |
| Guardado manual | Guarda inmediatamente | ✅ Disponible |
| Indicadores | Muestra estado | ✅ Visible |

---

> **Tip**: El auto-guardado usa debounce, así que no se activará mientras estés escribiendo activamente. Solo después de que pares de escribir por unos segundos.

¡Pruébalo escribiendo algo nuevo aquí! 📝`;

const AutoSaveDemoPage: FC = () => {
  // Simulamos un contentId para la demo (en producción vendría de los params)
  const demoContentId = "demo-content-123";

  const handleAutoSave = (success: boolean, content: string) => {
    if (success) {
      console.log("✅ Contenido guardado exitosamente");
    } else {
      console.error("❌ Error al guardar el contenido");
    }
  };

  const handleAutoSaveError = (error: string) => {
    console.error("🚨 Error en auto-guardado:", error);
    // En una app real, podrías mostrar una notificación al usuario
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Demo: Editor con Auto-Guardado
          </h1>
          <p className="text-default-500 text-lg mb-4">
            Este ejemplo muestra cómo usar el editor con auto-guardado
            habilitado
          </p>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                ⏰ Auto-Guardado
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Guarda automáticamente cada 5 segundos después de detectar
                cambios
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                💾 Guardado Manual
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Guarda inmediatamente con el botón "Guardar Ahora"
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                📊 Estado Visual
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Indicadores visuales del estado del guardado en tiempo real
              </p>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <MilkdownEditorClient
            defaultValue={demoMarkdown}
            downloadFileName="auto-save-demo.md"
            contentId={demoContentId} // Auto-guardado se activa automáticamente al proporcionar contentId
            autoSaveInterval={5000} // 5 segundos
            onAutoSave={handleAutoSave}
            onAutoSaveError={handleAutoSaveError}
          />
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            📝 Instrucciones para probar
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Empieza a escribir o editar el contenido arriba</li>
            <li>
              Observa el indicador de estado en la parte inferior del editor
            </li>
            <li>
              Espera 5 segundos después de parar de escribir para ver el
              auto-guardado
            </li>
            <li>Prueba el botón "Guardar Ahora" para guardado inmediato</li>
            <li>Abre la consola del navegador para ver los logs de guardado</li>
          </ol>

          <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg border border-yellow-300 dark:border-yellow-700">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Nota:</strong> En esta demo, el guardado simulará la
              llamada a la API. En un entorno real, el contenido se guardaría en
              la base de datos a través del backend GraphQL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoSaveDemoPage;
