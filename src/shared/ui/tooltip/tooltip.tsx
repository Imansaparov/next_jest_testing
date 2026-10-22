'use client';

import { type ReactNode, useId, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';
import { createPortal } from 'react-dom';

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
};

type Position = { left: number; top: number };

const GAP = 8;
const VIEWPORT_MARGIN = 8;
const MAX_WIDTH = 220;


export function Tooltip({ content, children }: TooltipProps) {
  const id = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<Position | null>(null);

  const show = () => {
    const rect = anchorRef.current?.getBoundingClientRect();
    if (!rect) return;

    const half = MAX_WIDTH / 2;
    const center = rect.left + rect.width / 2;
    const left = Math.min(
      Math.max(center, VIEWPORT_MARGIN + half),
      window.innerWidth - VIEWPORT_MARGIN - half
    );
    setPosition({ left, top: rect.top - GAP });
  };
  const hide = () => setPosition(null);

  return (
  
    <span
      ref={anchorRef}
      className="inline-flex"
      aria-describedby={position ? id : undefined}
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {typeof document === 'undefined'
        ? null
        : createPortal(
            <AnimatePresence>
              {position ? (
                <motion.span
                  key="tooltip"
                  id={id}
                  role="tooltip"
                  className="pointer-events-none fixed z-[60] flex w-max max-w-[220px] -translate-x-1/2 -translate-y-full justify-center"
                  style={{ left: position.left, top: position.top }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="rounded-md border-2 border-ink bg-ink px-2 py-1 text-center text-[0.78rem] leading-tight font-semibold text-paper shadow-tile">
                    {content}
                  </span>
                </motion.span>
              ) : null}
            </AnimatePresence>,
            document.body
          )}
    </span>
  );
}
