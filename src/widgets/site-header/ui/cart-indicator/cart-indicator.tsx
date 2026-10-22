'use client';

import { AnimatePresence, motion } from 'motion/react';

import { selectCartItemCount } from '@/entities/cart';

import { useAppSelector } from '@/shared/lib/redux';
import { CartIcon } from '@/shared/ui/icons';

export function CartIndicator() {
  const count = useAppSelector(selectCartItemCount);

  return (
    <a
      href="#cart"
      className="relative grid size-[22px] place-items-center md:size-9 rounded-md transition-colors hover:bg-paper-deep"
      aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
    >
      <CartIcon className="size-[19px] md:size-7 lg:size-6" />
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={count}
          aria-hidden="true"
          className="absolute -top-1 -right-1 grid size-[11px] place-items-center rounded-full border border-ink bg-mustard text-[0.45rem] md:-top-0.5 md:right-0 md:size-4.5 md:border-[1.5px] md:text-[0.7rem] leading-none font-bold"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 600, damping: 22 }}
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </a>
  );
}
