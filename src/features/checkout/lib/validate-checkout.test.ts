import type { CheckoutValues } from '../model/checkout.types';
import {
  getFirstInvalidField,
  validateCardExpiry,
  validateCheckout,
  validateEmail,
  validatePhone,
} from './validate-checkout';

const NOW = new Date(2026, 9, 20);

const validValues: CheckoutValues = {
  customerName: 'Alex Smith',
  phone: '+1 (555) 123-4567',
  email: 'alex@example.com',
  shippingAddress: '12 Kiln Street, Portland',
  addressLine2: '',
  projectName: '',
  notes: '',
  cardNumber: '4242 4242 4242 4242',
  cardExpiry: '12 / 28',
  cardCvc: '123',
};

describe('validateEmail', () => {
  it.each(['alex@example.com', ' a.b+c@studio.co '])('accepts %s', email => {
    expect(validateEmail(email)).toBeUndefined();
  });

  it.each(['', 'alex', 'alex@', 'alex@example', 'a b@example.com'])(
    'rejects "%s"',
    email => {
      expect(validateEmail(email)).toBeDefined();
    }
  );
});

describe('validatePhone', () => {
  it('accepts common formats', () => {
    expect(validatePhone('+1 (555) 123-4567')).toBeUndefined();
    expect(validatePhone('5551234')).toBeUndefined();
  });

  it('rejects letters and too short numbers', () => {
    expect(validatePhone('call me')).toBeDefined();
    expect(validatePhone('123')).toBeDefined();
    expect(validatePhone('')).toBe('Phone is required');
  });
});

describe('validateCardExpiry', () => {
  it('accepts the current and future months', () => {
    expect(validateCardExpiry('10 / 26', NOW)).toBeUndefined();
    expect(validateCardExpiry('01 / 30', NOW)).toBeUndefined();
  });

  it('rejects past dates and invalid months', () => {
    expect(validateCardExpiry('09 / 26', NOW)).toBe('Card has expired');
    expect(validateCardExpiry('13 / 28', NOW)).toBe('Use MM / YY format');
    expect(validateCardExpiry('1', NOW)).toBe('Use MM / YY format');
  });
});

describe('validateCheckout', () => {
  it('passes for a complete credit card checkout', () => {
    expect(validateCheckout(validValues, 'credit-card', NOW)).toEqual({});
  });

  it('requires customer details', () => {
    const errors = validateCheckout(
      {
        ...validValues,
        customerName: ' ',
        phone: '',
        email: '',
        shippingAddress: '',
      },
      'paypal',
      NOW
    );

    expect(Object.keys(errors).sort()).toEqual(
      ['customerName', 'email', 'phone', 'shippingAddress'].sort()
    );
  });

  it('validates card details only for credit card payments', () => {
    const values = { ...validValues, cardNumber: '1234', cardCvc: '' };

    expect(validateCheckout(values, 'credit-card', NOW)).toEqual({
      cardNumber: 'Enter a valid card number',
      cardCvc: 'CVV is required',
    });
    expect(validateCheckout(values, 'bank-transfer', NOW)).toEqual({});
  });

  it('reports the first invalid field in screen order', () => {
    expect(getFirstInvalidField({ cardCvc: 'x', email: 'y', phone: 'z' })).toBe(
      'phone'
    );
    expect(getFirstInvalidField({})).toBeUndefined();
  });
});
