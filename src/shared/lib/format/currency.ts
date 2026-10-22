const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});


export function formatCurrency(cents: number): string {
  return currencyFormatter.format(cents / 100);
}
