'use client';

import { type ReactNode, useEffect, useId, useRef } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/shared/lib/cn';
import { CloseIcon } from '@/shared/ui/icons';

type DialogProps = {
  open: boolean;
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export function Dialog({
  open,
  title,
  onClose,
  children,
  className,
}: DialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/55 p-4 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={cn(
              'relative w-full max-w-md rounded-frame border-2 border-ink bg-paper p-6 shadow-frame outline-none',
              className
            )}
            initial={{ opacity: 0, y: 24, scale: 0.94, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={event => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 grid size-9 cursor-pointer place-items-center rounded-full text-ink-soft transition-colors hover:bg-paper-muted hover:text-ink"
              aria-label="Close dialog"
            >
              <CloseIcon className="size-5" />
            </button>
            <h2
              id={titleId}
              className="pr-8 font-display text-2xl leading-tight uppercase"
            >
              {title}
            </h2>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
