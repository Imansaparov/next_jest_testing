export {
  BOX_SIZE_SQ_FT,
  FREE_SHIPPING_THRESHOLD,
  MAX_QUANTITY,
  MIN_QUANTITY,
  SHIPPING_FEE,
} from './config/cart.config';

export {
  calculateCartTotals,
  calculateShipping,
  calculateSubtotal,
  clampQuantity,
} from './lib/cart-calculations';

export {
  cartReset,
  cartSlice,
  initialCartItems,
  itemAdded,
  itemRemoved,
  quantityChanged,
  selectCartDesignIds,
  selectCartItemCount,
  selectCartItems,
  selectCartTotals,
} from './model/cart.slice';

export type {
  CartItem,
  CartLine,
  CartState,
  CartTotals as CartTotalsValue,
} from './model/cart.types';
export { CartTotals } from './ui/cart-totals/cart-totals';
