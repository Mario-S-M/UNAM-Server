'use client';

import { type Value, TrailingBlockPlugin } from 'platejs';
import { type TPlateEditor, useEditorRef } from 'platejs/react';

import { AlignKit } from '@/components/editor/plugins/align-kit';
import { BasicBlocksKit } from '@/components/editor/plugins/basic-blocks-kit';
import { CalloutKit } from '@/components/editor/plugins/callout-kit';
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  KbdPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
} from '@platejs/basic-nodes/react';
import { CodeLeaf } from '@/components/ui/code-node';
import { KbdLeaf } from '@/components/ui/kbd-node';
import { CodeBlockKit } from '@/components/editor/plugins/code-block-kit';
import { ColumnKit } from '@/components/editor/plugins/column-kit';
import { DateKit } from '@/components/editor/plugins/date-kit';
import { FontKit } from '@/components/editor/plugins/font-kit';
import { LineHeightKit } from '@/components/editor/plugins/line-height-kit';
import { LinkKit } from '@/components/editor/plugins/link-kit';
import { ListKit } from '@/components/editor/plugins/list-kit';
import { MarkdownKit } from '@/components/editor/plugins/markdown-kit';
import { MathKit } from '@/components/editor/plugins/math-kit';
import { MediaKit } from '@/components/editor/plugins/media-kit';
import { TableKit } from '@/components/editor/plugins/table-kit';
import { TocKit } from '@/components/editor/plugins/toc-kit';
import { ToggleKit } from '@/components/editor/plugins/toggle-kit';

// Kit específico para modo solo lectura - sin comentarios, emojis, sugerencias, etc.
export const ReadOnlyEditorKit = [
  // Elements básicos
  ...BasicBlocksKit,
  ...CodeBlockKit,
  ...TableKit,
  ...ToggleKit,
  ...TocKit,
  ...MediaKit,
  ...CalloutKit,
  ...ColumnKit,
  ...MathKit,
  ...DateKit,
  ...LinkKit,

  // Marks básicos (sin subrayado ni resaltado)
  BoldPlugin,
  ItalicPlugin,
  CodePlugin.configure({
    node: { component: CodeLeaf },
    shortcuts: { toggle: { keys: 'mod+e' } },
  }),
  StrikethroughPlugin.configure({
    shortcuts: { toggle: { keys: 'mod+shift+x' } },
  }),
  SubscriptPlugin.configure({
    shortcuts: { toggle: { keys: 'mod+comma' } },
  }),
  SuperscriptPlugin.configure({
    shortcuts: { toggle: { keys: 'mod+period' } },
  }),
  KbdPlugin.withComponent(KbdLeaf),
  ...FontKit,

  // Block Style
  ...ListKit,
  ...AlignKit,
  ...LineHeightKit,

  // Parsers
  ...MarkdownKit,

  // Plugins básicos
  TrailingBlockPlugin,
];

export type ReadOnlyEditor = TPlateEditor<Value, (typeof ReadOnlyEditorKit)[number]>;

export const useReadOnlyEditor = () => useEditorRef<ReadOnlyEditor>();