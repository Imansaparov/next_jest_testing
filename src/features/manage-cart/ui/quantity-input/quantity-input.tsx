'use client';

import { type ChangeEvent, type KeyboardEvent, useState } from 'react';

import { MAX_QUANTITY, quantityChanged } from '@/entities/cart';
import type { TileDesignId } from '@/entities/tile';

import { useAppDispatch } from '@/shared/lib/redux';
import { Bracketed } from '@/shared/ui/bracketed';

const MAX_DIGITS = String(MAX_QUANTITY).length;

type QuantityInputProps = {
  designId: TileDesignId;
  quantity: number;
  label: string;
};

export function QuantityInput({
  designId,
  quantity,
  label,
}: QuantityInputProps) {
  const dispatch = useAppDispatch();
  const [draft, setDraft] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, MAX_DIGITS);
    setDraft(digits);

    if (digits) {
      dispatch(quantityChanged({ designId, quantity: Number(digits) }));
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
    }
  };

  return (
    <Bracketed className="text-[0.9rem] font-semibold md:text-[0.95rem] xl:text-[1.1rem]">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={label}
        value={draft ?? String(quantity)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={event => event.currentTarget.select()}
        onBlur={() => setDraft(null)}
        className="w-[4.2ch] min-w-0 rounded-sm border-b-2 border-transparent bg-transparent text-center tabular-nums outline-none transition-colors hover:border-ink/30 focus:border-navy focus:bg-paper"
      />
    </Bracketed>
  );
}
