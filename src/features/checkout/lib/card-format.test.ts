import {
  detectCardBrand,
  formatCardCvc,
  formatCardExpiry,
  formatCardNumber,
  passesLuhnCheck,
} from './card-format';

describe('card formatting', () => {
  it('groups card number digits by four', () => {
    expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111');
    expect(formatCardNumber('4111-11')).toBe('4111 11');
    expect(formatCardNumber('1'.repeat(25)).replace(/\s/g, '')).toHaveLength(
      19
    );
  });

  it('formats expiry as MM / YY', () => {
    expect(formatCardExpiry('1')).toBe('1');
    expect(formatCardExpiry('12')).toBe('12');
    expect(formatCardExpiry('1228')).toBe('12 / 28');
    expect(formatCardExpiry('12/289')).toBe('12 / 28');
  });

  it('keeps up to four CVC digits', () => {
    expect(formatCardCvc('12a34 5')).toBe('1234');
  });

  it('detects the card brand', () => {
    expect(detectCardBrand('4111 1111')).toBe('visa');
    expect(detectCardBrand('5500 0000')).toBe('mastercard');
    expect(detectCardBrand('2221 0000')).toBe('mastercard');
    expect(detectCardBrand('3782')).toBe('unknown');
  });
});

describe('passesLuhnCheck', () => {
  it('accepts valid test card numbers', () => {
    expect(passesLuhnCheck('4242 4242 4242 4242')).toBe(true);
    expect(passesLuhnCheck('5555555555554444')).toBe(true);
  });

  it('rejects invalid numbers', () => {
    expect(passesLuhnCheck('4242 4242 4242 4241')).toBe(false);
    expect(passesLuhnCheck('')).toBe(false);
  });
});
