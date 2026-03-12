import { useState } from 'react';
import type { Customer } from '../../../core/types';
import { X } from 'lucide-react';

interface Props {
  customers: Customer[];
  onSelect: (c: Customer) => void;
  onClose: () => void;
}

export function CustomerPicker({ customers, onSelect, onClose }: Props) {
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-80 rounded-xl border p-4 shadow-xl" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Seleccionar Cliente</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar cliente..." className="w-full px-3 py-2 text-sm rounded-lg border outline-none mb-3"
          style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {filtered.map(c => (
            <button key={c.id} onClick={() => { onSelect(c); onClose(); }}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-surface-3)] text-left">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--color-primary)' }}>{c.name[0]}</div>
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{c.phone}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
