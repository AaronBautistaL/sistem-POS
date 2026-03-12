import type { Product } from '../../../core/types';
import { useCornerColors } from '../../../shared/hooks/useCornerColors';
import clsx from 'clsx';

interface Props {
  p: Product;
  onAdd: () => void;
  sym: string;
}

export function ProductCard({ p, onAdd, sym }: Props) {
  const corners = useCornerColors(p.image);

  const containerBg = corners
    ? [
        `radial-gradient(ellipse at 0% 0%, rgb(${corners.tl}) 0%, transparent 65%)`,
        `radial-gradient(ellipse at 100% 0%, rgb(${corners.tr}) 0%, transparent 65%)`,
        `radial-gradient(ellipse at 0% 100%, rgb(${corners.bl}) 0%, transparent 65%)`,
        `radial-gradient(ellipse at 100% 100%, rgb(${corners.br}) 0%, transparent 65%)`,
        `rgb(${Math.round((corners.tl[0]+corners.tr[0]+corners.bl[0]+corners.br[0])/4)},${Math.round((corners.tl[1]+corners.tr[1]+corners.bl[1]+corners.br[1])/4)},${Math.round((corners.tl[2]+corners.tr[2]+corners.bl[2]+corners.br[2])/4)})`,
      ].join(', ')
    : 'var(--color-surface-3)';

  return (
    <button
      onClick={onAdd}
      disabled={p.stock === 0}
      className={clsx(
        'p-3 rounded-xl border text-left transition-all hover:scale-[1.02] hover:shadow-lg',
        p.stock === 0 && 'opacity-40 cursor-not-allowed'
      )}
      style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
    >
      <div className="w-full aspect-square rounded-lg mb-2 flex items-center justify-center text-2xl overflow-hidden"
        style={{ background: containerBg, transition: 'background 0.5s' }}>
        {p.image
          ? <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
          : '🛍️'}
      </div>
      <p className="text-xs font-semibold leading-tight line-clamp-2 mb-1">{p.name}</p>
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{p.sku}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="font-bold text-sm" style={{ color: 'var(--color-primary-light)' }}>{sym}{p.price}</span>
        <span className="text-xs px-1.5 py-0.5 rounded-full"
          style={{
            background: p.stock <= p.minStock ? '#ef444420' : '#10b98120',
            color: p.stock <= p.minStock ? 'var(--color-danger)' : 'var(--color-success)',
          }}>
          {p.stock} {p.unit}
        </span>
      </div>
    </button>
  );
}
