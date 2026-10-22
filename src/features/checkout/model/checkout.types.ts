export const PAYMENT_METHODS = [
  'credit-card',
  'paypal',
  'apple-pay',
  'bank-transfer',
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type CheckoutValues = {
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: string;
  addressLine2: string;
  projectName: string;
  notes: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
};

export type CheckoutField = keyof CheckoutValues;

export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

export type PlacedOrder = {
  id: string;
  customerName: string;
  email: string;
  paymentMethod: PaymentMethod;
  itemCount: number;
  grandTotal: number;
};

export type PlaceOrderRejection =
  | { reason: 'invalid'; firstInvalidField: CheckoutField }
  | { reason: 'empty-cart' }
  | { reason: 'server'; message: string };

export type CheckoutStatus = 'idle' | 'submitting' | 'succeeded' | 'failed';

export type CheckoutState = {
  values: CheckoutValues;
  paymentMethod: PaymentMethod;
  touched: Partial<Record<CheckoutField, boolean>>;
  submitAttempted: boolean;
  status: CheckoutStatus;
  formError: string | null;
  lastOrder: PlacedOrder | null;
};
