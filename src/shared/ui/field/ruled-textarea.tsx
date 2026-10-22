import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/lib/cn';

type RuledTextareaProps = ComponentPropsWithRef<'textarea'>;

export function RuledTextarea({ className, ...props }: RuledTextareaProps) {
  return (
    <textarea
      className={cn(
        'block w-full resize-none bg-transparent bg-ruled bg-local px-1 text-base leading-8 font-medium outline-none focus:bg-paper-muted/60',
        className
      )}
      {...props}
    />
  );
}
