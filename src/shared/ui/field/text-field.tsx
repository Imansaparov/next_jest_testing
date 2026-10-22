'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import { FieldError } from './field-error';

type TextFieldProps = Omit<ComponentPropsWithRef<'input'>, 'id'> & {
  id: string;
  label: ReactNode;
  error?: string | undefined;
  inputClassName?: string;
};


export function TextField({
  id,
  label,
  error,
  className,
  inputClassName,
  ...inputProps
}: TextFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={cn('flex min-w-0 flex-col', className)}>
      <div className="flex min-w-0 items-end gap-1.5 md:gap-2 lg:gap-1">
        <label
          htmlFor={id}
          className="shrink-0 text-[0.86rem] leading-[17px] font-semibold tracking-wide uppercase md:text-base md:leading-6 lg:pb-0 lg:text-[0.8rem] lg:leading-[15px]"
        >
          {label}
        </label>
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-[18px] w-full min-w-0 flex-1 border-b-[1.5px] border-ink bg-transparent px-1 text-[0.86rem] leading-[17px] font-medium md:h-6 md:border-b-2 md:text-base md:leading-6 lg:h-[17px] lg:border-b-[1.5px] lg:text-[0.8rem] lg:leading-[15px] transition-colors outline-none placeholder:text-ink-muted/70 focus:border-navy focus:bg-paper-muted/60 aria-invalid:border-terracotta',
            inputClassName
          )}
          {...inputProps}
        />
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
