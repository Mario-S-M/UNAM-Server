"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import type { FC } from "react";
import { Crepe } from "@milkdown/crepe";
import { listenerCtx } from "@milkdown/kit/plugin/listener";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import "./milkdown-simple.css";

// Map global para rastrear editores activos con información detallada
const activeEditors = new Map<string, {
  instance: any;
  container: HTMLElement;
  contentId?: string;
  timestamp: number;
}>();

// Singleton global para controlar la inicialización
let isInitializingEditor = false;
let initializationQueue: Array<() => void> = [];

// Función global mejorada para prevenir duplicados
const preventDuplicateEditors = (contentId?: string, currentContainer?: HTMLElement) => {
  // Si hay un contentId específico, verificar si ya existe
  if (contentId) {
    for (const [key, editorInfo] of activeEditors.entries()) {
      if (editorInfo.contentId === contentId && editorInfo.container !== currentContainer) {
        console.log(`⚠️ PREVENCIÓN: Ya existe un editor activo para contentId ${contentId}`);
        return false; // Prevenir creación
      }
    }
  }

  // Verificar editores ProseMirror en la página
  const allProseMirrorEditors = document.querySelectorAll(".ProseMirror");
  
  if (allProseMirrorEditors.length > 0) {
    // Si ya hay editores y estamos intentando crear uno nuevo, verificar si es necesario
    const existingContainers = new Set<Element>();
    
    allProseMirrorEditors.forEach(editor => {
      const container = editor.closest(".milkdown-client-container");
      if (container && container !== currentContainer) {
        existingContainers.add(container);
      }
    });
    
    if (existingContainers.size > 0 && !contentId) {
      console.log(`⚠️ PREVENCIÓN: Ya existen ${existingContainers.size} editores en la página`);
      return false; // Prevenir creación de editores adicionales sin contentId específico
    }
  }
  
  return true; // Permitir creación
};

// Función para limpiar editores huérfanos
const cleanupOrphanedEditors = () => {
  const allProseMirrorEditors = document.querySelectorAll(".ProseMirror");
  const validContainers = new Set<Element>();
  
  // Recopilar containers válidos del Map
  for (const editorInfo of activeEditors.values()) {
    if (editorInfo.container && document.contains(editorInfo.container)) {
      validContainers.add(editorInfo.container);
    }
  }
  
  // Eliminar editores que no están en el Map de activos
  allProseMirrorEditors.forEach(editor => {
    const container = editor.closest(".milkdown-client-container");
    if (container && !validContainers.has(container)) {
      console.log(`🗑️ LIMPIEZA: Removiendo editor huérfano`);
      container.remove();
    }
  });
};

// Función para convertir contenido de ProseMirror HTML a Markdown
const convertProseMirrorToMarkdown = (element: HTMLElement): string => {
  // Crear un clon del elemento para no modificar el original
  const clone = element.cloneNode(true) as HTMLElement;

  // Convertir elementos HTML comunes a markdown
  const processElement = (el: HTMLElement): string => {
    let result = "";

    for (const child of Array.from(el.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        result += child.textContent || "";
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const childEl = child as HTMLElement;
        const tagName = childEl.tagName.toLowerCase();

        switch (tagName) {
          case "h1":
            result += `# ${processElement(childEl)}\n\n`;
            break;
          case "h2":
            result += `## ${processElement(childEl)}\n\n`;
            break;
          case "h3":
            result += `### ${processElement(childEl)}\n\n`;
            break;
          case "h4":
            result += `#### ${processElement(childEl)}\n\n`;
            break;
          case "h5":
            result += `##### ${processElement(childEl)}\n\n`;
            break;
          case "h6":
            result += `###### ${processElement(childEl)}\n\n`;
            break;
          case "p":
            const pContent = processElement(childEl);
            if (pContent.trim()) {
              result += `${pContent}\n\n`;
            }
            break;
          case "strong":
          case "b":
            result += `**${processElement(childEl)}**`;
            break;
          case "em":
          case "i":
            result += `*${processElement(childEl)}*`;
            break;
          case "code":
            result += `\`${processElement(childEl)}\``;
            break;
          case "pre":
            result += `\`\`\`\n${processElement(childEl)}\n\`\`\`\n\n`;
            break;
          case "ul":
            result += processElement(childEl);
            break;
          case "ol":
            result += processElement(childEl);
            break;
          case "li":
            // Detectar si es parte de una lista ordenada o no ordenada
            const parentList = childEl.parentElement;
            if (parentList?.tagName.toLowerCase() === "ol") {
              result += `1. ${processElement(childEl)}\n`;
            } else {
              result += `- ${processElement(childEl)}\n`;
            }
            break;
          case "blockquote":
            const quoteContent = processElement(childEl);
            result +=
              quoteContent
                .split("\n")
                .map((line) => (line.trim() ? `> ${line}` : ">"))
                .join("\n") + "\n\n";
            break;
          case "a":
            const href = childEl.getAttribute("href");
            const linkText = processElement(childEl);
            if (href) {
              result += `[${linkText}](${href})`;
            } else {
              result += linkText;
            }
            break;
          case "img":
            const src = childEl.getAttribute("src");
            const alt = childEl.getAttribute("alt") || "";
            if (src) {
              result += `![${alt}](${src})`;
            }
            break;
          case "br":
            result += "\n";
            break;
          case "hr":
            result += "\n---\n\n";
            break;
          case "table":
            result += processTable(childEl);
            break;
          case "thead":
          case "tbody":
            result += processElement(childEl);
            break;
          case "tr":
            const rowContent = processTableRow(childEl);
            result += `${rowContent}\n`;
            break;
          case "th":
          case "td":
            const cellContent = processElement(childEl);
            result += ` ${cellContent} |`;
            break;
          default:
            // Para elementos no reconocidos, procesar recursivamente el contenido
            result += processElement(childEl);
            break;
        }
      }
    }

    return result;
  };

  // Función específica para procesar tablas
  const processTable = (table: HTMLElement): string => {
    let tableMarkdown = "\n";
    const rows = table.querySelectorAll("tr");

    rows.forEach((row, index) => {
      const cells = row.querySelectorAll("th, td");
      const rowContent = Array.from(cells)
        .map((cell) => cell.textContent?.trim() || "")
        .join(" | ");

      tableMarkdown += `| ${rowContent} |\n`;

      // Agregar separador después del header
      if (index === 0 && row.querySelector("th")) {
        const separatorCells = Array.from(cells)
          .map(() => "---")
          .join(" | ");
        tableMarkdown += `| ${separatorCells} |\n`;
      }
    });

    return tableMarkdown + "\n";
  };

  // Función específica para procesar filas de tabla
  const processTableRow = (row: HTMLElement): string => {
    const cells = row.querySelectorAll("th, td");
    const cellContents = Array.from(cells).map(
      (cell) => cell.textContent?.trim() || ""
    );
    return `| ${cellContents.join(" | ")} |`;
  };

  let markdown = processElement(clone);

  // Limpiar el markdown generado
  markdown = markdown
    .replace(/\n{3,}/g, "\n\n") // Reducir múltiples saltos de línea
    .replace(/^\n+/, "") // Remover saltos de línea al inicio
    .replace(/\n+$/, "\n"); // Mantener un salto de línea al final

  return markdown;
};

interface MilkdownEditorClientProps {
  defaultValue: string;
  downloadFileName?: string;
  contentId?: string;
  onSave?: (content: string) => Promise<void>;
  readonly?: boolean;
  placeholder?: string;
  className?: string;
}

const MilkdownEditorClientFixed: FC<MilkdownEditorClientProps> = ({
  defaultValue,
  downloadFileName = "content.md",
  contentId,
  onSave,
  readonly = false,
  placeholder = "Escribe aquí...",
  className = "",
}) => {
  // ID único para esta instancia del editor
  const editorInstanceId = useRef(
    `editor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );

  console.log("🔄 COMPONENTE MILKDOWN SE ESTÁ MONTANDO", {
    instanceId: editorInstanceId.current,
    contentId,
    readonly,
    hasOnSave: !!onSave,
    onSaveType: typeof onSave,
    defaultValueLength: defaultValue.length,
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const crepeRef = useRef<Crepe | null>(null);
  const [currentContent, setCurrentContent] = useState(defaultValue);
  const lastSavedContentRef = useRef(defaultValue);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [hasBeenInitialized, setHasBeenInitialized] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initializationRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(false);

  // Función para configurar el listener nativo de markdown de Milkdown
  const setupMarkdownListener = useCallback(
    (crepe: Crepe) => {
      try {
        // Acceder al editor interno de Crepe
        if (crepe.editor && crepe.editor.ctx) {
          console.log("🔗 Configurando listener nativo de markdown");

          // Configurar el listener de markdown que se ejecuta cada vez que el contenido cambia
          const listenerCtxValue = crepe.editor.ctx.get(listenerCtx);

          if (
            listenerCtxValue &&
            typeof listenerCtxValue.markdownUpdated === "function"
          ) {
            listenerCtxValue.markdownUpdated((ctx: any, markdown: string) => {
              console.log("🎯 Markdown actualizado por listener nativo", {
                markdownLength: markdown.length,
                preview: markdown.substring(0, 100) + "...",
                hasTable: markdown.includes("|"),
                hasHeaders: markdown.includes("#"),
                timestamp: new Date().toISOString(),
              });

              // Actualizar el contenido actual inmediatamente
              setCurrentContent(markdown);

              // Ejecutar auto-save si las condiciones se cumplen
              if (
                !readonly &&
                onSave &&
                markdown !== lastSavedContentRef.current &&
                markdown.trim() !== ""
              ) {
                // Cancelar timeout previo
                if (debounceTimeoutRef.current) {
                  clearTimeout(debounceTimeoutRef.current);
                }

                // Programar guardado con debounce
                debounceTimeoutRef.current = setTimeout(() => {
                  console.log(
                    "💾 Auto-save: INICIANDO GUARDADO desde listener nativo",
                    {
                      contentLength: markdown.length,
                      timestamp: new Date().toISOString(),
                      contentId,
                      hasTable: markdown.includes("|"),
                    }
                  );

                  onSave(markdown)
                    .then(() => {
                      console.log(
                        "✅ Auto-save: Guardado exitoso desde listener nativo"
                      );
                      lastSavedContentRef.current = markdown;
                    })
                    .catch((error) => {
                      console.error(
                        "❌ Error en auto-save desde listener nativo:",
                        error
                      );
                    });
                }, 2000); // 2 segundos de debounce
              }
            });

            console.log(
              "✅ Listener nativo de markdown configurado exitosamente"
            );
            return true;
          } else {
            console.log("⚠️ listenerCtx.markdownUpdated no disponible");
            return false;
          }
        } else {
          console.log("⚠️ Editor context no disponible para listener nativo");
          return false;
        }
      } catch (error) {
        console.error(
          "❌ Error configurando listener nativo de markdown:",
          error
        );
        return false;
      }
    },
    [readonly, onSave, contentId]
  );

  // Función para obtener contenido de forma segura con prioridad en el listener nativo
  const getSafeMarkdown = useCallback(() => {
    console.log("🔍 getSafeMarkdown llamado", {
      hasCrepe: !!crepeRef.current,
      isEditorReady,
      currentContentLength: currentContent.length,
    });

    let milkdownContent = "";
    let domContent = "";

    // Paso 1: Intentar obtener markdown del editor Milkdown (prioritario para tablas)
    if (crepeRef.current) {
      try {
        milkdownContent = crepeRef.current.getMarkdown();
        console.log("✅ Markdown obtenido del editor Milkdown", {
          length: milkdownContent.length,
          preview: milkdownContent.substring(0, 100) + "...",
          hasTable: milkdownContent.includes("|"),
          hasHeaders: milkdownContent.includes("#"),
        });
      } catch (error) {
        console.debug("⚠️ Error al obtener markdown del editor", error);
      }
    }

    // Paso 2: Fallback - obtener contenido del DOM y convertir a markdown
    if (!milkdownContent || milkdownContent === defaultValue) {
      try {
        if (editorRef.current) {
          const editorContent = editorRef.current.querySelector(".ProseMirror");
          if (editorContent) {
            domContent = convertProseMirrorToMarkdown(
              editorContent as HTMLElement
            );

            console.log("🔄 Contenido extraído del DOM como markdown", {
              originalHTML:
                (editorContent as HTMLElement).innerHTML.substring(0, 100) +
                "...",
              convertedMarkdown: domContent.substring(0, 100) + "...",
              hasTable: domContent.includes("|"),
              hasMarkdownSyntax:
                domContent.includes("#") ||
                domContent.includes("**") ||
                domContent.includes("*"),
            });
          }
        }
      } catch (domError) {
        console.debug("❌ Error al obtener contenido del DOM", domError);
      }
    }

    // Decisión de qué contenido usar - priorizar Milkdown para mejor soporte de tablas
    if (
      milkdownContent &&
      milkdownContent.trim() !== "" &&
      milkdownContent !== defaultValue
    ) {
      console.log("📝 Usando contenido de Milkdown (prioridad para tablas)", {
        length: milkdownContent.length,
        preview: milkdownContent.substring(0, 50) + "...",
        hasTable: milkdownContent.includes("|"),
      });
      return milkdownContent;
    }

    if (domContent && domContent.trim() !== "" && domContent !== defaultValue) {
      console.log("📝 Usando contenido convertido del DOM", {
        length: domContent.length,
        preview: domContent.substring(0, 50) + "...",
        hasTable: domContent.includes("|"),
      });
      return domContent;
    }

    // Último recurso
    console.log("📝 Usando contenido actual en memoria");
    return currentContent || defaultValue;
  }, [currentContent, defaultValue, isEditorReady]);

  // Manejar cambios usando eventos del DOM con debounce optimizado (fallback)
  const handleEditorChange = useCallback(() => {
    console.log("🎯 handleEditorChange llamado (fallback)", {
      readonly,
      isEditorReady,
      hasOnSave: !!onSave,
      contentId,
      hasCrepe: !!crepeRef.current,
    });

    if (!readonly && onSave && crepeRef.current) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        if (!crepeRef.current) return;

        setTimeout(() => {
          const newContent = getSafeMarkdown();
          setCurrentContent(newContent);

          if (
            newContent !== lastSavedContentRef.current &&
            newContent.trim() !== ""
          ) {
            console.log("💾 Auto-save: INICIANDO GUARDADO (fallback)", {
              contentLength: newContent.length,
              timestamp: new Date().toISOString(),
              contentId,
              hasTable: newContent.includes("|"),
            });

            onSave(newContent)
              .then(() => {
                console.log("✅ Auto-save: Guardado exitoso (fallback)");
                lastSavedContentRef.current = newContent;
              })
              .catch((error) => {
                console.error("❌ Error en auto-save (fallback):", error);
              });
          }
        }, 100);
      }, 2000);
    }
  }, [readonly, onSave, contentId, getSafeMarkdown]);

  useEffect(() => {
    // Prevenir múltiples inicializaciones con verificaciones más estrictas
    if (!editorRef.current || initializationRef.current) {
      console.log("⏭️ Evitando inicialización duplicada", {
        hasEditorRef: !!editorRef.current,
        initInProgress: initializationRef.current,
      });
      return;
    }

    // Prevenir re-inicialización si ya hay un editor funcionando
    if (crepeRef.current && isEditorReady) {
      console.log("⚠️ Editor ya está inicializado y funcionando, evitando re-inicialización");
      return;
    }

    mountedRef.current = true;

    const initEditor = async () => {
      try {
        // Control de singleton global - solo un editor puede inicializarse a la vez
        if (isInitializingEditor) {
          console.log("⏳ Otro editor se está inicializando, agregando a la cola...");
          return new Promise<void>((resolve) => {
            initializationQueue.push(() => {
              initEditor().then(resolve);
            });
          });
        }

        isInitializingEditor = true;
        initializationRef.current = true;

        // Crear una clave única más robusta
        const editorKey = contentId
          ? `content-${contentId}`
          : `instance-${editorInstanceId.current}`;

        // Verificar si ya existe un editor con esta clave
        if (activeEditors.has(editorKey)) {
          console.log("⚠️ Editor ya existe con clave:", editorKey);
          isInitializingEditor = false;
          return;
        }

        // Verificación de prevención de duplicados
        if (!preventDuplicateEditors(contentId, editorRef.current || undefined)) {
          console.log("⚠️ Prevención de duplicados activada, abortando inicialización");
          isInitializingEditor = false;
          return;
        }

        // Limpiar editores huérfanos antes de crear uno nuevo
        cleanupOrphanedEditors();

        // Verificación del container actual
        if (editorRef.current) {
          const existingProseMirror = editorRef.current.querySelector(".ProseMirror");
          if (existingProseMirror) {
            console.log("⚠️ Ya existe un editor ProseMirror en este container, abortando inicialización");
            isInitializingEditor = false;
            return;
          }
          
          // Limpiar cualquier contenido residual de forma segura
          if (editorRef.current.children.length > 0) {
            console.log("🧹 Limpiando contenido residual del container...");
            editorRef.current.innerHTML = "";
          }
        }

        console.log("🚀 Iniciando editor Milkdown...", {
          editorKey,
          contentId,
          activeEditorsCount: activeEditors.size,
          containerId: editorInstanceId.current,
        });
        // Limpiar editor anterior si existe
        if (crepeRef.current) {
          try {
            crepeRef.current.destroy();
          } catch (e) {
            console.debug("Cleanup previo completado");
          }
        }

        // Limpiar el DOM del container completamente
        if (editorRef.current) {
          // Forzar un reflow para asegurar que el DOM esté limpio
          editorRef.current.offsetHeight;
        }

        await new Promise((resolve) => setTimeout(resolve, 300));

        const crepe = new Crepe({
          root: editorRef.current!,
          defaultValue: defaultValue,
          // Mantener todas las funcionalidades del editor
        });

        crepeRef.current = crepe;
        await crepe.create();

        // Registrar el editor en el Map global DESPUÉS de la creación exitosa
        activeEditors.set(editorKey, {
          instance: crepe,
          container: editorRef.current!,
          contentId: contentId,
          timestamp: Date.now()
        });

        // Verificación post-creación: asegurar que solo hay un ProseMirror en este container
        if (editorRef.current) {
          const proseMirrorEditors = editorRef.current.querySelectorAll(".ProseMirror");
          
          if (proseMirrorEditors.length === 0) {
            console.error("❌ No se creó ningún editor ProseMirror");
            // Limpiar del Map si falló la creación
            activeEditors.delete(editorKey);
            isInitializingEditor = false;
            return;
          }
          
          if (proseMirrorEditors.length > 1) {
            console.log(`⚠️ Múltiples ProseMirror detectados (${proseMirrorEditors.length}), manteniendo solo el primero`);
            // Mantener solo el primero y eliminar el resto
            for (let i = 1; i < proseMirrorEditors.length; i++) {
              proseMirrorEditors[i].remove();
              console.log(`🗑️ ProseMirror duplicado #${i + 1} removido`);
            }
          }
        }

        console.log(`✅ Editor ${editorKey} creado exitosamente. Total activos: ${activeEditors.size}`);

        if (readonly) {
          crepe.setReadonly(true);
        }

        // PRIORIDAD 1: Configurar listener nativo de markdown
        let nativeListenerConfigured = false;
        try {
          nativeListenerConfigured = setupMarkdownListener(crepe);

          if (nativeListenerConfigured) {
            console.log(
              "✅ Listener nativo configurado - capturará todos los cambios incluyendo tablas"
            );
          } else {
            console.log("⚠️ Listener nativo no disponible, usando fallbacks");
          }
        } catch (error) {
          console.error("❌ Error configurando listener nativo:", error);
        }

        // FALLBACK: Configurar listeners DOM solo si el nativo no funciona
        if (!nativeListenerConfigured && !readonly && editorRef.current) {
          console.log("🔗 Configurando listeners DOM como fallback");

          const editorElement = editorRef.current;

          const changeHandler = () => {
            console.log("🎯 Cambio detectado por DOM (fallback)");
            handleEditorChange();
          };

          editorElement.addEventListener("input", changeHandler, {
            passive: true,
          });
          editorElement.addEventListener("keyup", changeHandler, {
            passive: true,
          });
          editorElement.addEventListener("paste", changeHandler);

          // MutationObserver para cambios estructurales (importantes para tablas)
          const observer = new MutationObserver((mutations) => {
            const hasChanges = mutations.some(
              (mutation) =>
                mutation.type === "characterData" ||
                (mutation.type === "childList" &&
                  (mutation.addedNodes.length > 0 ||
                    mutation.removedNodes.length > 0))
            );

            if (hasChanges) {
              console.log("🔍 MutationObserver: Cambio estructural detectado");
              changeHandler();
            }
          });

          observer.observe(editorElement, {
            childList: true,
            subtree: true,
            characterData: true,
          });

          (crepe as any).__changeHandler = changeHandler;
          (crepe as any).__observer = observer;
        }

        setHasBeenInitialized(true);
        setIsEditorReady(true);
        
        console.log("✅ Editor Milkdown inicializado correctamente");
        
        // Liberar el singleton y procesar la cola
        isInitializingEditor = false;
        
        // Procesar el siguiente editor en la cola si existe
        if (initializationQueue.length > 0) {
          const nextInit = initializationQueue.shift();
          if (nextInit) {
            console.log(`📋 Procesando siguiente editor en cola (${initializationQueue.length} restantes)`);
            setTimeout(nextInit, 100); // Pequeño delay para evitar conflictos
          }
        }
      } catch (error) {
        console.error("❌ Error al inicializar Milkdown:", error);
        setIsEditorReady(false);
        setHasBeenInitialized(false);
        
        // Limpiar del Map en caso de error
        const editorKey = contentId
          ? `content-${contentId}`
          : `instance-${editorInstanceId.current}`;
        activeEditors.delete(editorKey);
        
        // Liberar el singleton
        isInitializingEditor = false;
        
        // Procesar el siguiente editor en la cola si existe
        if (initializationQueue.length > 0) {
          const nextInit = initializationQueue.shift();
          if (nextInit) {
            console.log(`📋 Procesando siguiente editor en cola tras error (${initializationQueue.length} restantes)`);
            setTimeout(nextInit, 100);
          }
        }
        
        initializationRef.current = false;
      }
    };

    initEditor();

    return () => {
      console.log("🧹 Limpiando editor...");
      setIsEditorReady(false);
      setHasBeenInitialized(false);

      // Remover del Map global
      const editorKey = contentId
        ? `content-${contentId}`
        : `instance-${editorInstanceId.current}`;
      activeEditors.delete(editorKey);
      console.log("🗑️ Editor removido del registro global:", editorKey);

      // Limpiar timeout de debounce
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      if (crepeRef.current) {
        try {
          if ((crepeRef.current as any).__changeHandler && editorRef.current) {
            const editorElement = editorRef.current;
            const changeHandler = (crepeRef.current as any).__changeHandler;
            editorElement.removeEventListener("input", changeHandler);
            editorElement.removeEventListener("keyup", changeHandler);
            editorElement.removeEventListener("paste", changeHandler);
          }

          if ((crepeRef.current as any).__observer) {
            (crepeRef.current as any).__observer.disconnect();
          }

          crepeRef.current.destroy();
          console.log(`🧹 Editor Crepe ${editorKey} destruido correctamente`);
        } catch (error) {
          console.debug("Error al destruir editor:", error);
        }
        crepeRef.current = null;
      }

      // Limpiar editores huérfanos
      cleanupOrphanedEditors();
      
      console.log(`🧹 Cleanup completado para ${editorKey}. Editores activos restantes: ${activeEditors.size}`);

      initializationRef.current = false;
      mountedRef.current = false;
    };
  }, []);

  return (
    <div
      className={`milkdown-client-container ${className} relative`}
      data-editor-id={editorInstanceId.current}
      data-content-id={contentId}
      key={editorInstanceId.current}
    >
      <div
        ref={editorRef}
        className={`milkdown-container milkdown-editor-simple ${
          readonly ? "readonly" : "editable"
        }`}
      />

      {!isEditorReady && (
        <div className="absolute top-2 right-2 text-xs text-gray-400 bg-white bg-opacity-80 px-2 py-1 rounded shadow-sm">
          {hasBeenInitialized
            ? "Configurando editor..."
            : "Inicializando editor..."}
        </div>
      )}

      {process.env.NODE_ENV === 'development' && isEditorReady && !readonly && (
        <div className="absolute top-2 right-2 opacity-30 transition-opacity duration-500">
          <div className="text-xs text-gray-500 bg-white bg-opacity-60 px-1.5 py-0.5 rounded-full shadow-sm">
            💾
          </div>
        </div>
      )}
    </div>
  );
};

const MilkdownEditorClientFixedMemo = memo(
  MilkdownEditorClientFixed,
  (prevProps, nextProps) => {
    return (
      prevProps.defaultValue === nextProps.defaultValue &&
      prevProps.contentId === nextProps.contentId &&
      prevProps.readonly === nextProps.readonly &&
      prevProps.className === nextProps.className &&
      prevProps.placeholder === nextProps.placeholder
    );
  }
);

export default MilkdownEditorClientFixedMemo;
