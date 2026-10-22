'use client';

import { useEffect } from 'react';

import { AnimatePresence, motion, useAnimate } from 'motion/react';

import { cn } from '@/shared/lib/cn';
import { useAppSelector } from '@/shared/lib/redux';
import { Button } from '@/shared/ui/button';
import { SpinnerIcon } from '@/shared/ui/icons';

import {
  selectCheckoutStatus,
  selectFormError,
} from '../../model/checkout.slice';

type PlaceOrderButtonProps = {
  className?: string;
};

export function PlaceOrderButton({ className }: PlaceOrderButtonProps) {
  const status = useAppSelector(selectCheckoutStatus);
  const formError = useAppSelector(selectFormError);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const isSubmitting = status === 'submitting';

  useEffect(() => {
    if (status === 'failed' && scope.current) {
      void animate(
        scope.current,
        { x: [0, -10, 10, -6, 6, 0] },
        { duration: 0.4 }
      );
    }
  }, [status, animate, scope]);

  return (
    <div ref={scope} className={cn('flex flex-col gap-2', className)}>
      <AnimatePresence initial={false}>
        {formError ? (
          <motion.p
            role="alert"
            className="rounded-md border-2 border-terracotta bg-terracotta/10 px-3 py-1.5 text-center text-sm font-semibold text-terracotta-dark"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
          >
            {formError}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="w-full max-md:sr-only lg:h-[35px] lg:rounded-[6px] lg:text-[1.05rem]"
      >
        {isSubmitting ? <SpinnerIcon className="size-5 animate-spin" /> : null}
        {isSubmitting ? 'Placing Order…' : 'Place Secure Order'}
      </Button>
    </div>
  );
}
