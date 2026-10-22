'use client';

import { type DragEvent, type KeyboardEvent, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import {
  cellActivated,
  cellCleared,
  selectGridCells,
  selectGridColumns,
  selectGridRows,
  selectIsErasing,
  selectSelectedDesignId,
  tileMoved,
  tilePlaced,
  toPosition,
} from '@/entities/design-grid';
import { TILE_CATALOG, TileArt } from '@/entities/tile';

import { cn } from '@/shared/lib/cn';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux';

import {
  hasDragPayload,
  readDragPayload,
  writeDragPayload,
} from '../../lib/drag-data';

const ARROW_OFFSETS: Record<string, [row: number, column: number]> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

type DesignGridBoardProps = {
  className?: string;
};

export function DesignGridBoard({ className }: DesignGridBoardProps) {
  const dispatch = useAppDispatch();
  const cells = useAppSelector(selectGridCells);
  const columns = useAppSelector(selectGridColumns);
  const rows = useAppSelector(selectGridRows);
  const selectedDesignId = useAppSelector(selectSelectedDesignId);
  const isErasing = useAppSelector(selectIsErasing);

  const [focusIndex, setFocusIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusCell = (index: number) => {
    setFocusIndex(index);
    cellRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    const offset = ARROW_OFFSETS[event.key];

    if (offset) {
      event.preventDefault();
      const { row, column } = toPosition(index, columns);
      const nextRow = Math.min(rows - 1, Math.max(0, row + offset[0]));
      const nextColumn = Math.min(columns - 1, Math.max(0, column + offset[1]));
      focusCell(nextRow * columns + nextColumn);
      return;
    }

    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      dispatch(cellCleared(index));
    }
  };

  const handleDragOver = (event: DragEvent, index: number) => {
    if (!hasDragPayload(event.dataTransfer)) return;

    event.preventDefault();
    setDropIndex(index);
  };

  const handleDrop = (event: DragEvent, index: number) => {
    event.preventDefault();
    setDropIndex(null);

    const payload = readDragPayload(event.dataTransfer);
    if (!payload) return;

    if (payload.source === 'palette') {
      dispatch(tilePlaced({ index, designId: payload.designId }));
    } else {
      dispatch(tileMoved({ from: payload.index, to: index }));
    }
  };

  return (
    <div
      role="group"
      aria-label={`Design grid, ${columns} by ${rows}. Click a cell to place the selected tile.`}
      className={cn('grid grid-cols-7 bg-paper-muted', className)}
      onMouseLeave={() => setHoverIndex(null)}
    >
      {cells.map((designId, index) => {
        const { row, column } = toPosition(index, columns);
        const name = designId ? TILE_CATALOG[designId].name : 'empty';
        const showPreview = !designId && !isErasing && hoverIndex === index;

        return (
          <button
            key={index}
            ref={element => {
              cellRefs.current[index] = element;
            }}
            type="button"
            tabIndex={index === focusIndex ? 0 : -1}
            aria-label={`Row ${row + 1}, column ${column + 1}: ${name}`}
            draggable={designId !== null}
            onClick={() => {
              setFocusIndex(index);
              dispatch(cellActivated(index));
            }}
            onContextMenu={event => {
              event.preventDefault();
              dispatch(cellCleared(index));
            }}
            onKeyDown={event => handleKeyDown(event, index)}
            onMouseEnter={() => setHoverIndex(index)}
            onDragStart={event =>
              writeDragPayload(event.dataTransfer, { source: 'cell', index })
            }
            onDragOver={event => handleDragOver(event, index)}
            onDragLeave={() => setDropIndex(null)}
            onDrop={event => handleDrop(event, index)}
            className={cn(
              'relative aspect-[52/56] cursor-pointer overflow-hidden border-r-2 border-b-2 border-ink outline-none focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-navy focus-visible:ring-inset',
              dropIndex === index && 'z-10 ring-3 ring-mustard ring-inset',
              isErasing && designId && 'hover:opacity-70'
            )}
          >
            <AnimatePresence initial={false}>
              {designId ? (
                <motion.span
                  key={designId}
                  className="absolute inset-0"
                  initial={{ scale: 0.3, rotate: -25, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.3, rotate: 20, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                >
                  <TileArt
                    designId={designId}
                    variant="grid"
                    className="size-full"
                  />
                </motion.span>
              ) : null}
            </AnimatePresence>

            {showPreview ? (
              <span className="pointer-events-none absolute inset-0 opacity-35">
                <TileArt
                  designId={selectedDesignId}
                  variant="grid"
                  className="size-full"
                />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
