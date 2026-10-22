import type { PlacedOrder } from '../model/checkout.types';

export type SubmitOrderRequest = Omit<PlacedOrder, 'id'>;

const SUBMIT_DELAY_MS = 900;

function wait(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export async function submitOrder(
  request: SubmitOrderRequest
): Promise<PlacedOrder> {
  await wait(SUBMIT_DELAY_MS);

  const id = `AK-${Date.now().toString(36).slice(-6).toUpperCase()}`;

  return { id, ...request };
}
