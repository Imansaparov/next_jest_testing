'use client';

import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export type ScrollAxis = 'x' | 'y';

export type ScrollThumbsState = {
  x: number;
  y: number;
  canScrollX: boolean;
  canScrollY: boolean;
};

const INITIAL_STATE: ScrollThumbsState = {
  x: 0,
  y: 0,
  canScrollX: false,
  canScrollY: false,
};


export function useScrollThumbs<T extends HTMLElement>() {
  const viewportRef = useRef<T>(null);
  const [state, setState] = useState<ScrollThumbsState>(INITIAL_STATE);

  const update = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const maxX = viewport.scrollWidth - viewport.clientWidth;
    const maxY = viewport.scrollHeight - viewport.clientHeight;

    setState({
      x: maxX > 0 ? viewport.scrollLeft / maxX : 0,
      y: maxY > 0 ? viewport.scrollTop / maxY : 0,
      canScrollX: maxX > 1,
      canScrollY: maxY > 1,
    });
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    update();
    viewport.addEventListener('scroll', update, { passive: true });
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(viewport);
    if (viewport.firstElementChild) {
      observer?.observe(viewport.firstElementChild);
    }

    return () => {
      viewport.removeEventListener('scroll', update);
      observer?.disconnect();
    };
  }, [update]);

  const startDrag = useCallback(
    (axis: ScrollAxis) => (event: ReactPointerEvent<HTMLElement>) => {
      const viewport = viewportRef.current;
      const thumb = event.currentTarget;
      const track = thumb.parentElement;
      if (!viewport || !track) return;

      event.preventDefault();
      thumb.setPointerCapture(event.pointerId);

      const isX = axis === 'x';
      const startPointer = isX ? event.clientX : event.clientY;
      const startScroll = isX ? viewport.scrollLeft : viewport.scrollTop;
      const trackRect = track.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();
      const travel = isX
        ? trackRect.width - thumbRect.width
        : trackRect.height - thumbRect.height;
      const maxScroll = isX
        ? viewport.scrollWidth - viewport.clientWidth
        : viewport.scrollHeight - viewport.clientHeight;

      const handleMove = (moveEvent: PointerEvent) => {
        const delta =
          (isX ? moveEvent.clientX : moveEvent.clientY) - startPointer;
        const next =
          startScroll + (travel > 0 ? (delta / travel) * maxScroll : 0);
        if (isX) viewport.scrollLeft = next;
        else viewport.scrollTop = next;
      };
      const handleUp = () => {
        thumb.removeEventListener('pointermove', handleMove);
        thumb.removeEventListener('pointerup', handleUp);
        thumb.removeEventListener('pointercancel', handleUp);
      };

      thumb.addEventListener('pointermove', handleMove);
      thumb.addEventListener('pointerup', handleUp);
      thumb.addEventListener('pointercancel', handleUp);
    },
    []
  );

  return { viewportRef, state, startDrag };
}
