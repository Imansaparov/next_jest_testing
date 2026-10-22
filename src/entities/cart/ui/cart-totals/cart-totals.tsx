import { cn } from '@/shared/lib/cn';
import { formatCurrency } from '@/shared/lib/format';
import { AnimatedValue } from '@/shared/ui/animated-value';
import { Bracketed } from '@/shared/ui/bracketed';

import type { CartTotals as CartTotalsValue } from '../../model/cart.types';

type CartTotalsProps = {
  totals: CartTotalsValue;
  variant?: 'boxed' | 'inline';
  className?: string;
};

export function CartTotals({
  totals,
  variant = 'boxed',
  className,
}: CartTotalsProps) {
  const rows = [
    { key: 'subtotal', label: 'Subtotal', value: totals.subtotal },
    {
      key: 'shipping',
      label: 'Shipping',
      value: totals.shipping,
    },
    { key: 'grand-total', label: 'Grand Total', value: totals.grandTotal },
  ] as const;

  return (
    <dl
      className={cn(
        'grid grid-cols-[1fr_auto] items-stretch font-semibold uppercase',
        variant === 'inline' &&
          'gap-y-0.5 text-[1.05rem] lg:gap-y-0 lg:text-[0.82rem] lg:leading-[20px]',
        className
      )}
    >
      {rows.map(row => {
        const isGrandTotal = row.key === 'grand-total';
        const formatted = formatCurrency(row.value);

        return (
          <div key={row.key} className="contents">
            <dt
              className={cn(
                'flex items-center justify-end pr-1.5 tracking-wide whitespace-nowrap md:pr-2',
                variant === 'boxed' &&
                  'text-[0.72rem] md:text-[0.95rem] lg:text-[0.85rem]'
              )}
            >
              {row.label}:
            </dt>
            <dd
              data-testid={`cart-${row.key}`}
              className={cn(
                'flex items-center justify-end',
                variant === 'boxed' &&
                  'min-w-[54px] border-x-[1.5px] border-b-[1.5px] border-ink px-0.5 py-0 text-[0.66rem] leading-[16px] whitespace-nowrap md:border-x-2 md:border-b-2 md:py-0.5 md:leading-normal md:min-w-24 md:px-1.5 md:text-[0.9rem] lg:min-w-[72px] lg:px-1 lg:text-[0.78rem]',
                variant === 'boxed' &&
                  row.key === 'subtotal' &&
                  'border-t-[1.5px] md:border-t-2',
                variant === 'boxed' && isGrandTotal && 'bg-paper-muted'
              )}
            >
              <Bracketed className="w-full justify-between">
                <AnimatedValue value={formatted} />
              </Bracketed>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
