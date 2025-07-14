"use client";

import React from "react";
import { RouteGuard } from "@/components/auth/route-guard";
import dynamic from "next/dynamic";

// Importar Milkdown de forma dinámica para evitar SSR issues
const MilkdownEditorClientFixed = dynamic(
  () => import("@/components/global/milkdown-editor-client-fixed"),
  { ssr: false }
);

export default function CleanSingleEditorPage() {
  return (
    <RouteGuard requiredPage="/main/teacher">
      <CleanSingleEditorContent />
    </RouteGuard>
  );
}

function CleanSingleEditorContent() {
  const testContent = `# ✅ Editor Único - Sin Duplicaciones

## 🎯 Objetivo
Esta página tiene exactamente UN editor, sin duplicaciones.

## 📝 Instrucciones
1. Edita este contenido
2. Verifica que solo hay un cursor
3. El auto-guardado debería funcionar normalmente
4. No deberías ver contenido duplicado

## 🔧 Características
- Editor único garantizado
- Auto-guardado funcional
- Sin conflictos de instancia
- Limpieza completa al desmontar

---
*Editor único verificado*
`;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header simple */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            ✅ Editor Único - Sin Duplicaciones
          </h1>
          <p className="text-gray-600">
            Esta página garantiza que solo hay un editor activo
          </p>
        </div>

        {/* Editor único */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="h-[600px]">
            <MilkdownEditorClientFixed
              defaultValue={testContent}
              contentId="clean-single-editor"
              onSave={async (content: string) => {
                
              }}
            />
          </div>
        </div>

        {/* Footer de verificación */}
        <div className="mt-6 text-center">
          <div className="inline-block bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-800 font-semibold mb-2">
              ✅ Editor Único Confirmado
            </div>
            <div className="text-sm text-green-600">
              Si ves este mensaje y solo hay un cursor en el editor de arriba,
              el problema de duplicación está resuelto.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
