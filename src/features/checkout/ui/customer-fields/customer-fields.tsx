'use client';

import { cn } from '@/shared/lib/cn';
import { TextField } from '@/shared/ui/field';

import { useCheckoutField } from '../../model/use-checkout-field';

type CustomerFieldsProps = {
  className?: string;
};

export function CustomerFields({ className }: CustomerFieldsProps) {
  const customerName = useCheckoutField('customerName');
  const phone = useCheckoutField('phone');
  const email = useCheckoutField('email');
  const shippingAddress = useCheckoutField('shippingAddress');
  const addressLine2 = useCheckoutField('addressLine2');

  return (
    <fieldset
      className={cn(
        'flex min-w-0 flex-col gap-px md:gap-[7px] lg:gap-[2px]',
        className
      )}
    >
      <legend className="sr-only">Customer details</legend>

      <TextField
        {...customerName.inputProps}
        error={customerName.error}
        label="Customer Name:"
        autoComplete="name"
        required
      />

      <div className="grid grid-cols-1 gap-px min-[360px]:grid-cols-[1.1fr_1fr] min-[360px]:gap-x-4 md:gap-[7px] lg:grid-cols-[1.06fr_1fr] lg:gap-x-[6px] lg:gap-y-[2px]">
        <TextField
          {...phone.inputProps}
          error={phone.error}
          label="Phone:"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
        />
        <TextField
          {...email.inputProps}
          error={email.error}
          label="Email:"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
        />
      </div>

      <TextField
        {...shippingAddress.inputProps}
        error={shippingAddress.error}
        label="Shipping Address:"
        autoComplete="street-address"
        required
      />

      <input
        {...addressLine2.inputProps}
        aria-label="Address line 2 (optional)"
        autoComplete="address-line2"
        className="h-[18px] w-full border-b-[1.5px] border-ink md:h-6 md:border-b-2 bg-transparent px-1 font-medium outline-none focus:border-navy focus:bg-paper-muted/60 lg:hidden"
      />
    </fieldset>
  );
}
