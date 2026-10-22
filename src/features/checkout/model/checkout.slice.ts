import {
  type PayloadAction,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import { selectCartItems, selectCartTotals } from '@/entities/cart';

import { createAppAsyncThunk } from '@/shared/lib/redux';

import { submitOrder } from '../api/submit-order';
import {
  getFirstInvalidField,
  validateCheckout,
} from '../lib/validate-checkout';
import type {
  CheckoutField,
  CheckoutState,
  CheckoutValues,
  PaymentMethod,
  PlaceOrderRejection,
  PlacedOrder,
} from './checkout.types';

const initialValues: CheckoutValues = {
  customerName: '',
  phone: '',
  email: '',
  shippingAddress: '',
  addressLine2: '',
  projectName: '',
  notes: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
};

const initialState: CheckoutState = {
  values: initialValues,
  paymentMethod: 'credit-card',
  touched: {},
  submitAttempted: false,
  status: 'idle',
  formError: null,
  lastOrder: null,
};

const rejectionMessages: Record<PlaceOrderRejection['reason'], string> = {
  invalid: 'Please fix the highlighted fields.',
  'empty-cart': 'Your cart is empty — add at least one tile.',
  server: 'Something went wrong. Please try again.',
};

export const placeOrder = createAppAsyncThunk<
  PlacedOrder,
  void,
  { rejectValue: PlaceOrderRejection }
>(
  'checkout/placeOrder',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const { values, paymentMethod } = state.checkout;
    const items = selectCartItems(state);

    if (items.length === 0) return rejectWithValue({ reason: 'empty-cart' });

    const firstInvalidField = getFirstInvalidField(
      validateCheckout(values, paymentMethod)
    );

    if (firstInvalidField) {
      return rejectWithValue({ reason: 'invalid', firstInvalidField });
    }

    try {
      return await submitOrder({
        customerName: values.customerName.trim(),
        email: values.email.trim(),
        paymentMethod,
        itemCount: items.length,
        grandTotal: selectCartTotals(state).grandTotal,
      });
    } catch (error) {
      return rejectWithValue({
        reason: 'server',
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },
  {
    condition: (_, { getState }) => getState().checkout.status !== 'submitting',
  }
);

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    fieldChanged(
      state,
      action: PayloadAction<{ field: CheckoutField; value: string }>
    ) {
      state.values[action.payload.field] = action.payload.value;
      if (state.status === 'failed') state.formError = null;
    },
    fieldBlurred(state, action: PayloadAction<CheckoutField>) {
      state.touched[action.payload] = true;
    },
    paymentMethodSelected(state, action: PayloadAction<PaymentMethod>) {
      state.paymentMethod = action.payload;
    },
    checkoutReset() {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(placeOrder.pending, state => {
        state.status = 'submitting';
        state.submitAttempted = true;
        state.formError = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.formError = action.payload
          ? action.payload.reason === 'server'
            ? action.payload.message || rejectionMessages.server
            : rejectionMessages[action.payload.reason]
          : rejectionMessages.server;
      });
  },
  selectors: {
    selectCheckoutValues: state => state.values,
    selectPaymentMethod: state => state.paymentMethod,
    selectCheckoutStatus: state => state.status,
    selectFormError: state => state.formError,
    selectLastOrder: state => state.lastOrder,
    selectTouched: state => state.touched,
    selectSubmitAttempted: state => state.submitAttempted,
  },
});

export const {
  fieldChanged,
  fieldBlurred,
  paymentMethodSelected,
  checkoutReset,
} = checkoutSlice.actions;

export const {
  selectCheckoutValues,
  selectPaymentMethod,
  selectCheckoutStatus,
  selectFormError,
  selectLastOrder,
  selectTouched,
  selectSubmitAttempted,
} = checkoutSlice.selectors;

export const selectCheckoutErrors = createSelector(
  [selectCheckoutValues, selectPaymentMethod],
  (values, paymentMethod) => validateCheckout(values, paymentMethod)
);

export const selectVisibleFieldError = createSelector(
  [
    selectCheckoutErrors,
    selectTouched,
    selectSubmitAttempted,
    (_state: unknown, field: CheckoutField) => field,
  ],
  (errors, touched, submitAttempted, field) =>
    touched[field] || submitAttempted ? errors[field] : undefined
);
