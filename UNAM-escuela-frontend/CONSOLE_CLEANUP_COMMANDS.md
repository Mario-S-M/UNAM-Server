// Ejecuta esto en la consola del navegador para limpiar ProseMirror duplicados inmediatamente:

// 1. Verificar estado actual
window.checkForDuplicates()

// 2. Limpiar específicamente ProseMirror duplicados
window.cleanupDuplicateProseMirror()

// 3. Verificar resultado
window.checkForDuplicates()

// Si aún hay problemas, limpieza completa:
window.cleanupAllEditors()

// Para debugging continuo, ejecuta cada 5 segundos:
const autoCleanup = setInterval(() => {
const status = window.checkForDuplicates();
if (status.details?.proseMirrorDuplicates) {
console.log("🎯 Auto-limpiando ProseMirror duplicados...");
window.cleanupDuplicateProseMirror();
}
}, 5000);

// Para detener el auto-cleanup:
// clearInterval(autoCleanup);
