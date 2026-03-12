import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, Customer, Sale, CartItem, StoreSettings } from '../../core/types';
import { mockProducts, mockCustomers, mockSales } from '../../data/mockData';

interface POSState {
  // Data
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  // Cart
  cart: CartItem[];
  selectedCustomer: Customer | null;
  paymentMethod: 'cash' | 'card' | 'transfer';
  // Settings
  settings: StoreSettings;
  // UI
  sidebarOpen: boolean;
  // Actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  setSelectedCustomer: (c: Customer | null) => void;
  setPaymentMethod: (m: 'cash' | 'card' | 'transfer') => void;
  completeSale: (amountPaid: number) => Sale;
  addProduct: (p: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCustomer: (c: Customer) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  updateSettings: (s: Partial<StoreSettings>) => void;
  toggleSidebar: () => void;
}

export const useStore = create<POSState>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      customers: mockCustomers,
      sales: mockSales,
      cart: [],
      selectedCustomer: null,
      paymentMethod: 'cash',
      settings: {
        name: 'Tienda POS',
        address: 'Calle Principal #1, Ciudad',
        phone: '555-0000',
        email: 'tienda@email.com',
        taxId: 'RFC000000000',
        taxRate: 16,
        currency: 'MXN',
        currencySymbol: '$',
        receiptFooter: '¡Gracias por su compra!',
      },
      sidebarOpen: true,

      addToCart: (product) => set((s) => {
        const existing = s.cart.find((i) => i.product.id === product.id);
        if (existing) {
          return { cart: s.cart.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) };
        }
        return { cart: [...s.cart, { product, quantity: 1, discount: 0 }] };
      }),

      removeFromCart: (productId) => set((s) => ({ cart: s.cart.filter((i) => i.product.id !== productId) })),

      updateCartQty: (productId, qty) => set((s) => {
        if (qty <= 0) return { cart: s.cart.filter((i) => i.product.id !== productId) };
        return { cart: s.cart.map((i) => i.product.id === productId ? { ...i, quantity: qty } : i) };
      }),

      clearCart: () => set({ cart: [], selectedCustomer: null, paymentMethod: 'cash' }),

      setSelectedCustomer: (c) => set({ selectedCustomer: c }),
      setPaymentMethod: (m) => set({ paymentMethod: m }),

      completeSale: (amountPaid) => {
        const { cart, selectedCustomer, paymentMethod, settings, products, customers } = get();
        const subtotalRaw = cart.reduce((sum, i) => sum + i.product.price * i.quantity * (1 - i.discount / 100), 0);
        const taxRate = settings.taxRate / 100;
        const subtotal = parseFloat((subtotalRaw / (1 + taxRate)).toFixed(2));
        const tax = parseFloat((subtotalRaw - subtotal).toFixed(2));
        const total = parseFloat(subtotalRaw.toFixed(2));
        const change = parseFloat((amountPaid - total).toFixed(2));

        const sale: Sale = {
          id: `s${Date.now()}`,
          items: cart.map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            quantity: i.quantity,
            price: i.product.price,
            discount: i.discount,
            subtotal: parseFloat((i.product.price * i.quantity * (1 - i.discount / 100)).toFixed(2)),
          })),
          subtotal, tax, discount: 0, total, paymentMethod,
          amountPaid, change,
          customerId: selectedCustomer?.id,
          customerName: selectedCustomer?.name,
          cashierId: 'u1', cashierName: 'Admin',
          createdAt: new Date().toISOString(),
        };

        // Update stock
        const updatedProducts = products.map((p) => {
          const item = cart.find((i) => i.product.id === p.id);
          return item ? { ...p, stock: p.stock - item.quantity } : p;
        });

        // Update customer totals
        const updatedCustomers = customers.map((c) => {
          if (c.id === selectedCustomer?.id) {
            return { ...c, totalPurchases: c.totalPurchases + total, lastPurchase: new Date().toISOString().split('T')[0] };
          }
          return c;
        });

        set((s) => ({ sales: [sale, ...s.sales], products: updatedProducts, customers: updatedCustomers, cart: [], selectedCustomer: null }));
        return sale;
      },

      addProduct: (p) => set((s) => ({ products: [...s.products, p] })),
      updateProduct: (id, data) => set((s) => ({ products: s.products.map((p) => p.id === id ? { ...p, ...data } : p) })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      addCustomer: (c) => set((s) => ({ customers: [...s.customers, c] })),
      updateCustomer: (id, data) => set((s) => ({ customers: s.customers.map((c) => c.id === id ? { ...c, ...data } : c) })),
      updateSettings: (s) => set((prev) => ({ settings: { ...prev.settings, ...s } })),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    { name: 'pos-store', partialize: (s) => ({ products: s.products, customers: s.customers, sales: s.sales, settings: s.settings }) }
  )
);
