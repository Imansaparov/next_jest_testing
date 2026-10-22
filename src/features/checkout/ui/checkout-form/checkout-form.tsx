'use client';

import type { FormEvent, ReactNode } from 'react';

import { useAppDispatch } from '@/shared/lib/redux';

import { placeOrder } from '../../model/checkout.slice';
import { getCheckoutFieldId } from '../../model/use-checkout-field';
import { OrderSuccessDialog } from '../order-success-dialog/order-success-dialog';

type CheckoutFormProps = {
  children: ReactNode;
  className?: string;
};

export function CheckoutForm({ children, className }: CheckoutFormProps) {
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = await dispatch(placeOrder());

    if (
      placeOrder.rejected.match(result) &&
      result.payload?.reason === 'invalid'
    ) {
      document
        .getElementById(getCheckoutFieldId(result.payload.firstInvalidField))
        ?.focus();
    }
  };

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit}
        className={className}
        aria-label="Ceramic tile order"
      >
        {children}
      </form>
      <OrderSuccessDialog />
    </>
  );
}
