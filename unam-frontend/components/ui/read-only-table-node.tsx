'use client';

import * as React from 'react';

import type {
  TTableCellElement,
  TTableElement,
  TTableRowElement,
} from 'platejs';
import type { PlateElementProps } from 'platejs/react';

import { useDraggable, useDropLine } from '@platejs/dnd';
import {
  BlockSelectionPlugin,
  useBlockSelected,
} from '@platejs/selection/react';
import {
  TableProvider,
  useTableCellElement,
  useTableCellElementResizable,
  useTableElement,
} from '@platejs/table/react';
import { cva } from 'class-variance-authority';
import { GripVertical } from 'lucide-react';
import {
  PlateElement,
  useComposedRef,
  useElement,
  withHOC,
} from 'platejs/react';
import { useElementSelector } from 'platejs/react';

import { cn } from '@/lib/utils';

import { blockSelectionVariants } from './block-selection';
import { ResizeHandle } from './resize-handle';

// Componente de tabla de solo lectura sin barras de herramientas
export const ReadOnlyTableElement = withHOC(
  TableProvider,
  function ReadOnlyTableElement({
    children,
    ...props
  }: PlateElementProps<TTableElement>) {
    const { isSelectingCell, marginLeft } = useTableElement();
    const isSelected = useBlockSelected();

    return (
      <PlateElement
        className={cn(
          'my-4 ml-px mr-0 table h-px table-fixed border-collapse',
          isSelectingCell && 'selection:bg-transparent'
        )}
        {...props}
      >
        <tbody className="min-w-full">{children}</tbody>
        {isSelected && (
          <div className={blockSelectionVariants()} contentEditable={false} />
        )}
      </PlateElement>
    );
  }
);

// Componente de fila de tabla de solo lectura
export function ReadOnlyTableRowElement(props: PlateElementProps<TTableRowElement>) {
  const { children, element } = props;
  const { isDragging, handleRef } = useDraggable({ element });

  return (
    <PlateElement
      className={cn('h-full', isDragging && 'opacity-50')}
      {...props}
    >
      <tr className="group relative h-full border-none">
        {children}
      </tr>
    </PlateElement>
  );
}

// Componente de celda de tabla de solo lectura
export function ReadOnlyTableCellElement({
  isHeader,
  ...props
}: PlateElementProps<TTableCellElement> & {
  isHeader?: boolean;
}) {
  const { element } = props;
  const {
    borders,
    colIndex,
    colSpan,
    isSelectingCell,
    rowIndex,
    selected,
  } = useTableCellElement();

  const Tag = isHeader ? 'th' : 'td';

  return (
    <PlateElement
      className={cn(
        'relative overflow-visible border-none bg-white p-0 dark:bg-slate-900',
        selected && 'bg-blue-100 dark:bg-blue-900',
        'before:absolute before:inset-0 before:z-10 before:border before:border-slate-300 dark:before:border-slate-600',
        borders &&
          cn(
            borders.bottom?.size &&
              `before:border-b-${borders.bottom.size} before:border-b-${borders.bottom.color}`,
            borders.left?.size &&
              `before:border-l-${borders.left.size} before:border-l-${borders.left.color}`,
            borders.right?.size &&
              `before:border-r-${borders.right.size} before:border-r-${borders.right.color}`,
            borders.top?.size &&
              `before:border-t-${borders.top.size} before:border-t-${borders.top.color}`
          )
      )}
      {...props}
    >
      <Tag
        className={cn(
          'relative z-20 box-border h-full min-h-[48px] w-full border-none bg-transparent p-2 align-top',
          isHeader && 'text-left font-normal'
        )}
        colSpan={colSpan}
        style={{
          backgroundColor: element.background as string,
        }}
      >
        <div className="relative z-30">{props.children}</div>
      </Tag>
    </PlateElement>
  );
}

// Componente de encabezado de celda de tabla de solo lectura
export function ReadOnlyTableCellHeaderElement(
  props: React.ComponentProps<typeof ReadOnlyTableCellElement>
) {
  return <ReadOnlyTableCellElement {...props} isHeader />;
}