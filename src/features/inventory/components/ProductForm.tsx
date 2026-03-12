import { useState, useRef } from 'react';
import type { Product } from '../../../core/types';
import { X, ImagePlus } from 'lucide-react';
import clsx from 'clsx';

const CATEGORIES = ['Bebidas', 'Botanas', 'Panadería', 'Lácteos', 'Abarrotes', 'Limpieza', 'Dulcería', 'Otro'];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

interface Props {
  initial?: Partial<Product>;
  onSave: (p: Product) => void;
  onCancel: () => void;
}

export function ProductForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Partial<Product>>({
    id: `p${Date.now()}`, name: '', sku: '', category: 'Abarrotes',
    price: 0, cost: 0, stock: 0, minStock: 5, unit: 'pza', ...initial,
  });
  const [imageError, setImageError] = useState('');
  const set = (k: keyof Product, v: string | number) => setForm(f => ({ ...f, [k]: v }));
  const fileInputRef = useRef<HTMLInputElement>(null);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError('La imagen no puede superar 2MB');
      return;
    }
    setImageError('');
    const reader = new FileReader();
    reader.onload = () => set('image', reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!form.name?.trim()) return;
    if (!form.sku?.trim()) return;
    if ((form.price ?? 0) < 0 || (form.cost ?? 0) < 0) return;
    onSave(form as Product);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border p-6 shadow-xl"
        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg">{initial?.id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button onClick={onCancel}><X size={20} /></button>
        </div>

        {/* Image upload */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface-3)' }}
            onClick={openFilePicker}>
            {form.image
              ? <img src={form.image} alt="producto" className="w-full h-full object-contain p-1" />
              : <ImagePlus size={24} style={{ color: 'var(--color-text-muted)' }} />}
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Foto del producto</p>
            <button type="button" onClick={openFilePicker}
              className="px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors hover:bg-[var(--color-surface-3)]"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
              {form.image ? 'Cambiar foto' : 'Subir foto'}
            </button>
            {form.image && (
              <button type="button" onClick={() => setForm(f => ({ ...f, image: undefined }))}
                className="ml-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors hover:bg-red-400/20"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-danger)' }}>
                Eliminar
              </button>
            )}
            {imageError && <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>{imageError}</p>}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {([
            ['name', 'Nombre', 'text', 2], ['sku', 'SKU', 'text', 1],
            ['barcode', 'Código de Barras', 'text', 1], ['category', 'Categoría', 'select', 1],
            ['price', 'Precio Venta', 'number', 1], ['cost', 'Costo', 'number', 1],
            ['stock', 'Stock Actual', 'number', 1], ['minStock', 'Stock Mínimo', 'number', 1],
            ['unit', 'Unidad', 'text', 1],
          ] as [keyof Product, string, string, number][]).map(([k, label, type, span]) => (
            <div key={k} className={clsx('flex flex-col gap-1', span === 2 && 'col-span-2')}>
              <label className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>{label}</label>
              {type === 'select' ? (
                <select value={form[k] as string} onChange={e => set(k, e.target.value)}
                  className="px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              ) : (
                <input type={type} value={form[k] as string | number}
                  onChange={e => set(k, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                  className="px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onCancel} className="flex-1 py-2 rounded-lg border text-sm font-medium"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>Cancelar</button>
          <button onClick={handleSave} className="flex-1 py-2 rounded-lg text-sm font-bold text-white" style={{ background: 'var(--color-primary)' }}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
