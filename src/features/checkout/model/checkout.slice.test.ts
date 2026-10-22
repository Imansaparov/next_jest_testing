import { itemRemoved } from '@/entities/cart';

import { makeStore } from '@/app/store';

import { submitOrder } from '../api/submit-order';
import {
  fieldChanged,
  paymentMethodSelected,
  placeOrder,
  selectCheckoutErrors,
} from './checkout.slice';
import type { CheckoutField } from './checkout.types';

jest.mock('../api/submit-order', () => ({
  submitOrder: jest.fn(async (request: object) => ({
    id: 'AK-TEST01',
    ...request,
  })),
}));

function fillCustomer(store: AppStore) {
  const values: Partial<Record<CheckoutField, string>> = {
    customerName: 'Alex Smith',
    phone: '+1 555 123 4567',
    email: 'alex@example.com',
    shippingAddress: '12 Kiln Street',
  };

  for (const [field, value] of Object.entries(values)) {
    store.dispatch(fieldChanged({ field: field as CheckoutField, value }));
  }
}

describe('placeOrder', () => {
  beforeEach(() => jest.mocked(submitOrder).mockClear());

  it('rejects an incomplete form and points to the first invalid field', async () => {
    const store = makeStore();

    const result = await store.dispatch(placeOrder());

    expect(result.payload).toEqual({
      reason: 'invalid',
      firstInvalidField: 'customerName',
    });
    expect(store.getState().checkout.submitAttempted).toBe(true);
    expect(store.getState().checkout.formError).toMatch(/highlighted/);
    expect(submitOrder).not.toHaveBeenCalled();
  });

  it('requires card details only when paying by card', () => {
    const store = makeStore();
    fillCustomer(store);

    expect(Object.keys(selectCheckoutErrors(store.getState()))).toEqual([
      'cardNumber',
      'cardExpiry',
      'cardCvc',
    ]);

    store.dispatch(paymentMethodSelected('paypal'));
    expect(selectCheckoutErrors(store.getState())).toEqual({});
  });

  it('submits a valid order with the cart grand total', async () => {
    const store = makeStore();
    fillCustomer(store);
    store.dispatch(paymentMethodSelected('bank-transfer'));

    await store.dispatch(placeOrder());

    expect(submitOrder).toHaveBeenCalledWith({
      customerName: 'Alex Smith',
      email: 'alex@example.com',
      paymentMethod: 'bank-transfer',
      itemCount: 4,
      grandTotal: 1_310_000,
    });
    expect(store.getState().checkout.status).toBe('succeeded');
    expect(store.getState().checkout.lastOrder?.id).toBe('AK-TEST01');
  });

  it('refuses to submit an empty cart', async () => {
    const store = makeStore();
    fillCustomer(store);
    store.dispatch(paymentMethodSelected('apple-pay'));
    for (const item of store.getState().cart.items) {
      store.dispatch(itemRemoved(item.designId));
    }

    const result = await store.dispatch(placeOrder());

    expect(result.payload).toEqual({ reason: 'empty-cart' });
    expect(store.getState().checkout.formError).toMatch(/cart is empty/i);
  });
});
