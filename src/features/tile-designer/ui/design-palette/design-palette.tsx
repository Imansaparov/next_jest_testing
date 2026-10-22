'use client';

import {
  designSelected,
  selectIsErasing,
  selectSelectedDesignId,
} from '@/entities/design-grid';
import { PALETTE_DESIGN_IDS, TILE_CATALOG, TileArt } from '@/entities/tile';

import { cn } from '@/shared/lib/cn';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux';

import { writeDragPayload } from '../../lib/drag-data';

type DesignPaletteProps = {
  className?: string;
};

export function DesignPalette({ className }: DesignPaletteProps) {
  const dispatch = useAppDispatch();
  const selectedDesignId = useAppSelector(selectSelectedDesignId);
  const isErasing = useAppSelector(selectIsErasing);

  return (
    <ul
      aria-label="Design palette"
      className={cn(
        'grid grid-cols-2 content-start gap-[10px] overflow-y-auto px-[9px] py-[10px] [scrollbar-color:theme(colors.navy.DEFAULT)_transparent] [scrollbar-width:thin]',
        className
      )}
    >
      {PALETTE_DESIGN_IDS.map(designId => {
        const isSelected = !isErasing && selectedDesignId === designId;
        const { name } = TILE_CATALOG[designId];

        return (
          <li key={designId}>
            <button
              type="button"
              draggable
              aria-pressed={isSelected}
              aria-label={name}
              title={name}
              onClick={() => dispatch(designSelected(designId))}
              onDragStart={event => {
                writeDragPayload(event.dataTransfer, {
                  source: 'palette',
                  designId,
                });
                dispatch(designSelected(designId));
              }}
              className={cn(
                'block aspect-[52/54] w-full cursor-grab overflow-hidden rounded-[2px] border-2 border-ink transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-tile focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-navy active:cursor-grabbing',
                isSelected &&
                  'scale-[1.04] shadow-tile ring-3 ring-navy ring-offset-2 ring-offset-paper-muted'
              )}
            >
              <TileArt
                designId={designId}
                variant="grid"
                className="size-full"
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
