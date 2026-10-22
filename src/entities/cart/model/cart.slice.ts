import {
  type PayloadAction,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import { type TileDesignId, getTileDesign } from '@/entities/tile';

import { calculateCartTotals, clampQuantity } from '../lib/cart-calculations';
import type { CartItem, CartState } from './cart.types';

function createCartItem(designId: TileDesignId, quantity: number): CartItem {
  const { name, unitPrice } = getTileDesign(designId);

  return { designId, name, unitPrice, quantity: clampQuantity(quantity) };
}

export const initialCartItems: CartItem[] = [
  createCartItem('ocean-wave', 150),
  createCartItem('forest-fern', 75),
  createCartItem('terracotta-dot', 200),
  createCartItem('yellow-star', 50),
];

const initialState: CartState = {
  items: initialCartItems,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    itemAdded(
      state,
      action: PayloadAction<{ designId: TileDesignId; quantity?: number }>
    ) {
      const { designId, quantity = 1 } = action.payload;
      const existing = state.items.find(item => item.designId === designId);

      if (existing) {
        existing.quantity = clampQuantity(existing.quantity + quantity);
        return;
      }

      state.items.push(createCartItem(designId, quantity));
    },
    quantityChanged(
      state,
      action: PayloadAction<{ designId: TileDesignId; quantity: number }>
    ) {
      const item = state.items.find(
        ({ designId }) => designId === action.payload.designId
      );

      if (item) item.quantity = clampQuantity(action.payload.quantity);
    },
    itemRemoved(state, action: PayloadAction<TileDesignId>) {
      state.items = state.items.filter(
        ({ designId }) => designId !== action.payload
      );
    },
    cartReset() {
      return initialState;
    },
  },
  selectors: {
    selectCartItems: state => state.items,
    selectCartItemCount: state => state.items.length,
  },
});

export const { itemAdded, quantityChanged, itemRemoved, cartReset } =
  cartSlice.actions;

export const { selectCartItems, selectCartItemCount } = cartSlice.selectors;

export const selectCartTotals = createSelector(
  [selectCartItems],
  calculateCartTotals
);

export const selectCartDesignIds = createSelector([selectCartItems], items =>
  items.map(item => item.designId)
);
