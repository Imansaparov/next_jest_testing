'use client';

import { useCallback } from 'react';

import { motion } from 'motion/react';

import { formatCurrency } from '@/shared/lib/format';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux';
import { Button } from '@/shared/ui/button';
import { Dialog } from '@/shared/ui/dialog';
import { CheckIcon } from '@/shared/ui/icons';

import { getPaymentMethodLabel } from '../../config/payment-methods';
import {
  checkoutReset,
  selectCheckoutStatus,
  selectLastOrder,
} from '../../model/checkout.slice';

export function OrderSuccessDialog() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectCheckoutStatus);
  const order = useAppSelector(selectLastOrder);

  const handleClose = useCallback(() => {
    dispatch(checkoutReset());
  }, [dispatch]);

  return (
    <Dialog
      open={status === 'succeeded' && order !== null}
      onClose={handleClose}
      title="Order placed!"
    >
      {order ? (
        <div className="mt-4 flex flex-col gap-4">
          <motion.span
            className="mx-auto grid size-16 place-items-center rounded-full border-2 border-ink bg-fern text-paper"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 16,
              delay: 0.1,
            }}
          >
            <CheckIcon className="size-9" />
          </motion.span>

          <p className="text-center text-lg font-medium">
            Thank you, {order.customerName}! Your tiles are heading to the kiln.
            A confirmation was sent to{' '}
            <span className="font-bold">{order.email}</span>.
          </p>

          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-lg border-2 border-ink bg-paper-muted px-4 py-3 font-semibold uppercase">
            <dt>Order</dt>
            <dd className="text-right tabular-nums">{order.id}</dd>
            <dt>Collections</dt>
            <dd className="text-right">{order.itemCount}</dd>
            <dt>Payment</dt>
            <dd className="text-right">
              {getPaymentMethodLabel(order.paymentMethod)}
            </dd>
            <dt>Grand total</dt>
            <dd className="text-right tabular-nums">
              {formatCurrency(order.grandTotal)}
            </dd>
          </dl>

          <Button onClick={handleClose} size="lg" className="w-full">
            Start a new order
          </Button>
        </div>
      ) : null}
    </Dialog>
  );
}
