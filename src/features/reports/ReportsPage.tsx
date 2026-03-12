import { useState } from 'react';
import { useStore } from '../../infrastructure/store/useStore';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, ShoppingBag, Package, Users } from 'lucide-react';
import { weekSalesData } from '../../data/mockData';

const PERIODS = ['Hoy', 'Esta semana', 'Este mes', 'Este año'];

export default function ReportsPage() {
  const { sales, products, customers, settings } = useStore();
  const [period, setPeriod] = useState('Esta semana');
  const sym = settings.currencySymbol;

  const totalRevenue = sales.reduce((s, x) => s + x.total, 0);
  const totalCost = sales.reduce((s, sale) => {
    return s + sale.items.reduce((si, item) => {
      const p = products.find(pr => pr.id === item.productId);
      return si + (p?.cost || 0) * item.quantity;
    }, 0);
  }, 0);
  const grossProfit = totalRevenue - totalCost;
  const margin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  // Top products
  const productSales: Record<string, { name: string; qty: number; revenue: number }> = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      if (!productSales[item.productId]) productSales[item.productId] = { name: item.productName, qty: 0, revenue: 0 };
      productSales[item.productId].qty += item.quantity;
      productSales[item.productId].revenue += item.subtotal;
    });
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 8);

  // Payment breakdown
  const paymentBreakdown = {
    cash: sales.filter(s => s.paymentMethod === 'cash').reduce((sum, s) => sum + s.total, 0),
    card: sales.filter(s => s.paymentMethod === 'card').reduce((sum, s) => sum + s.total, 0),
    transfer: sales.filter(s => s.paymentMethod === 'transfer').reduce((sum, s) => sum + s.total, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reportes</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Análisis de ventas y rendimiento</p>
        </div>
        <div className="sm:ml-auto flex gap-2">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                background: period === p ? 'var(--color-primary)' : 'var(--color-surface-2)',
                color: period === p ? 'white' : 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
              }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Ingresos Totales', value: `${sym}${totalRevenue.toFixed(2)}`, icon: TrendingUp, color: '#6366f1' },
          { label: 'Ganancia Bruta', value: `${sym}${grossProfit.toFixed(2)}`, icon: Package, color: '#10b981' },
          { label: 'Margen', value: `${margin.toFixed(1)}%`, icon: TrendingUp, color: '#f59e0b' },
          { label: 'Transacciones', value: String(sales.length), icon: ShoppingBag, color: '#8b5cf6' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon size={16} style={{ color }} />
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
            </div>
            <p className="text-xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
          <h2 className="font-semibold mb-4">Ventas Diarias</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weekSalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f5a" />
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#2a2a3e', border: '1px solid #3f3f5a', borderRadius: '8px', color: '#e2e8f0' }}
                formatter={(v) => [`${sym}${Number(v).toFixed(2)}`, 'Ventas']} />
              <Bar dataKey="ventas" radius={[4, 4, 0, 0]}>
                {weekSalesData.map((_, i) => <Cell key={i} fill={i === weekSalesData.length - 1 ? '#6366f1' : '#6366f160'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
          <h2 className="font-semibold mb-4">Tickets por Día</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={weekSalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f5a" />
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#2a2a3e', border: '1px solid #3f3f5a', borderRadius: '8px', color: '#e2e8f0' }} />
              <Line type="monotone" dataKey="tickets" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products + Payment methods */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 p-5 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
          <h2 className="font-semibold mb-4">Productos Más Vendidos</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f5a" />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#2a2a3e', border: '1px solid #3f3f5a', borderRadius: '8px', color: '#e2e8f0' }}
                formatter={(v) => [`${sym}${Number(v).toFixed(2)}`, 'Ingresos']} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
          <h2 className="font-semibold mb-4">Métodos de Pago</h2>
          <div className="space-y-3 mt-4">
            {[
              { label: 'Efectivo', value: paymentBreakdown.cash, color: '#10b981' },
              { label: 'Tarjeta', value: paymentBreakdown.card, color: '#6366f1' },
              { label: 'Transferencia', value: paymentBreakdown.transfer, color: '#f59e0b' },
            ].map(({ label, value, color }) => {
              const pct = totalRevenue > 0 ? (value / totalRevenue) * 100 : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                    <span className="font-semibold">{sym}{value.toFixed(2)}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'var(--color-surface-3)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <p className="text-xs mt-0.5 text-right" style={{ color: 'var(--color-text-muted)' }}>{pct.toFixed(1)}%</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users size={16} style={{ color: 'var(--color-text-muted)' }} />
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Clientes activos</span>
              </div>
              <span className="font-bold">{customers.filter(c => c.lastPurchase).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
