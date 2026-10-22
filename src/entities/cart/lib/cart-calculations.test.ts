import {
  MAX_QUANTITY,
  MIN_QUANTITY,
  SHIPPING_FEE,
} from '../config/cart.config';
import {
  calculateCartTotals,
  calculateShipping,
  calculateSubtotal,
  clampQuantity,
} from './cart-calculations';

describe('calculateSubtotal', () => {
  it('sums quantity × unit price over all lines', () => {
    expect(
      calculateSubtotal([
        { quantity: 150, unitPrice: 2800 },
        { quantity: 75, unitPrice: 3000 },
        { quantity: 200, unitPrice: 2600 },
        { quantity: 50, unitPrice: 2900 },
      ])
    ).toBe(1_310_000);
  });

  it('returns 0 for an empty cart', () => {
    expect(calculateSubtotal([])).toBe(0);
  });
});

describe('calculateShipping', () => {
  it('charges $25.00 when subtotal is $500.00 or less', () => {
    expect(calculateShipping(100)).toBe(SHIPPING_FEE);
    expect(calculateShipping(49_999)).toBe(SHIPPING_FEE);
    expect(calculateShipping(50_000)).toBe(SHIPPING_FEE);
  });

  it('is free when subtotal is greater than $500.00', () => {
    expect(calculateShipping(50_001)).toBe(0);
    expect(calculateShipping(1_310_000)).toBe(0);
  });

  it('does not charge shipping for an empty cart', () => {
    expect(calculateShipping(0)).toBe(0);
  });
});

describe('calculateCartTotals', () => {
  it('adds shipping to the subtotal for small orders', () => {
    expect(calculateCartTotals([{ quantity: 10, unitPrice: 2800 }])).toEqual({
      subtotal: 28_000,
      shipping: 2_500,
      grandTotal: 30_500,
    });
  });

  it('keeps grand total equal to subtotal when shipping is free', () => {
    expect(calculateCartTotals([{ quantity: 20, unitPrice: 2600 }])).toEqual({
      subtotal: 52_000,
      shipping: 0,
      grandTotal: 52_000,
    });
  });

  it('returns zeros for an empty cart', () => {
    expect(calculateCartTotals([])).toEqual({
      subtotal: 0,
      shipping: 0,
      grandTotal: 0,
    });
  });
});

describe('clampQuantity', () => {
  it('rounds to whole square feet', () => {
    expect(clampQuantity(12.4)).toBe(12);
    expect(clampQuantity(12.6)).toBe(13);
  });

  it('keeps values within the allowed range', () => {
    expect(clampQuantity(0)).toBe(MIN_QUANTITY);
    expect(clampQuantity(-5)).toBe(MIN_QUANTITY);
    expect(clampQuantity(1_000_000)).toBe(MAX_QUANTITY);
  });

  it('falls back to the minimum for non-numeric input', () => {
    expect(clampQuantity(Number.NaN)).toBe(MIN_QUANTITY);
  });
});
