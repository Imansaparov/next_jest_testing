'use client';

import type { CSSProperties } from 'react';

import { cn } from '@/shared/lib/cn';
import { useScrollThumbs } from '@/shared/lib/scroll';

import { DesignGridBoard } from '../design-grid-board/design-grid-board';

const thumbClass =
  'absolute cursor-grab touch-none rounded-full bg-navy transition-opacity active:cursor-grabbing';

export function DesignCanvas() {
  const { viewportRef, state, startDrag } = useScrollThumbs<HTMLDivElement>();

  return (
    <>
      <div className="flex min-h-0">
        <div
          ref={viewportRef}
          className="aspect-[364/336] min-w-0 flex-1 overflow-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <DesignGridBoard className="w-full min-w-[364px] lg:min-w-0" />
        </div>

        {/* vertical scrollbar */}
        <div
          aria-hidden="true"
          className="relative w-[21px] shrink-0 border-l-2 border-ink bg-paper"
        >
          <span
            onPointerDown={startDrag('y')}
            style={{ '--progress': state.y } as CSSProperties}
            className={cn(
              thumbClass,
              'top-[calc(4px+var(--progress)*(61%-8px))] left-[3px] h-[39%] w-[11px]',
              !state.canScrollY && 'opacity-40'
            )}
          />
        </div>
      </div>

      <div className="relative h-[26px] border-t-2 border-ink">
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 h-[11px] w-[34%] -translate-x-1/2 -translate-y-1/2"
        >
          <span
            onPointerDown={startDrag('x')}
            style={
              {
                '--progress': state.canScrollX ? state.x : 0.5,
              } as CSSProperties
            }
            className={cn(
              thumbClass,
              'top-0 left-[calc(var(--progress)*54%)] h-full w-[46%]'
            )}
          />
        </div>
      </div>
    </>
  );
}
