import { useStore } from '../../infrastructure/store/useStore';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrendingUp, ShoppingBag, Users, Package, AlertTriangle } from 'lucide-react';
import { weekSalesData, categorySalesData } from '../../data/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { StatCard } from './components/StatCard';

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function DashboardPage() {
  const { sales, products, customers, settings } = useStore();
  const sym = settings.currencySymbol;

  const today = new Date().toDateString();
  const todaySales = sales.filter(s => new Date(s.createdAt).toDateString() === today);
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
  const lowStock = products.filter(p => p.stock <= p.minStock);
  const recentSales = sales.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es })}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Ventas Hoy" value={`${sym}${todayTotal.toFixed(2)}`} sub={`${todaySales.length} tickets`} icon={TrendingUp} color="#6366f1" trend={12} />
        <StatCard title="Tickets Hoy" value={String(todaySales.length)} sub="transacciones" icon={ShoppingBag} color="#10b981" trend={8} />
        <StatCard title="Clientes" value={String(customers.length)} sub="registrados" icon={Users} color="#f59e0b" trend={3} />
        <StatCard title="Productos" value={String(products.length)} sub={`${lowStock.length} con stock bajo`} icon={Package} color={lowStock.length > 0 ? '#ef4444' : '#10b981'} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 p-5 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
          <h2 className="font-semibold mb-4">Ventas de la Semana</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weekSalesData}>
              <defs>
                <linearGradient id="gradVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f5a" />
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#2a2a3e', border: '1px solid #3f3f5a', borderRadius: '8px', color: '#e2e8f0' }} formatter={(v) => [`${sym}${Number(v).toFixed(2)}`, 'Ventas']} />
              <Area type="monotone" dataKey="ventas" stroke="#6366f1" strokeWidth={2} fill="url(#gradVentas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="p-5 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
          <h2 className="font-semibold mb-4">Ventas por Categoría</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categorySalesData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                {categorySalesData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#2a2a3e', border: '1px solid #3f3f5a', borderRadius: '8px', color: '#e2e8f0' }} formatter={(v) => [`${sym}${Number(v).toFixed(2)}`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {categorySalesData.slice(0, 4).map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                <span style={{ color: 'var(--color-text-muted)' }}>{d.name}</span>
                <span className="ml-auto font-medium">{sym}{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
          <h2 className="font-semibold mb-4">Últimas Ventas</h2>
          <div className="space-y-3">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--color-surface-3)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'var(--color-primary)' }}>{sale.cashierName[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{sale.customerName || 'Cliente General'}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {sale.items.length} producto{sale.items.length !== 1 ? 's' : ''} · {sale.paymentMethod === 'cash' ? 'Efectivo' : sale.paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'}
                  </p>
                </div>
                <span className="font-bold text-sm flex-shrink-0">{sym}{sale.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />
            <h2 className="font-semibold">Stock Bajo</h2>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold text-white" style={{ background: lowStock.length > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>{lowStock.length}</span>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-muted)' }}>✓ Todo el inventario está bien</p>
          ) : (
            <div className="space-y-2">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--color-surface-3)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{p.sku} · Mín: {p.minStock} {p.unit}</p>
                  </div>
                  <span className="text-sm font-bold px-2 py-1 rounded-lg" style={{ background: p.stock === 0 ? '#ef444430' : '#f59e0b30', color: p.stock === 0 ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                    {p.stock} {p.unit}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
