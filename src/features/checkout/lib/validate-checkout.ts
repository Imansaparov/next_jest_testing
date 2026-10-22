import type {
  CheckoutErrors,
  CheckoutField,
  CheckoutValues,
  PaymentMethod,
} from '../model/checkout.types';
import { digitsOnly, passesLuhnCheck } from './card-format';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s()-]+$/;

export const CHECKOUT_FIELD_ORDER: readonly CheckoutField[] = [
  'customerName',
  'phone',
  'email',
  'shippingAddress',
  'cardNumber',
  'cardExpiry',
  'cardCvc',
];

export function validateEmail(value: string): string | undefined {
  const email = value.trim();

  if (!email) return 'Email is required';
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email address';

  return undefined;
}

export function validatePhone(value: string): string | undefined {
  const phone = value.trim();
  const digitCount = digitsOnly(phone).length;

  if (!phone) return 'Phone is required';
  if (!PHONE_PATTERN.test(phone) || digitCount < 7 || digitCount > 15) {
    return 'Enter a valid phone number';
  }

  return undefined;
}

export function validateCardNumber(value: string): string | undefined {
  const digits = digitsOnly(value);

  if (!digits) return 'Card number is required';
  if (digits.length < 13 || digits.length > 19 || !passesLuhnCheck(digits)) {
    return 'Enter a valid card number';
  }

  return undefined;
}

export function validateCardExpiry(
  value: string,
  now: Date = new Date()
): string | undefined {
  const digits = digitsOnly(value);

  if (!digits) return 'Expiration date is required';
  if (digits.length !== 4) return 'Use MM / YY format';

  const month = Number(digits.slice(0, 2));
  const year = 2000 + Number(digits.slice(2));

  if (month < 1 || month > 12) return 'Use MM / YY format';

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card has expired';
  }

  return undefined;
}

export function validateCardCvc(value: string): string | undefined {
  const digits = digitsOnly(value);

  if (!digits) return 'CVV is required';
  if (digits.length < 3 || digits.length > 4) return 'CVV must be 3–4 digits';

  return undefined;
}

function required(value: string, message: string): string | undefined {
  return value.trim() ? undefined : message;
}

export function validateCheckout(
  values: CheckoutValues,
  paymentMethod: PaymentMethod,
  now: Date = new Date()
): CheckoutErrors {
  const errors: CheckoutErrors = {};

  const assign = (field: CheckoutField, error: string | undefined) => {
    if (error) errors[field] = error;
  };

  assign(
    'customerName',
    required(values.customerName, 'Customer name is required') ??
      (values.customerName.trim().length < 2 ? 'Name is too short' : undefined)
  );
  assign('phone', validatePhone(values.phone));
  assign('email', validateEmail(values.email));
  assign(
    'shippingAddress',
    required(values.shippingAddress, 'Shipping address is required')
  );

  if (paymentMethod === 'credit-card') {
    assign('cardNumber', validateCardNumber(values.cardNumber));
    assign('cardExpiry', validateCardExpiry(values.cardExpiry, now));
    assign('cardCvc', validateCardCvc(values.cardCvc));
  }

  return errors;
}

export function getFirstInvalidField(
  errors: CheckoutErrors
): CheckoutField | undefined {
  return CHECKOUT_FIELD_ORDER.find(field => errors[field]);
}
