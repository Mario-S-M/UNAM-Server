'use client';

import * as React from 'react';

import { Redo2Icon, Undo2Icon } from 'lucide-react';
import { useEditorRef, useEditorSelector } from 'platejs/react';

import { ToolbarButton } from './toolbar';

export function RedoToolbarButton(
  props: React.ComponentProps<typeof ToolbarButton>
) {
  const editor = useEditorRef();
  const [disabled, setDisabled] = React.useState(true);

  React.useEffect(() => {
    if (editor && editor.history) {
      setDisabled(editor.history.redos.length === 0);
    }
  }, [editor]);

  const handleClick = React.useCallback(() => {
    if (editor) {
      editor.redo();
    }
  }, [editor]);

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <ToolbarButton
      {...props}
      disabled={disabled}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      // Eliminamos el tooltip para evitar el bucle infinito
    >
      <Redo2Icon />
    </ToolbarButton>
  );
}

export function UndoToolbarButton(
  props: React.ComponentProps<typeof ToolbarButton>
) {
  const editor = useEditorRef();
  const [disabled, setDisabled] = React.useState(true);

  React.useEffect(() => {
    if (editor && editor.history) {
      setDisabled(editor.history.undos.length === 0);
    }
  }, [editor]);

  const handleClick = React.useCallback(() => {
    if (editor) {
      editor.undo();
    }
  }, [editor]);

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <ToolbarButton
      {...props}
      disabled={disabled}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      // Eliminamos el tooltip para evitar el bucle infinito
    >
      <Undo2Icon />
    </ToolbarButton>
  );
}
