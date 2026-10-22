import { formatCurrency } from './currency';

describe('formatCurrency', () => {
  it('formats cents as US dollars', () => {
    expect(formatCurrency(2800)).toBe('$28.00');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(1310000)).toBe('$13,100.00');
  });
});
