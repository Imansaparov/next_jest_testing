'use client';

import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/shared/lib/cn';

type AnimatedValueProps = {
  value: string;
  className?: string;
};

export function AnimatedValue({ value, className }: AnimatedValueProps) {
  return (
    <span
      className={cn('relative inline-flex overflow-hidden', className)}
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="inline-block tabular-nums"
          initial={{ y: '-90%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '90%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
