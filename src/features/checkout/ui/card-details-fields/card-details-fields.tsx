'use client';

import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/shared/lib/cn';
import { DecorImage } from '@/shared/ui/decor';
import { FieldError } from '@/shared/ui/field';

import { cardBrandsIcon } from '../../assets';
import {
  formatCardCvc,
  formatCardExpiry,
  formatCardNumber,
} from '../../lib/card-format';
import { useCheckoutField } from '../../model/use-checkout-field';

type CardInputProps = ComponentPropsWithoutRef<'input'> & {
  id: string;
  label: string;
  error?: string | undefined;
  labelHidden?: boolean;
};

function CardInput({
  id,
  label,
  error,
  labelHidden = false,
  className,
  ...props
}: CardInputProps) {
  const errorId = `${id}-error`;

  return (
    <div className={cn('flex min-w-0 flex-col gap-0.5', className)}>
      <label
        htmlFor={id}
        className={cn(
          'text-[0.68rem] leading-none font-semibold tracking-wide uppercase md:text-sm md:leading-4 lg:text-[0.72rem] lg:leading-none',
          labelHidden && 'sr-only'
        )}
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="h-[26px] w-full min-w-0 rounded-[5px] border-[1.5px] border-ink bg-paper px-2 text-[0.8rem] md:h-9 md:rounded-md md:border-2 md:px-2.5 md:text-base lg:h-[24px] lg:rounded-[4px] lg:border-[1.5px] lg:px-[7px] lg:text-[0.8rem] font-medium tracking-wider tabular-nums outline-none transition-colors placeholder:tracking-normal placeholder:text-ink-muted focus:border-navy focus:ring-2 focus:ring-navy/25 aria-invalid:border-terracotta"
        {...props}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function CardDetailsFields() {
  const cardNumber = useCheckoutField('cardNumber', formatCardNumber);
  const cardExpiry = useCheckoutField('cardExpiry', formatCardExpiry);
  const cardCvc = useCheckoutField('cardCvc', formatCardCvc);

  return (
    <div className="flex flex-col gap-[5px] md:gap-2 lg:gap-[6px]">
      <div className="flex items-center gap-1.5 md:gap-2 lg:gap-[7px]">
        <span
          aria-hidden="true"
          className="grid size-[13px] shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-paper md:size-5 md:border-2 lg:size-[15px] lg:border-[1.5px]"
        >
          <span className="size-[55%] rounded-full bg-ink" />
        </span>
        <DecorImage
          src={cardBrandsIcon}
          className="h-[20px] w-auto md:h-7 lg:h-[24px]"
        />
      </div>

      <CardInput
        {...cardNumber.inputProps}
        error={cardNumber.error}
        label="Card Number"
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder="1234 5678 9012 3456"
        required
      />

      <div className="grid grid-cols-2 gap-1.5 md:gap-2 lg:gap-[10px]">
        <CardInput
          {...cardExpiry.inputProps}
          error={cardExpiry.error}
          label="Expiration"
          labelHidden
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="EXPIRATION / YY"
          required
        />
        <CardInput
          {...cardCvc.inputProps}
          error={cardCvc.error}
          label="CVV"
          labelHidden
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder="CVV"
          required
        />
      </div>
    </div>
  );
}
