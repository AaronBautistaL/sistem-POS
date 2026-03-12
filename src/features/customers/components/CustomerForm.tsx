import { useState } from 'react';
import type { Customer } from '../../../core/types';
import { X } from 'lucide-react';

interface Props {
  initial?: Partial<Customer>;
  onSave: (c: Customer) => void;
  onCancel: () => void;
}

export function CustomerForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Partial<Customer>>({
    id: `c${Date.now()}`, name: '', email: '', phone: '',
    address: '', totalPurchases: 0, createdAt: new Date().toISOString().split('T')[0], ...initial,
  });

  function handleSave() {
    if (!form.name?.trim() || !form.phone?.trim()) return;
    onSave(form as Customer);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border p-6" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg">{initial?.id ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
          <button onClick={onCancel}><X size={20} /></button>
        </div>
        <div className="space-y-3">
          {([['name', 'Nombre completo'], ['email', 'Email'], ['phone', 'Teléfono'], ['address', 'Dirección']] as [keyof Customer, string][]).map(([k, label]) => (
            <div key={k}>
              <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-text-muted)' }}>{label}</label>
              <input value={form[k] as string} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onCancel} className="flex-1 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>Cancelar</button>
          <button onClick={handleSave} className="flex-1 py-2 rounded-lg text-sm font-bold text-white" style={{ background: 'var(--color-primary)' }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
