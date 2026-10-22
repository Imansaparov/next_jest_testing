'use client';

import { useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { selectGridCells } from '@/entities/design-grid';

import { desktopGridHand } from '@/shared/assets/decor';
import { cn } from '@/shared/lib/cn';
import { useAppSelector } from '@/shared/lib/redux';
import { DecorImage } from '@/shared/ui/decor';

type DragHintProps = {
  className?: string;
};

export function DragHint({ className }: DragHintProps) {
  const cells = useAppSelector(selectGridCells);
  const [initialCells] = useState(cells);
  const isUntouched = cells === initialCells;

  return (
    <AnimatePresence>
      {isUntouched ? (
        <motion.div
          className={cn('pointer-events-none absolute z-10', className)}
          initial={false}
          animate={{ y: [0, -6, 0] }}
          exit={{ opacity: 0, y: 24, transition: { duration: 0.3 } }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <DecorImage src={desktopGridHand} className="h-auto w-full" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
