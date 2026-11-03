import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

type BracketedProps = {
  children: ReactNode;
  className?: string;
  /** Extra classes for the `[` `]` glyphs, e.g. to hide them on narrow screens. */
  bracketClassName?: string;
};

export function Bracketed({
  children,
  className,
  bracketClassName,
}: BracketedProps) {
  const bracketClass = cn(
    'text-[1.4em] leading-none font-medium',
    bracketClassName
  );

  return (
    <span className={cn('inline-flex items-center gap-[0.2em]', className)}>
      <span aria-hidden="true" className={bracketClass}>
        [
      </span>
      {children}
      <span aria-hidden="true" className={bracketClass}>
        ]
      </span>
    </span>
  );
}
