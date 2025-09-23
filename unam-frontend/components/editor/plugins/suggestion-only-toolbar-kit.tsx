'use client';

import { createPlatePlugin } from 'platejs/react';

import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { FloatingToolbar } from '@/components/ui/floating-toolbar';
import { SuggestionOnlyFixedToolbarButtons, SuggestionOnlyFloatingToolbarButtons } from '@/components/ui/suggestion-only-toolbar-buttons';

// Función para crear los kits de barra de herramientas con contentId
export const createSuggestionOnlyToolbarKits = (contentId?: string) => {
  const SuggestionOnlyFixedToolbarKit = [
    createPlatePlugin({
      key: 'suggestion-only-fixed-toolbar',
      render: {
        beforeEditable: () => (
          <FixedToolbar>
            <SuggestionOnlyFixedToolbarButtons contentId={contentId} />
          </FixedToolbar>
        ),
      },
    }),
  ];

  const SuggestionOnlyFloatingToolbarKit = [
    createPlatePlugin({
      key: 'suggestion-only-floating-toolbar',
      render: {
        afterEditable: () => (
          <FloatingToolbar>
            <SuggestionOnlyFloatingToolbarButtons contentId={contentId} />
          </FloatingToolbar>
        ),
      },
    }),
  ];

  return {
    SuggestionOnlyFixedToolbarKit,
    SuggestionOnlyFloatingToolbarKit,
  };
};

// Exportar kits por defecto para compatibilidad
export const { SuggestionOnlyFixedToolbarKit, SuggestionOnlyFloatingToolbarKit } = createSuggestionOnlyToolbarKits();