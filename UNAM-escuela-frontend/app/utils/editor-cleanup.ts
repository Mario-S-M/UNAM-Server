// Utilidad para manejar editores duplicados
export function cleanupAllEditors() {
  console.log("🧹 Iniciando limpieza de todos los editores...");

  // Seleccionar todos los editores en el DOM
  const allEditorContainers = document.querySelectorAll("[data-editor-id]");
  const allMilkdownContainers = document.querySelectorAll(
    ".milkdown-container"
  );
  const allProseMirrorEditors = document.querySelectorAll(".ProseMirror");

  console.log(
    `📊 Encontrados: ${allEditorContainers.length} containers, ${allMilkdownContainers.length} milkdown, ${allProseMirrorEditors.length} ProseMirror`
  );

  let removedCount = 0;

  // Limpiar containers con data-editor-id duplicados
  const editorIds = new Set();
  allEditorContainers.forEach((container) => {
    const editorId = container.getAttribute("data-editor-id");
    if (editorIds.has(editorId)) {
      console.log(`🗑️ Removiendo editor duplicado: ${editorId}`);
      container.remove();
      removedCount++;
    } else {
      editorIds.add(editorId);
    }
  });

  // Limpiar containers milkdown huérfanos (sin padre con data-editor-id)
  allMilkdownContainers.forEach((container) => {
    const hasValidParent = container.closest("[data-editor-id]");
    if (!hasValidParent) {
      console.log("🗑️ Removiendo container milkdown huérfano");
      container.remove();
      removedCount++;
    }
  });

  // Limpiar editores ProseMirror duplicados dentro del mismo container
  const proseMirrorByContainer = new Map();
  allProseMirrorEditors.forEach((editor) => {
    const container = editor.closest("[data-editor-id]");
    if (container) {
      const containerId = container.getAttribute("data-editor-id");
      if (!proseMirrorByContainer.has(containerId)) {
        proseMirrorByContainer.set(containerId, []);
      }
      proseMirrorByContainer.get(containerId).push(editor);
    } else {
      // ProseMirror sin container válido - remover
      console.log("🗑️ Removiendo editor ProseMirror huérfano");
      editor.remove();
      removedCount++;
    }
  });

  // Remover ProseMirror duplicados dentro del mismo container
  proseMirrorByContainer.forEach((editors, containerId) => {
    if (editors.length > 1) {
      console.log(
        `🗑️ Encontrados ${editors.length} ProseMirror en container ${containerId}, removiendo duplicados`
      );
      // Mantener solo el primero, remover el resto
      for (let i = 1; i < editors.length; i++) {
        console.log(
          `🗑️ Removiendo ProseMirror duplicado #${
            i + 1
          } en container ${containerId}`
        );
        editors[i].remove();
        removedCount++;
      }
    }
  });

  console.log(`✅ Limpieza completada: ${removedCount} elementos removidos`);

  // Verificar estado final
  const finalEditorCount = document.querySelectorAll("[data-editor-id]").length;
  const finalMilkdownCount = document.querySelectorAll(
    ".milkdown-container"
  ).length;
  const finalProseMirrorCount =
    document.querySelectorAll(".ProseMirror").length;

  console.log(
    `📊 Estado final: ${finalEditorCount} containers, ${finalMilkdownCount} milkdown, ${finalProseMirrorCount} ProseMirror`
  );

  return {
    removed: removedCount,
    remaining: {
      containers: finalEditorCount,
      milkdown: finalMilkdownCount,
      prosemirror: finalProseMirrorCount,
    },
  };
}

// Función para forzar la limpieza y recargar la página si es necesario
export function forceCleanReload() {
  const result = cleanupAllEditors();

  if (result.remaining.containers > 1) {
    console.log("⚠️ Aún hay múltiples editores, recargando página...");
    window.location.reload();
  }

  return result;
}

// Función para verificar si hay duplicaciones
export function checkForDuplicates() {
  const containers = document.querySelectorAll("[data-editor-id]");
  const milkdown = document.querySelectorAll(".milkdown-container");
  const prosemirror = document.querySelectorAll(".ProseMirror");

  // Verificar duplicaciones más específicas
  const containerDuplicates = containers.length > 1;
  const milkdownDuplicates = milkdown.length > 1;

  // Para ProseMirror, verificar si hay más de uno por container
  const proseMirrorByContainer = new Map();
  prosemirror.forEach((editor) => {
    const container = editor.closest("[data-editor-id]");
    if (container) {
      const containerId = container.getAttribute("data-editor-id");
      if (!proseMirrorByContainer.has(containerId)) {
        proseMirrorByContainer.set(containerId, 0);
      }
      proseMirrorByContainer.set(
        containerId,
        proseMirrorByContainer.get(containerId) + 1
      );
    }
  });

  const proseMirrorDuplicates = Array.from(
    proseMirrorByContainer.values()
  ).some((count) => count > 1);
  const orphanedProseMirror =
    prosemirror.length -
    Array.from(proseMirrorByContainer.values()).reduce(
      (sum, count) => sum + count,
      0
    );

  const hasDuplicates =
    containerDuplicates ||
    milkdownDuplicates ||
    proseMirrorDuplicates ||
    orphanedProseMirror > 0;

  return {
    hasDuplicates,
    counts: {
      containers: containers.length,
      milkdown: milkdown.length,
      prosemirror: prosemirror.length,
    },
    details: {
      containerDuplicates,
      milkdownDuplicates,
      proseMirrorDuplicates,
      orphanedProseMirror,
      proseMirrorByContainer: Object.fromEntries(proseMirrorByContainer),
    },
  };
}

// Función específica para limpiar solo ProseMirror duplicados
export function cleanupDuplicateProseMirror() {
  console.log("🧹 Limpiando específicamente ProseMirror duplicados...");

  const allProseMirrorEditors = document.querySelectorAll(".ProseMirror");
  const proseMirrorByContainer = new Map();
  let removedCount = 0;

  // Agrupar ProseMirror por container
  allProseMirrorEditors.forEach((editor) => {
    const container = editor.closest("[data-editor-id]");
    if (container) {
      const containerId = container.getAttribute("data-editor-id");
      if (!proseMirrorByContainer.has(containerId)) {
        proseMirrorByContainer.set(containerId, []);
      }
      proseMirrorByContainer.get(containerId).push(editor);
    }
  });

  // Remover duplicados en cada container
  proseMirrorByContainer.forEach((editors, containerId) => {
    if (editors.length > 1) {
      console.log(
        `🗑️ Container ${containerId}: ${
          editors.length
        } ProseMirror encontrados, removiendo ${editors.length - 1} duplicados`
      );
      // Mantener solo el primero, remover el resto
      for (let i = 1; i < editors.length; i++) {
        console.log(`🗑️ Removiendo ProseMirror duplicado #${i + 1}`);
        editors[i].remove();
        removedCount++;
      }
    }
  });

  console.log(
    `✅ Limpieza ProseMirror completada: ${removedCount} editores duplicados removidos`
  );

  const finalCount = document.querySelectorAll(".ProseMirror").length;
  console.log(`📊 ProseMirror restantes: ${finalCount}`);

  return {
    removed: removedCount,
    remaining: finalCount,
  };
}

// Exponer funciones globalmente para debugging
if (typeof window !== "undefined") {
  (window as any).cleanupAllEditors = cleanupAllEditors;
  (window as any).forceCleanReload = forceCleanReload;
  (window as any).checkForDuplicates = checkForDuplicates;
  (window as any).cleanupDuplicateProseMirror = cleanupDuplicateProseMirror;
}
