import { useState, useTransition, useDeferredValue } from 'react';
import { useStore } from '../../infrastructure/store/useStore';
import type { Sale } from '../../core/types';
import { Search } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { CartPanel } from './components/CartPanel';
import { CustomerPicker } from './components/CustomerPicker';
import { ReceiptScreen } from './components/ReceiptScreen';

export default function POSPage() {
  const { products, customers, cart, selectedCustomer, paymentMethod,
    addToCart, removeFromCart, updateCartQty, clearCart,
    setSelectedCustomer, setPaymentMethod, completeSale, settings } = useStore();

  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);
  const [amountPaid, setAmountPaid] = useState('');
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const sym = settings.currencySymbol;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(deferredSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(deferredSearch.toLowerCase()) ||
    (p.barcode || '').includes(deferredSearch)
  );

  function handleCompleteSale() {
    if (cart.length === 0) return;
    const paid = paymentMethod === 'cash' ? (parseFloat(amountPaid) || 0) : parseFloat((cart.reduce((sum, i) => sum + i.product.price * i.quantity * (1 - i.discount / 100), 0)).toFixed(2));
    const sale = completeSale(paid);
    setLastSale(sale);
    setAmountPaid('');
  }

  if (lastSale) {
    return <ReceiptScreen sale={lastSale} sym={sym} taxRate={settings.taxRate} receiptFooter={settings.receiptFooter} onNewSale={() => setLastSale(null)} />;
  }

  return (
    <div className="flex gap-4 h-full" style={{ minHeight: 'calc(100vh - 112px)' }}>
      {/* Products panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
          <input value={search} onChange={e => startTransition(() => setSearch(e.target.value))}
            placeholder="Buscar producto, SKU o código de barras..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
          {isPending && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto">
          {filtered.map(p => <ProductCard key={p.id} p={p} onAdd={() => addToCart(p)} sym={sym} />)}
        </div>
      </div>

      {/* Cart */}
      {showCustomerPicker && (
        <CustomerPicker customers={customers} onSelect={c => { setSelectedCustomer(c); setShowCustomerPicker(false); }} onClose={() => setShowCustomerPicker(false)} />
      )}
      <CartPanel
        cart={cart}
        selectedCustomer={selectedCustomer}
        paymentMethod={paymentMethod}
        taxRate={settings.taxRate}
        sym={sym}
        amountPaid={amountPaid}
        onAmountPaidChange={setAmountPaid}
        onUpdateQty={updateCartQty}
        onRemove={removeFromCart}
        onClearCart={clearCart}
        onSelectCustomer={() => setShowCustomerPicker(true)}
        onRemoveCustomer={() => setSelectedCustomer(null)}
        onSetPaymentMethod={setPaymentMethod}
        onCompleteSale={handleCompleteSale}
      />
    </div>
  );
}
