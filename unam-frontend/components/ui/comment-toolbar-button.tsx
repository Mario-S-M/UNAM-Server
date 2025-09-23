'use client';

import * as React from 'react';

import { MessageSquareTextIcon } from 'lucide-react';
import { useContentContext } from '@/contexts/ContentContext';
import { CommentModal } from '@/content/components/CommentModal';

import { ToolbarButton } from './toolbar';

export function CommentToolbarButton({ contentId: propContentId }: { contentId?: string } = {}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // Usar el contexto de forma defensiva o usar el contentId pasado como prop
  let contentId: string | null = propContentId || null;
  
  if (!contentId) {
    try {
      const context = useContentContext();
      contentId = context.contentId;
    } catch (error) {
      // Si no hay contexto disponible y no se pasó contentId como prop, el botón estará deshabilitado
      contentId = null;
    }
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
