import type { StaticImageData } from 'next/image';

import {
  applePayIcon,
  applePayLargeIcon,
  bankIcon,
  bankLargeIcon,
  cardIcon,
  paypalIcon,
  paypalSmallIcon,
} from '../assets';
import type { PaymentMethod } from '../model/checkout.types';

export type PaymentMethodOption = {
  id: PaymentMethod;
  label: string;
  icon: StaticImageData;
  desktopIcon: StaticImageData | null;
  desktopLayout: 'inline' | 'card';
  hint: string;
};

export const PAYMENT_METHOD_OPTIONS: readonly PaymentMethodOption[] = [
  {
    id: 'credit-card',
    label: 'Credit/Debit Card',
    icon: cardIcon,
    desktopIcon: null,
    desktopLayout: 'inline',
    hint: 'Visa and Mastercard are accepted.',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    icon: paypalIcon,
    desktopIcon: paypalSmallIcon,
    desktopLayout: 'inline',
    hint: 'You will be redirected to PayPal to approve the payment.',
  },
  {
    id: 'apple-pay',
    label: 'Apple Pay',
    icon: applePayIcon,
    desktopIcon: applePayLargeIcon,
    desktopLayout: 'card',
    hint: 'Confirm the payment with Face ID or Touch ID on your device.',
  },
  {
    id: 'bank-transfer',
    label: 'Bank Transfer',
    icon: bankIcon,
    desktopIcon: bankLargeIcon,
    desktopLayout: 'card',
    hint: 'Bank details will be emailed to you. Tiles are fired once payment clears.',
  },
];

export function getPaymentMethodLabel(method: PaymentMethod): string {
  return (
    PAYMENT_METHOD_OPTIONS.find(option => option.id === method)?.label ?? method
  );
}
