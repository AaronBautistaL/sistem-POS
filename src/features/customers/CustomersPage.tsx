import { useState } from 'react';
import { useStore } from '../../infrastructure/store/useStore';
import type { Customer } from '../../core/types';
import { Plus, Search, Edit3, Phone, Mail, ShoppingBag } from 'lucide-react';
import { CustomerForm } from './components/CustomerForm';
import { CustomerDrawer } from './components/CustomerDrawer';

export default function CustomersPage() {
  const { customers, sales, addCustomer, updateCustomer, settings } = useStore();
  const [search, setSearch] = useState('');
  const [editCustomer, setEditCustomer] = useState<Customer | null | 'new'>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const sym = settings.currencySymbol;

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  function handleSave(c: Customer) {
    if (editCustomer === 'new') addCustomer(c);
    else if (editCustomer) updateCustomer(editCustomer.id, c);
    setEditCustomer(null);
  }

  return (
    <div className="space-y-5">
      {editCustomer !== null && (
        <CustomerForm initial={editCustomer === 'new' ? {} : editCustomer} onSave={handleSave} onCancel={() => setEditCustomer(null)} />
      )}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{customers.length} registrados</p>
        </div>
        <button onClick={() => setEditCustomer('new')}
          className="sm:ml-auto flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white text-sm"
          style={{ background: 'var(--color-primary)' }}>
          <Plus size={16} /> Nuevo Cliente
        </button>
      </div>
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none"
          style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div key={c.id} onClick={() => setSelectedCustomer(c === selectedCustomer ? null : c)}
            className="p-4 rounded-xl border cursor-pointer transition-all hover:border-[var(--color-primary)]"
            style={{ background: 'var(--color-surface-2)', borderColor: selectedCustomer?.id === c.id ? 'var(--color-primary)' : 'var(--color-border)' }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0" style={{ background: 'var(--color-primary)' }}>{c.name[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{c.name}</p>
                <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  <Phone size={10} /> {c.phone}
                </div>
                {c.email && (
                  <div className="flex items-center gap-1 text-xs mt-0.5 truncate" style={{ color: 'var(--color-text-muted)' }}>
                    <Mail size={10} /> {c.email}
                  </div>
                )}
              </div>
              <button onClick={e => { e.stopPropagation(); setEditCustomer(c); }} className="p-1.5 rounded hover:bg-[var(--color-surface-3)]">
                <Edit3 size={14} style={{ color: 'var(--color-text-muted)' }} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <ShoppingBag size={10} />
                {sales.filter(s => s.customerId === c.id).length} compras
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--color-primary-light)' }}>{sym}{c.totalPurchases.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
      {selectedCustomer && (
        <CustomerDrawer customer={selectedCustomer} sales={sales} sym={sym} onClose={() => setSelectedCustomer(null)} />
      )}
    </div>
  );
}
