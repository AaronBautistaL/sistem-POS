import { useState, useTransition } from 'react';
import { useStore } from '../../infrastructure/store/useStore';
import type { Product } from '../../core/types';
import { Plus, Search } from 'lucide-react';
import { ProductForm } from './components/ProductForm';
import { ProductTable } from './components/ProductTable';
import clsx from 'clsx';

export default function InventoryPage() {
  const { products, addProduct, updateProduct, deleteProduct, settings } = useStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [editProduct, setEditProduct] = useState<Product | null | 'new'>(null);
  const [, startTransition] = useTransition();
  const sym = settings.currencySymbol;

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'Todos' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  function handleSave(p: Product) {
    if (editProduct === 'new') addProduct(p);
    else if (editProduct) updateProduct(editProduct.id, p);
    setEditProduct(null);
  }

  return (
    <div className="space-y-5">
      {editProduct !== null && (
        <ProductForm initial={editProduct === 'new' ? {} : editProduct} onSave={handleSave} onCancel={() => setEditProduct(null)} />
      )}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Inventario</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{products.length} productos</p>
        </div>
        <button onClick={() => setEditProduct('new')}
          className="sm:ml-auto flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white text-sm"
          style={{ background: 'var(--color-primary)' }}>
          <Plus size={16} /> Nuevo Producto
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
          <input value={search} onChange={e => startTransition(() => setSearch(e.target.value))}
            placeholder="Buscar producto o SKU..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setCategoryFilter(c)}
              className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors')}
              style={{
                background: categoryFilter === c ? 'var(--color-primary)' : 'var(--color-surface-2)',
                color: categoryFilter === c ? 'white' : 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
              }}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <ProductTable products={filtered} sym={sym} onEdit={setEditProduct} onDelete={deleteProduct} />
    </div>
  );
}
