import type { Customer, Sale } from '../../../core/types';
import { Users, ShoppingBag, X } from 'lucide-react';

interface Props {
  customer: Customer;
  sales: Sale[];
  sym: string;
  onClose: () => void;
}

export function CustomerDrawer({ customer, sales, sym, onClose }: Props) {
  const customerSales = sales.filter(s => s.customerId === customer.id);

  return (
    <div className="fixed inset-y-0 right-0 w-80 border-l shadow-2xl flex flex-col z-40"
      style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
      <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--color-border)' }}>
        <Users size={18} style={{ color: 'var(--color-primary-light)' }} />
        <span className="font-semibold flex-1">Detalle Cliente</span>
        <button onClick={onClose}><X size={18} /></button>
      </div>
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-2" style={{ background: 'var(--color-primary)' }}>{customer.name[0]}</div>
          <h3 className="font-bold text-lg">{customer.name}</h3>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Cliente desde {customer.createdAt}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--color-surface-3)' }}>
            <p className="text-xl font-bold" style={{ color: 'var(--color-primary-light)' }}>{sym}{customer.totalPurchases.toLocaleString()}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total comprado</p>
          </div>
          <div className="p-3 rounded-lg text-center" style={{ background: 'var(--color-surface-3)' }}>
            <p className="text-xl font-bold">{customerSales.length}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Transacciones</p>
          </div>
        </div>
        <h4 className="font-semibold text-sm">Últimas compras</h4>
        <div className="space-y-2">
          {customerSales.slice(0, 10).map(sale => (
            <div key={sale.id} className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'var(--color-surface-3)' }}>
              <ShoppingBag size={14} style={{ color: 'var(--color-text-muted)' }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">{sale.items.length} productos</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{new Date(sale.createdAt).toLocaleDateString('es-MX')}</p>
              </div>
              <span className="text-sm font-bold">{sym}{sale.total.toFixed(2)}</span>
            </div>
          ))}
          {customerSales.length === 0 && (
            <p className="text-sm text-center py-6" style={{ color: 'var(--color-text-muted)' }}>Sin compras registradas</p>
          )}
        </div>
      </div>
    </div>
  );
}
