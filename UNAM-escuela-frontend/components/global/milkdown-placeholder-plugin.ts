// Plugin personalizado para placeholder en español
import { Plugin, PluginKey } from "@milkdown/kit/prose/state";
import { Decoration, DecorationSet } from "@milkdown/kit/prose/view";
import { $prose } from "@milkdown/kit/utils";

const placeholderPluginKey = new PluginKey("placeholder");

export const placeholderPlugin = $prose(() => {
  return new Plugin({
    key: placeholderPluginKey,
    props: {
      decorations: (state) => {
        const doc = state.doc;
        if (
          doc.childCount === 1 &&
          doc.firstChild?.isTextblock &&
          doc.firstChild.content.size === 0
        ) {
          const decoration = Decoration.node(0, doc.content.size, {
            class: "milkdown-placeholder",
            "data-placeholder": "Ingrese el contenido",
          });
          return DecorationSet.create(doc, [decoration]);
        }
        return null;
      },
    },
  });
});
