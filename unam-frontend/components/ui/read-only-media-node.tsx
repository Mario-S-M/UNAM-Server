'use client';

import * as React from 'react';

import type {
  TAudioElement,
  TFileElement,
  TImageElement,
  TMediaEmbedElement,
  TPlaceholderElement,
  TVideoElement,
} from 'platejs';
import type { PlateElementProps } from 'platejs/react';

import { useDraggable } from '@platejs/dnd';
import {
  Image,
  useMediaState,
} from '@platejs/media/react';
import { ResizableProvider, useResizableValue } from '@platejs/resizable';
import { PlateElement, withHOC } from 'platejs/react';

import { cn } from '@/lib/utils';

import { Caption, CaptionTextarea } from './caption';
import {
  mediaResizeHandleVariants,
  Resizable,
  ResizeHandle,
} from './resize-handle';

// Componente de imagen de solo lectura sin barra de herramientas
export const ReadOnlyImageElement = withHOC(
  ResizableProvider,
  function ReadOnlyImageElement(props: PlateElementProps<TImageElement>) {
    const { align = 'center', focused, readOnly, selected } = useMediaState();
    const width = useResizableValue('width');

    const { isDragging, handleRef } = useDraggable({
      element: props.element,
    });

    return (
      <PlateElement {...props} className="py-2.5">
        <figure className="group relative m-0" contentEditable={false}>
          <Resizable
            align={align}
            options={{
              align,
              readOnly: true, // Siempre en modo solo lectura
            }}
          >
            <Image
              ref={handleRef}
              className={cn(
                'block w-full max-w-full object-cover px-0',
                'rounded-sm',
                focused && selected && 'ring-2 ring-ring ring-offset-2',
                isDragging && 'opacity-50'
              )}
              alt={props.attributes.alt as string | undefined}
            />
          </Resizable>

          <Caption style={{ width }} align={align}>
            <CaptionTextarea
              readOnly={true} // Siempre en modo solo lectura
              placeholder=""
            />
          </Caption>
        </figure>

        {props.children}
      </PlateElement>
    );
  }
);

// Componente de video de solo lectura sin barra de herramientas
export function ReadOnlyVideoElement(props: PlateElementProps<TVideoElement>) {
  const { isDragging, handleRef } = useDraggable({
    element: props.element,
  });

  return (
    <PlateElement {...props} className="py-2.5">
      <figure className="group relative m-0" contentEditable={false}>
        <video
          ref={handleRef}
          className={cn(
            'block w-full max-w-full object-cover px-0',
            'rounded-sm',
            isDragging && 'opacity-50'
          )}
          src={props.element.url}
          controls
        />
        {props.children}
      </figure>
    </PlateElement>
  );
}

// Componente de audio de solo lectura sin barra de herramientas
export function ReadOnlyAudioElement(props: PlateElementProps<TAudioElement>) {
  const { isDragging, handleRef } = useDraggable({
    element: props.element,
  });

  return (
    <PlateElement {...props} className="py-2.5">
      <figure className="group relative m-0" contentEditable={false}>
        <audio
          ref={handleRef}
          className={cn(
            'block w-full max-w-full rounded-sm',
            isDragging && 'opacity-50'
          )}
          src={props.element.url}
          controls
        />
        {props.children}
      </figure>
    </PlateElement>
  );
}

// Componente de archivo de solo lectura sin barra de herramientas
export function ReadOnlyFileElement(props: PlateElementProps<TFileElement>) {
  const { isDragging, handleRef } = useDraggable({
    element: props.element,
  });

  return (
    <PlateElement {...props} className="py-2.5">
      <figure className="group relative m-0" contentEditable={false}>
        <a
          ref={handleRef}
          href={props.element.url}
          download={props.element.name}
          className={cn(
            'block w-full max-w-full rounded-sm border p-4 text-center',
            isDragging && 'opacity-50'
          )}
        >
          📎 {props.element.name || 'Archivo'}
        </a>
        {props.children}
      </figure>
    </PlateElement>
  );
}

// Componente de media embed de solo lectura sin barra de herramientas
export function ReadOnlyMediaEmbedElement(
  props: PlateElementProps<TMediaEmbedElement>
) {
  const { isDragging, handleRef } = useDraggable({
    element: props.element,
  });

  return (
    <PlateElement {...props} className="py-2.5">
      <figure className="group relative m-0" contentEditable={false}>
        <iframe
          ref={handleRef}
          src={props.element.url}
          className={cn(
            'block w-full max-w-full rounded-sm aspect-video',
            isDragging && 'opacity-50'
          )}
          allowFullScreen
        />
        {props.children}
      </figure>
    </PlateElement>
  );
}

// Componente de placeholder de solo lectura sin barra de herramientas
export function ReadOnlyPlaceholderElement(
  props: PlateElementProps<TPlaceholderElement>
) {
  return (
    <PlateElement {...props} className="py-2.5">
      <div className="block w-full max-w-full rounded-sm border-2 border-dashed border-muted-foreground/25 p-8 text-center text-muted-foreground">
        Contenido multimedia
      </div>
      {props.children}
    </PlateElement>
  );
}