import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

type TabHeadingProps = {
  children: ReactNode;
  id?: string;
  className?: string;
};


export function TabHeading({ children, id, className }: TabHeadingProps) {
  return (
    <div className={cn('flex items-end', className)}>
      <h2
        id={id}
        className="rounded-tr-md border-2 border-b-0 border-ink bg-paper-muted px-3 pt-1 pb-0.5 text-xl font-bold tracking-wide uppercase lg:flex lg:h-[32px] lg:w-[168px] lg:items-center lg:pt-0 lg:pb-0 lg:pl-[10px] lg:text-[1.2rem]"
      >
        {children}
      </h2>
      <span aria-hidden="true" className="flex-1 border-b-2 border-ink" />
    </div>
  );
}
