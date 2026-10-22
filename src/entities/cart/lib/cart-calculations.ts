import {
  FREE_SHIPPING_THRESHOLD,
  MAX_QUANTITY,
  MIN_QUANTITY,
  SHIPPING_FEE,
} from '../config/cart.config';
import type { CartLine, CartTotals } from '../model/cart.types';

export function calculateSubtotal(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
}

export function calculateShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;

  return subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export function calculateCartTotals(lines: readonly CartLine[]): CartTotals {
  const subtotal = calculateSubtotal(lines);
  const shipping = calculateShipping(subtotal);

  return { subtotal, shipping, grandTotal: subtotal + shipping };
}

export function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return MIN_QUANTITY;

  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.round(value)));
}
