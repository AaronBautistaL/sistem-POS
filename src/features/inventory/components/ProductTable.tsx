import type { Product } from '../../../core/types';
import { Edit3, Trash2, AlertTriangle, Check } from 'lucide-react';

interface Props {
  products: Product[];
  sym: string;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductTable({ products, sym, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
              {['Producto', 'SKU', 'Categoría', 'Precio', 'Costo', 'Stock', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-xs" style={{ color: 'var(--color-text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.id} className="border-t transition-colors hover:bg-[var(--color-surface-2)]"
                style={{ borderColor: 'var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'var(--color-surface-2)40' }}>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>{p.sku}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'var(--color-primary)20', color: 'var(--color-primary-light)' }}>{p.category}</span>
                </td>
                <td className="px-4 py-3 font-semibold">{sym}{p.price}</td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>{sym}{p.cost}</td>
                <td className="px-4 py-3">
                  <span className="font-bold">{p.stock}</span>
                  <span className="text-xs ml-1" style={{ color: 'var(--color-text-muted)' }}>{p.unit}</span>
                </td>
                <td className="px-4 py-3">
                  {p.stock === 0 ? (
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: '#ef444420', color: 'var(--color-danger)' }}>
                      <AlertTriangle size={10} /> Agotado
                    </span>
                  ) : p.stock <= p.minStock ? (
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: '#f59e0b20', color: 'var(--color-warning)' }}>
                      <AlertTriangle size={10} /> Stock bajo
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: '#10b98120', color: 'var(--color-success)' }}>
                      <Check size={10} /> OK
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(p)} className="p-1.5 rounded hover:bg-[var(--color-surface-3)]">
                      <Edit3 size={14} style={{ color: 'var(--color-primary-light)' }} />
                    </button>
                    <button onClick={() => onDelete(p.id)} className="p-1.5 rounded hover:bg-red-400/20">
                      <Trash2 size={14} style={{ color: 'var(--color-danger)' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
