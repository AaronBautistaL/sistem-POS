import { ArrowUpRight } from 'lucide-react';

interface Props {
  title: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: string;
  trend?: number;
}

export function StatCard({ title, value, sub, icon: Icon, color, trend }: Props) {
  return (
    <div className="p-5 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg" style={{ background: `${color}20` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trend !== undefined && (
          <span className="flex items-center gap-1 text-xs font-medium" style={{ color: trend >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            <ArrowUpRight size={14} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm font-medium mb-0.5">{title}</p>
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{sub}</p>
    </div>
  );
}
