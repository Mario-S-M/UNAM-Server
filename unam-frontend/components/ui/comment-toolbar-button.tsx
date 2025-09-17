'use client';

import * as React from 'react';

import { MessageSquareTextIcon } from 'lucide-react';
import { useContentContext } from '@/contexts/ContentContext';
import { CommentModal } from '@/content/components/CommentModal';

import { ToolbarButton } from './toolbar';

export function CommentToolbarButton() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // Usar el contexto de forma defensiva
  let contentId: string | null = null;
  try {
    const context = useContentContext();
    contentId = context.contentId;
  } catch (error) {
    // Si no hay contexto disponible, el botón estará deshabilitado
    contentId = null;
  }

  const handleClick = () => {
    if (contentId) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <ToolbarButton
        onClick={handleClick}
        data-plate-prevent-overlay
        tooltip={contentId ? "Comentarios" : "Comentarios (no disponible)"}
        disabled={!contentId}
      >
        <MessageSquareTextIcon />
      </ToolbarButton>
      
      {contentId && (
        <CommentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          content={{ id: contentId }}
        />
      )}
    </>
  );
}
