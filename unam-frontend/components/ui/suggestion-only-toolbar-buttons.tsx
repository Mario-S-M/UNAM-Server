'use client';

import * as React from 'react';

import { HighlighterIcon } from 'lucide-react';
import { KEYS } from 'platejs';

import { CommentToolbarButton } from './comment-toolbar-button';
import { useEditorRef } from 'platejs/react';
import { MarkToolbarButton } from './mark-toolbar-button';
import { SuggestionToolbarButton } from './suggestion-toolbar-button';
import { ToolbarGroup } from './toolbar';

// Barra de herramientas flotante solo para modo suggestion
export function SuggestionOnlyFloatingToolbarButtons({ contentId }: { contentId?: string } = {}) {
  // Siempre mostrar los botones ya que este componente solo se usa en modo suggestion
  return (
    <ToolbarGroup>
      <MarkToolbarButton nodeType={KEYS.highlight} tooltip="Highlight">
        <HighlighterIcon />
      </MarkToolbarButton>
      <CommentToolbarButton contentId={contentId} />
      <SuggestionToolbarButton />
    </ToolbarGroup>
  );
}

// Barra de herramientas fija solo para modo suggestion
export function SuggestionOnlyFixedToolbarButtons({ contentId }: { contentId?: string } = {}) {
  // Siempre mostrar los botones ya que este componente solo se usa en modo suggestion
  return (
    <div className="flex w-full">
      <div className="grow" />
      
      <ToolbarGroup>
        <MarkToolbarButton nodeType={KEYS.highlight} tooltip="Highlight">
          <HighlighterIcon />
        </MarkToolbarButton>
        <CommentToolbarButton contentId={contentId} />
      </ToolbarGroup>
    </div>
  );
}