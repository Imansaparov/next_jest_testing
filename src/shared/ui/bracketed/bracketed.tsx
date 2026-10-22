import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

type BracketedProps = {
  children: ReactNode;
  className?: string;
};

export function Bracketed({ children, className }: BracketedProps) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span
        aria-hidden="true"
        className="text-[1.4em] leading-none font-medium"
      >
        [
      </span>
      {children}
      <span
        aria-hidden="true"
        className="text-[1.4em] leading-none font-medium"
      >
        ]
      </span>
    </span>
  );
}
