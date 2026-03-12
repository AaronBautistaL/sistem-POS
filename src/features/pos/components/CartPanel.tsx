import type { CartItem, PaymentMethod } from '../../../core/types';
import { Trash2, Plus, Minus, X, User, CreditCard, Banknote, ArrowLeftRight } from 'lucide-react';
import type { Customer } from '../../../core/types';
import { NumPad } from './NumPad';
import clsx from 'clsx';

const PAYMENT_ICONS = { cash: Banknote, card: CreditCard, transfer: ArrowLeftRight };
const PAYMENT_LABELS = { cash: 'Efectivo', card: 'Tarjeta', transfer: 'Transferencia' };

interface Props {
  cart: CartItem[];
  selectedCustomer: Customer | null;
  paymentMethod: PaymentMethod;
  taxRate: number;
  sym: string;
  amountPaid: string;
  onAmountPaidChange: (v: string) => void;
  onUpdateQty: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onClearCart: () => void;
  onSelectCustomer: () => void;
  onRemoveCustomer: () => void;
  onSetPaymentMethod: (m: PaymentMethod) => void;
  onCompleteSale: () => void;
}

export function CartPanel({
  cart, selectedCustomer, paymentMethod, taxRate, sym, amountPaid, onAmountPaidChange,
  onUpdateQty, onRemove, onClearCart, onSelectCustomer, onRemoveCustomer,
  onSetPaymentMethod, onCompleteSale,
}: Props) {
  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity * (1 - i.discount / 100), 0);
  const tax = subtotal - subtotal / (1 + taxRate / 100);
  const total = subtotal;
  const paid = parseFloat(amountPaid) || 0;
  const change = Math.max(0, paid - total);

  return (
    <div className="w-80 flex-shrink-0 flex flex-col rounded-xl border overflow-hidden"
      style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: 'var(--color-border)' }}>
        <span className="font-semibold flex-1">Carrito</span>
        {cart.length > 0 && (
          <button onClick={onClearCart} className="p-1 rounded hover:bg-red-400/20 transition-colors">
            <Trash2 size={16} style={{ color: 'var(--color-danger)' }} />
          </button>
        )}
      </div>

      {/* Customer */}
      <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
        {selectedCustomer ? (
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: 'var(--color-surface-3)' }}>
            <User size={14} style={{ color: 'var(--color-primary-light)' }} />
            <span className="flex-1 text-sm truncate">{selectedCustomer.name}</span>
            <button onClick={onRemoveCustomer}><X size={14} style={{ color: 'var(--color-text-muted)' }} /></button>
          </div>
        ) : (
          <button onClick={onSelectCustomer}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors hover:bg-[var(--color-surface-3)]"
            style={{ color: 'var(--color-text-muted)' }}>
            <User size={14} />
            <span>Cliente general</span>
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {cart.length === 0 ? (
          <p className="text-center text-sm py-12" style={{ color: 'var(--color-text-muted)' }}>Agrega productos al carrito</p>
        ) : cart.map((item) => (
          <div key={item.product.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--color-surface-3)' }}>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{item.product.name}</p>
              <p className="text-xs" style={{ color: 'var(--color-primary-light)' }}>{sym}{item.product.price} c/u</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => onUpdateQty(item.product.id, item.quantity - 1)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-[var(--color-border)]">
                <Minus size={12} />
              </button>
              <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
              <button onClick={() => onUpdateQty(item.product.id, item.quantity + 1)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-[var(--color-border)]">
                <Plus size={12} />
              </button>
            </div>
            <span className="text-xs font-bold w-14 text-right">{sym}{(item.product.price * item.quantity).toFixed(2)}</span>
            <button onClick={() => onRemove(item.product.id)}><X size={14} style={{ color: 'var(--color-text-muted)' }} /></button>
          </div>
        ))}
      </div>

      {/* Totals & payment */}
      <div className="p-4 border-t space-y-3" style={{ borderColor: 'var(--color-border)' }}>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
            <span>{sym}{(total / (1 + taxRate / 100)).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--color-text-muted)' }}>IVA ({taxRate}%)</span>
            <span>{sym}{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-1 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <span>Total</span>
            <span style={{ color: 'var(--color-primary-light)' }}>{sym}{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment method */}
        <div className="grid grid-cols-3 gap-1">
          {(['cash', 'card', 'transfer'] as const).map((m) => {
            const Icon = PAYMENT_ICONS[m];
            return (
              <button key={m} onClick={() => onSetPaymentMethod(m)}
                className={clsx('flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-all', paymentMethod === m && 'ring-2')}
                style={{
                  background: paymentMethod === m ? 'var(--color-primary)' : 'var(--color-surface-3)',
                  color: paymentMethod === m ? 'white' : 'var(--color-text-muted)',
                  '--tw-ring-color': 'var(--color-primary)',
                } as React.CSSProperties}>
                <Icon size={16} />
                {PAYMENT_LABELS[m]}
              </button>
            );
          })}
        </div>

        {paymentMethod === 'cash' && (
          <div className="space-y-2">
            <NumPad value={amountPaid} onChange={onAmountPaidChange} />
            <div className="flex justify-between text-sm px-1">
              <span style={{ color: 'var(--color-text-muted)' }}>Pagado</span>
              <span className="font-bold">{sym}{paid.toFixed(2)}</span>
            </div>
            {paid > 0 && paid >= total && (
              <div className="flex justify-between text-sm px-1" style={{ color: 'var(--color-success)' }}>
                <span>Cambio</span>
                <span className="font-bold">{sym}{change.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        <button onClick={onCompleteSale}
          disabled={cart.length === 0 || (paymentMethod === 'cash' && paid < total)}
          className="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: 'var(--color-success)' }}>
          {paymentMethod === 'cash' ? `Cobrar ${sym}${total.toFixed(2)}` : `Pagar ${sym}${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
