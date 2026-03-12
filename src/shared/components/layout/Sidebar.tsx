import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, BarChart3, Settings, Menu, X, Store } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/pos', label: 'Punto de Venta', icon: ShoppingCart },
  { to: '/inventory', label: 'Inventario', icon: Package },
  { to: '/customers', label: 'Clientes', icon: Users },
  { to: '/reports', label: 'Reportes', icon: BarChart3 },
  { to: '/settings', label: 'Configuración', icon: Settings },
];

interface Props {
  storeName: string;
  sidebarOpen: boolean;
  mobileOpen: boolean;
  cartCount: number;
  lowStockCount: number;
  onToggle: () => void;
}

export function Sidebar({ storeName, sidebarOpen, mobileOpen, cartCount, lowStockCount, onToggle }: Props) {
  return (
    <aside className={clsx(
      'fixed lg:relative z-50 h-full flex flex-col transition-all duration-300',
      'border-r border-[var(--color-border)]',
      sidebarOpen ? 'w-64' : 'w-16',
      mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    )} style={{ background: 'var(--color-surface-2)' }}>
      <div className="flex items-center gap-3 p-4 border-b border-[var(--color-border)] h-16">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
          <Store size={18} className="text-white" />
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <p className="font-bold text-sm leading-tight truncate">{storeName}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Sistema POS</p>
          </div>
        )}
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium',
              isActive ? 'text-white' : 'hover:bg-[var(--color-surface-3)]',
              !sidebarOpen && 'justify-center',
            )}
            style={({ isActive }) => isActive ? { background: 'var(--color-primary)' } : { color: 'var(--color-text-muted)' }}
          >
            <Icon size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="truncate">{label}</span>}
            {sidebarOpen && label === 'Punto de Venta' && cartCount > 0 && (
              <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold text-white" style={{ background: 'var(--color-warning)' }}>{cartCount}</span>
            )}
            {sidebarOpen && label === 'Inventario' && lowStockCount > 0 && (
              <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold text-white" style={{ background: 'var(--color-danger)' }}>{lowStockCount}</span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-2 border-t border-[var(--color-border)]">
        <button onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-[var(--color-surface-3)] transition-colors"
          style={{ color: 'var(--color-text-muted)' }}>
          {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          {sidebarOpen && <span className="text-xs">Colapsar</span>}
        </button>
      </div>
    </aside>
  );
}
