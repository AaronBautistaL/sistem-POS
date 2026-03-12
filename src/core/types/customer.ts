export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  totalPurchases: number;
  lastPurchase?: string;
  createdAt: string;
}
