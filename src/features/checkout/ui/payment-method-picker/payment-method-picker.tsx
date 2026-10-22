'use client';

import { useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/shared/lib/cn';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux';
import { DecorImage } from '@/shared/ui/decor';

import {
  PAYMENT_METHOD_OPTIONS,
  type PaymentMethodOption,
} from '../../config/payment-methods';
import {
  paymentMethodSelected,
  selectPaymentMethod,
  selectSubmitAttempted,
} from '../../model/checkout.slice';
import { CardDetailsFields } from '../card-details-fields/card-details-fields';

const desktopOrder = ['lg:order-1', 'lg:order-2', 'lg:order-4', 'lg:order-5'];

type PaymentOptionProps = {
  option: PaymentMethodOption;
  index: number;
  checked: boolean;
  onSelect: () => void;
};

function PaymentOption({
  option,
  index,
  checked,
  onSelect,
}: PaymentOptionProps) {
  const { desktopIcon, desktopLayout } = option;
  const isInline = desktopLayout === 'inline';

  return (
    <label
      className={cn(
        'relative flex min-h-[61px] cursor-pointer flex-col items-center justify-center gap-[3px] px-1 py-[3px] text-center transition-colors has-focus-visible:outline-3 has-focus-visible:-outline-offset-4 has-focus-visible:outline-navy sm:min-h-28 sm:gap-2 md:min-h-24',
        index > 0 && 'border-l-2 border-ink',
        checked ? 'bg-paper-muted' : 'hover:bg-paper-muted/50',
        desktopOrder[index],
        isInline
          ? 'lg:min-h-0 lg:flex-row lg:justify-start lg:gap-[7px] lg:border-0 lg:bg-transparent lg:p-0 lg:text-left lg:hover:bg-transparent'
          : 'lg:h-[76px] lg:min-h-0 lg:gap-[3px] lg:rounded-[6px] lg:border-2 lg:border-ink lg:p-0 lg:pt-1'
      )}
    >
      <input
        type="radio"
        name="paymentMethod"
        value={option.id}
        checked={checked}
        onChange={onSelect}
        onClick={onSelect}
        className="peer sr-only"
      />

      <span className="flex w-full items-center justify-center gap-[9px] sm:gap-3 lg:contents">
        <span
          aria-hidden="true"
          className={cn(
            'grid size-[13px] shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-paper sm:size-6 sm:border-2 lg:size-[15px] lg:border-[1.5px]',
            checked && 'lg:bg-navy-muted',
            !isInline && 'lg:absolute lg:top-[17px] lg:left-[9px]'
          )}
        >
          <AnimatePresence initial={false}>
            {checked ? (
              <motion.span
                className="size-[55%] rounded-full bg-ink lg:hidden"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 600, damping: 30 }}
              />
            ) : null}
          </AnimatePresence>
        </span>
        <DecorImage
          src={option.icon}
          className={cn(
            'h-[27px] w-auto max-w-[60%] object-contain sm:h-11 lg:hidden',
            option.id === 'credit-card' && 'h-[25px] sm:h-12'
          )}
        />
      </span>

      {desktopIcon ? (
        <DecorImage
          src={desktopIcon}
          className={cn(
            'hidden w-auto lg:block',
            isInline ? 'h-[18px]' : 'h-[30px]'
          )}
        />
      ) : null}

      <span className="max-w-full text-[0.7rem] leading-[1.05] font-semibold max-md:max-w-[62px] tracking-wide uppercase sm:text-base md:text-[0.95rem] lg:text-[0.82rem] lg:leading-none">
        {option.label}
      </span>
    </label>
  );
}

type PaymentMethodPickerProps = {
  className?: string;
};

export function PaymentMethodPicker({ className }: PaymentMethodPickerProps) {
  const dispatch = useAppDispatch();
  const paymentMethod = useAppSelector(selectPaymentMethod);
  const submitAttempted = useAppSelector(selectSubmitAttempted);
  const [hasInteracted, setHasInteracted] = useState(false);
  const detailsVisibleOnMobile = hasInteracted || submitAttempted;

  return (
    <fieldset className={cn('min-w-0', className)}>
      <legend className="block">
        <span className="inline-block border-2 border-b-0 border-ink bg-paper-muted px-[5px] pt-px pb-0 text-[0.8rem] leading-[17px] font-bold tracking-wide uppercase sm:px-2 sm:text-xl md:text-lg lg:mb-[10px] lg:ml-[-5px] lg:rounded-[5px] lg:border-b-2 lg:px-[7px] lg:py-[2px] lg:text-[0.82rem]">
          Select Payment Method:
        </span>
      </legend>

      <div className="grid grid-cols-4 lg:grid-cols-2 lg:gap-x-[10px] lg:gap-y-[10px]">
        <div className="col-span-4 grid grid-cols-4 border-2 border-ink lg:contents">
          {PAYMENT_METHOD_OPTIONS.map((option, index) => (
            <PaymentOption
              key={option.id}
              option={option}
              index={index}
              checked={option.id === paymentMethod}
              onSelect={() => {
                setHasInteracted(true);
                dispatch(paymentMethodSelected(option.id));
              }}
            />
          ))}
        </div>

        <div
          className={cn(
            'col-span-4 md:block lg:order-3 lg:col-span-2',
            !detailsVisibleOnMobile && 'hidden'
          )}
        >
     
          <div className="mt-2 grid rounded-[6px] border-[1.5px] border-ink bg-paper-muted px-2 py-[7px] md:mt-3 md:rounded-lg md:border-2 md:p-3 lg:mt-0 lg:rounded-[6px] lg:px-[9px] lg:pt-[7px] lg:pb-[8px]">
            {PAYMENT_METHOD_OPTIONS.map(option => {
              const isActive = option.id === paymentMethod;

              return (
                <motion.div
                  key={option.id}
                  aria-hidden={!isActive}
                  inert={!isActive}
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'col-start-1 row-start-1 min-w-0',
                    !isActive && 'pointer-events-none',
                    option.id !== 'credit-card' &&
                      'flex items-center text-sm font-medium lg:text-[0.8rem]'
                  )}
                >
                  {option.id === 'credit-card' ? (
                    <CardDetailsFields />
                  ) : (
                    <p>{option.hint}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </fieldset>
  );
}
