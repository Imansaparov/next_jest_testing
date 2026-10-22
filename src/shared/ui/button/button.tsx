import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/shared/lib/cn';

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-2 border-navy-dark bg-navy text-paper shadow-[inset_0_0_0_2px_rgb(255_255_255/0.18)] hover:bg-navy-dark',
  outline:
    'border-2 border-ink bg-paper-muted text-ink shadow-press hover:bg-paper-deep active:translate-x-px active:translate-y-px active:shadow-none',
  ghost: 'text-ink hover:bg-paper-muted',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 rounded-md px-2.5 text-sm',
  md: 'h-10 gap-2 rounded-md px-4 text-base',
  lg: 'h-13 gap-2.5 rounded-lg px-6 text-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center font-semibold uppercase tracking-wide transition-[background-color,transform,box-shadow] duration-150 select-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
