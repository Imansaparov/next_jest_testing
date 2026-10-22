import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { cartSlice } from '@/entities/cart';
import { designGridSlice } from '@/entities/design-grid';

import { checkoutSlice } from '@/features/checkout';

export const rootReducer = combineSlices(
  cartSlice,
  designGridSlice,
  checkoutSlice
);

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    ...(preloadedState ? { preloadedState } : {}),
  });
}

declare global {
  type RootState = ReturnType<typeof rootReducer>;
  type AppStore = ReturnType<typeof makeStore>;
  type AppDispatch = AppStore['dispatch'];
}
