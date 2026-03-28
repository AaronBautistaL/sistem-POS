import type { Product, Customer, Sale } from '../core/types';

export const mockProducts: Product[] = [
  { id: 'p1', name: 'Coca-Cola 600ml', sku: 'BEB001', category: 'Bebidas', price: 20, cost: 12, stock: 48, minStock: 10, unit: 'pza', barcode: '750100000001' },
  { id: 'p2', name: 'Sabritas Original 45g', sku: 'BOT001', category: 'Botanas', price: 15, cost: 9, stock: 35, minStock: 15, unit: 'pza', barcode: '750100000002' },
  { id: 'p3', name: 'Pan Bimbo Grande', sku: 'PAN001', category: 'Panadería', price: 48, cost: 32, stock: 8, minStock: 10, unit: 'pza', barcode: '750100000003' },
  { id: 'p4', name: 'Leche Lala 1L', sku: 'LAC001', category: 'Lácteos', price: 26, cost: 19, stock: 22, minStock: 12, unit: 'lt', barcode: '750100000004' },
  { id: 'p5', name: 'Huevo Kilo', sku: 'HUE001', category: 'Abarrotes', price: 38, cost: 28, stock: 15, minStock: 5, unit: 'kg', barcode: '750100000005' },
  { id: 'p6', name: 'Agua Bonafont 1.5L', sku: 'BEB002', category: 'Bebidas', price: 16, cost: 10, stock: 60, minStock: 20, unit: 'pza', barcode: '750100000006' },
  { id: 'p7', name: 'Arroz Morelos 1kg', sku: 'ABA001', category: 'Abarrotes', price: 32, cost: 22, stock: 30, minStock: 10, unit: 'kg', barcode: '750100000007' },
  { id: 'p8', name: 'Frijol Bayo 1kg', sku: 'ABA002', category: 'Abarrotes', price: 30, cost: 21, stock: 25, minStock: 10, unit: 'kg', barcode: '750100000008' },
  { id: 'p9', name: 'Jabón Zote', sku: 'LIM001', category: 'Limpieza', price: 18, cost: 11, stock: 40, minStock: 15, unit: 'pza', barcode: '750100000009' },
  { id: 'p10', name: 'Papel Higiénico Paquete', sku: 'LIM002', category: 'Limpieza', price: 65, cost: 48, stock: 6, minStock: 8, unit: 'paq', barcode: '750100000010' },
  { id: 'p11', name: 'Yogurt Danone 900g', sku: 'LAC002', category: 'Lácteos', price: 42, cost: 30, stock: 18, minStock: 8, unit: 'pza', barcode: '750100000011' },
  { id: 'p12', name: 'Chicles Trident', sku: 'DUL001', category: 'Dulcería', price: 12, cost: 7, stock: 50, minStock: 20, unit: 'pza', barcode: '750100000012' },
];

export const mockCustomers: Customer[] = [
  { id: 'c1', name: 'María García', email: 'maria@email.com', phone: '555-0101', address: 'Calle Rosal 123', totalPurchases: 4580, lastPurchase: '2024-01-15', createdAt: '2023-06-01' },
  { id: 'c2', name: 'Juan Pérez', email: 'juan@email.com', phone: '555-0102', totalPurchases: 2340, lastPurchase: '2024-01-18', createdAt: '2023-08-15' },
  { id: 'c3', name: 'Ana López', email: 'ana@email.com', phone: '555-0103', address: 'Av. Juárez 456', totalPurchases: 8920, lastPurchase: '2024-01-20', createdAt: '2023-03-22' },
  { id: 'c4', name: 'Carlos Mendoza', email: 'carlos@email.com', phone: '555-0104', totalPurchases: 1250, lastPurchase: '2024-01-10', createdAt: '2023-11-08' },
  { id: 'c5', name: 'Laura Sánchez', email: 'laura@email.com', phone: '555-0105', address: 'Blvd. Norte 789', totalPurchases: 6700, lastPurchase: '2024-01-22', createdAt: '2023-04-30' },
];

export const mockSales: Sale[] = [
  {
    id: 's001', subtotal: 86.2, tax: 13.8, discount: 0, total: 100,
    paymentMethod: 'cash', amountPaid: 100, change: 0,
    customerId: 'c1', customerName: 'María García',
    cashierId: 'u1', cashierName: 'Admin',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    items: [
      { productId: 'p1', productName: 'Coca-Cola 600ml', quantity: 2, price: 20, discount: 0, subtotal: 40 },
      { productId: 'p3', productName: 'Pan Bimbo Grande', quantity: 1, price: 48, discount: 0, subtotal: 48 },
    ],
  },
  {
    id: 's002', subtotal: 155.2, tax: 24.8, discount: 0, total: 180,
    paymentMethod: 'card', amountPaid: 180, change: 0,
    cashierId: 'u1', cashierName: 'Admin',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    items: [
      { productId: 'p4', productName: 'Leche Lala 1L', quantity: 2, price: 26, discount: 0, subtotal: 52 },
      { productId: 'p7', productName: 'Arroz Morelos 1kg', quantity: 2, price: 32, discount: 0, subtotal: 64 },
      { productId: 'p2', productName: 'Sabritas Original', quantity: 2, price: 15, discount: 0, subtotal: 30 },
    ],
  },
  {
    id: 's003', subtotal: 43.1, tax: 6.9, discount: 0, total: 50,
    paymentMethod: 'cash', amountPaid: 50, change: 0,
    cashierId: 'u1', cashierName: 'Admin',
    createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    items: [
      { productId: 'p5', productName: 'Huevo Kilo', quantity: 1, price: 38, discount: 0, subtotal: 38 },
    ],
  },
];

export const weekSalesData = [
  { day: 'Lun', ventas: 1240, tickets: 28 },
  { day: 'Mar', ventas: 980, tickets: 22 },
  { day: 'Mié', ventas: 1560, tickets: 35 },
  { day: 'Jue', ventas: 1120, tickets: 25 },
  { day: 'Vie', ventas: 2100, tickets: 48 },
  { day: 'Sáb', ventas: 2450, tickets: 56 },
  { day: 'Hoy', ventas: 1890, tickets: 42 },
];

export const categorySalesData = [
  { name: 'Bebidas', value: 3200 },
  { name: 'Abarrotes', value: 2800 },
  { name: 'Lácteos', value: 1900 },
  { name: 'Botanas', value: 1400 },
  { name: 'Limpieza', value: 900 },
  { name: 'Panadería', value: 700 },
];
