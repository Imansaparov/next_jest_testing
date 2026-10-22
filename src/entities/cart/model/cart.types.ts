import type { TileDesignId } from '@/entities/tile';

export type CartItem = {
  designId: TileDesignId;
  name: string;
  unitPrice: number;
  quantity: number;
};

export type CartLine = Pick<CartItem, 'quantity' | 'unitPrice'>;

export type CartTotals = {
  subtotal: number;
  shipping: number;
  grandTotal: number;
};

export type CartState = {
  items: CartItem[];
};
