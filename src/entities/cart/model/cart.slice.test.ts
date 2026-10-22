import { MAX_QUANTITY } from '../config/cart.config';
import {
  cartReset,
  cartSlice,
  initialCartItems,
  itemAdded,
  itemRemoved,
  quantityChanged,
  selectCartTotals,
} from './cart.slice';

const reducer = cartSlice.reducer;
const initialState = reducer(undefined, { type: '@@init' });

describe('cart slice', () => {
  it('starts with the four collections from the mockup', () => {
    expect(initialState.items.map(item => item.name)).toEqual([
      'Ocean Wave',
      'Forest Fern',
      'Terracotta Dot',
      'Yellow Star',
    ]);
  });

  it('changes the quantity of a single item', () => {
    const state = reducer(
      initialState,
      quantityChanged({ designId: 'forest-fern', quantity: 120 })
    );

    expect(state.items.find(i => i.designId === 'forest-fern')?.quantity).toBe(
      120
    );
    expect(state.items.find(i => i.designId === 'ocean-wave')?.quantity).toBe(
      150
    );
  });

  it('clamps invalid quantities', () => {
    const state = reducer(
      initialState,
      quantityChanged({ designId: 'yellow-star', quantity: 1e9 })
    );

    expect(state.items.find(i => i.designId === 'yellow-star')?.quantity).toBe(
      MAX_QUANTITY
    );
  });

  it('removes an item', () => {
    const state = reducer(initialState, itemRemoved('terracotta-dot'));

    expect(state.items).toHaveLength(3);
    expect(state.items.some(i => i.designId === 'terracotta-dot')).toBe(false);
  });

  it('adds a new design with catalog price', () => {
    const state = reducer(
      initialState,
      itemAdded({ designId: 'navy-compass', quantity: 10 })
    );

    expect(state.items.at(-1)).toEqual({
      designId: 'navy-compass',
      name: 'Navy Compass',
      unitPrice: 3200,
      quantity: 10,
    });
  });

  it('increments quantity when the design is already in the cart', () => {
    const state = reducer(initialState, itemAdded({ designId: 'ocean-wave' }));

    expect(state.items).toHaveLength(initialCartItems.length);
    expect(state.items[0]?.quantity).toBe(151);
  });

  it('resets to the initial items', () => {
    const emptied = initialCartItems.reduce(
      (state, item) => reducer(state, itemRemoved(item.designId)),
      initialState
    );

    expect(emptied.items).toHaveLength(0);
    expect(reducer(emptied, cartReset())).toEqual(initialState);
  });

  it('derives totals from the root state', () => {
    expect(selectCartTotals({ cart: initialState })).toEqual({
      subtotal: 1_310_000,
      shipping: 0,
      grandTotal: 1_310_000,
    });
  });
});
