import type { Sale } from '../../../core/types';
import { Check } from 'lucide-react';

interface Props {
  sale: Sale;
  sym: string;
  taxRate: number;
  receiptFooter: string;
  onNewSale: () => void;
}

export function ReceiptScreen({ sale, sym, taxRate, receiptFooter, onNewSale }: Props) {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-xl border text-center space-y-4"
      style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: '#10b98130' }}>
        <Check size={32} style={{ color: 'var(--color-success)' }} />
      </div>
      <h2 className="text-xl font-bold">¡Venta Completada!</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>Ticket #{sale.id}</p>
      <div className="p-4 rounded-lg text-left space-y-2" style={{ background: 'var(--color-surface-3)' }}>
        {sale.items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm">
            <span>{item.quantity}x {item.productName}</span>
            <span>{sym}{item.subtotal.toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t pt-2 mt-2 space-y-1" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
            <span>{sym}{sale.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--color-text-muted)' }}>IVA ({taxRate}%)</span>
            <span>{sym}{sale.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{sym}{sale.total.toFixed(2)}</span>
          </div>
          {sale.paymentMethod === 'cash' && (
            <div className="flex justify-between text-sm" style={{ color: 'var(--color-success)' }}>
              <span>Cambio</span>
              <span>{sym}{sale.change.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{receiptFooter}</p>
      <button onClick={onNewSale} className="w-full py-3 rounded-lg font-semibold text-white transition-colors hover:opacity-90" style={{ background: 'var(--color-primary)' }}>
        Nueva Venta
      </button>
    </div>
  );
}
