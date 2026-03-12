export type PaymentMethod = 'cash' | 'card' | 'transfer';

export interface CartItem {
  product: import('./product').Product;
  quantity: number;
  discount: number;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  customerId?: string;
  customerName?: string;
  cashierId: string;
  cashierName: string;
  createdAt: string;
}
