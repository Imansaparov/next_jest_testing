'use client';

import { type ChangeEvent, useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@/shared/lib/redux';

import {
  fieldBlurred,
  fieldChanged,
  selectCheckoutValues,
  selectVisibleFieldError,
} from './checkout.slice';
import type { CheckoutField } from './checkout.types';

export function getCheckoutFieldId(field: CheckoutField): string {
  return `checkout-${field}`;
}

export function useCheckoutField(
  field: CheckoutField,
  format?: (value: string) => string
) {
  const dispatch = useAppDispatch();
  const value = useAppSelector(state => selectCheckoutValues(state)[field]);
  const error = useAppSelector(state => selectVisibleFieldError(state, field));

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const raw = event.target.value;
      dispatch(fieldChanged({ field, value: format ? format(raw) : raw }));
    },
    [dispatch, field, format]
  );

  const onBlur = useCallback(() => {
    dispatch(fieldBlurred(field));
  }, [dispatch, field]);

  return {
    inputProps: {
      id: getCheckoutFieldId(field),
      name: field,
      value,
      onChange,
      onBlur,
    },
    error,
  };
}
