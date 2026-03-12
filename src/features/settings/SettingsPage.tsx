import { useState } from 'react';
import { useStore } from '../../infrastructure/store/useStore';
import type { StoreSettings } from '../../core/types';
import { Store, Save, Check } from 'lucide-react';

function Field({ label, name, value, onChange, type = 'text' }: {
  label: string; name: string; value: string | number;
  onChange: (k: keyof StoreSettings, v: string | number) => void; type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-text-muted)' }}>{label}</label>
      <input type={type} value={value}
        onChange={e => onChange(name as keyof StoreSettings, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2"
        style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
    </div>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings } = useStore();
  const [form, setForm] = useState<StoreSettings>(settings);
  const [saved, setSaved] = useState(false);

  function set(k: keyof StoreSettings, v: string | number) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function handleSave() {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Parámetros del negocio y sistema</p>
      </div>

      {/* Business info */}
      <section className="p-5 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2 mb-5">
          <Store size={18} style={{ color: 'var(--color-primary-light)' }} />
          <h2 className="font-semibold">Datos del Negocio</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre del Negocio" name="name" value={form.name} onChange={set} />
          <Field label="RFC / NIT" name="taxId" value={form.taxId} onChange={set} />
          <Field label="Teléfono" name="phone" value={form.phone} onChange={set} />
          <Field label="Email" name="email" value={form.email} onChange={set} />
          <div className="sm:col-span-2">
            <Field label="Dirección" name="address" value={form.address} onChange={set} />
          </div>
        </div>
      </section>

      {/* Financial settings */}
      <section className="p-5 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
        <h2 className="font-semibold mb-5">Configuración Fiscal y Moneda</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Tasa de Impuesto (%)" name="taxRate" value={form.taxRate} onChange={set} type="number" />
          <Field label="Moneda (código)" name="currency" value={form.currency} onChange={set} />
          <Field label="Símbolo de Moneda" name="currencySymbol" value={form.currencySymbol} onChange={set} />
        </div>
      </section>

      {/* Receipt */}
      <section className="p-5 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
        <h2 className="font-semibold mb-5">Ticket / Recibo</h2>
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-text-muted)' }}>Pie de ticket</label>
          <textarea value={form.receiptFooter} onChange={e => set('receiptFooter', e.target.value)} rows={3}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
            style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
        </div>
      </section>

      <button onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all"
        style={{ background: saved ? 'var(--color-success)' : 'var(--color-primary)' }}>
        {saved ? <Check size={18} /> : <Save size={18} />}
        {saved ? '¡Guardado!' : 'Guardar Cambios'}
      </button>
    </div>
  );
}
