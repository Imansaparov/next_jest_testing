export type CardBrand = 'visa' | 'mastercard' | 'unknown';

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/** `4111111111111111` → `4111 1111 1111 1111` (max 19 digits). */
export function formatCardNumber(value: string): string {
  return digitsOnly(value)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

/** `1228` → `12 / 28`. */
export function formatCardExpiry(value: string): string {
  const digits = digitsOnly(value).slice(0, 4);

  return digits.length > 2
    ? `${digits.slice(0, 2)} / ${digits.slice(2)}`
    : digits;
}

export function formatCardCvc(value: string): string {
  return digitsOnly(value).slice(0, 4);
}

export function detectCardBrand(cardNumber: string): CardBrand {
  const digits = digitsOnly(cardNumber);

  if (/^4/.test(digits)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard';

  return 'unknown';
}

/** Luhn checksum used by all major card networks. */
export function passesLuhnCheck(cardNumber: string): boolean {
  const digits = digitsOnly(cardNumber);
  if (digits.length === 0) return false;

  let sum = 0;

  for (let i = 0; i < digits.length; i += 1) {
    let digit = Number(digits[digits.length - 1 - i]);

    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
  }

  return sum % 10 === 0;
}
