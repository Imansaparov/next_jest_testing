'use client';

import { CartTotals, selectCartTotals } from '@/entities/cart';

import { cn } from '@/shared/lib/cn';
import { useAppSelector } from '@/shared/lib/redux';

type OrderSummaryTotalsProps = {
  className?: string;
};

export function OrderSummaryTotals({ className }: OrderSummaryTotalsProps) {
  const totals = useAppSelector(selectCartTotals);

  return (
    <div
      className={cn(
        'border-t-2 border-ink pt-2 lg:border-t-0 lg:pt-[12px]',
        className
      )}
    >
      <CartTotals totals={totals} variant="inline" className="ml-auto w-fit" />
    </div>
  );
}
