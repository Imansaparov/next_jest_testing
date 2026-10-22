'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { itemAdded, selectCartDesignIds } from '@/entities/cart';
import { PALETTE_DESIGN_IDS, TILE_CATALOG, TileArt } from '@/entities/tile';

import { addTileSwatch } from '@/shared/assets/decor';
import { cn } from '@/shared/lib/cn';
import { formatCurrency } from '@/shared/lib/format';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux';
import { DecorImage } from '@/shared/ui/decor';
import { PlusIcon } from '@/shared/ui/icons';

const NEW_ITEM_QUANTITY = 10;

type AddTileMenuProps = {
  className?: string;
};

export function AddTileMenu({ className }: AddTileMenuProps) {
  const dispatch = useAppDispatch();
  const cartDesignIds = useAppSelector(selectCartDesignIds);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const availableDesigns = useMemo(
    () =>
      PALETTE_DESIGN_IDS.filter(id => !cartDesignIds.includes(id)).map(
        id => TILE_CATALOG[id]
      ),
    [cartDesignIds]
  );

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const isDisabled = availableDesigns.length === 0;

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        disabled={isDisabled}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={() => setOpen(value => !value)}
        className="flex cursor-pointer items-center gap-1 rounded-[4px] border-[1.5px] border-ink bg-paper-muted py-[1px] pr-2 pl-1 md:gap-1.5 md:rounded-md md:border-2 md:py-1 md:pr-2 md:pl-1.5 text-left shadow-press transition-colors hover:bg-paper-deep focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-50"
      >
        <PlusIcon className="size-3 shrink-0 md:size-4" />
        <DecorImage
          src={addTileSwatch}
          className="size-[18px] shrink-0 md:size-6"
        />
        <span className="text-[0.72rem] leading-[0.95] font-semibold tracking-wide whitespace-nowrap uppercase md:text-[0.85rem] md:leading-[1.05] lg:text-[0.8rem]">
          Add new tile
          <br />
          to cart
        </span>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Choose a tile collection"
            className="absolute bottom-full left-0 z-30 mb-2 max-h-[min(20rem,55vh)] w-72 origin-bottom-left overflow-y-auto rounded-lg border-2 border-ink bg-paper p-1.5 shadow-frame"
            initial={{ opacity: 0, scale: 0.92, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ type: 'spring', stiffness: 500, damping: 34 }}
          >
            {availableDesigns.map(design => (
              <button
                key={design.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  dispatch(
                    itemAdded({
                      designId: design.id,
                      quantity: NEW_ITEM_QUANTITY,
                    })
                  );
                  setOpen(false);
                }}
                className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-paper-muted focus-visible:bg-paper-muted focus-visible:outline-none"
              >
                <TileArt
                  designId={design.id}
                  className="size-9 shrink-0 rounded-sm border-2 border-ink"
                />
                <span className="flex-1 leading-tight font-semibold uppercase">
                  {design.name}
                </span>
                <span className="text-sm font-medium text-ink-soft tabular-nums">
                  {formatCurrency(design.unitPrice)}/ft²
                </span>
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
