import { Menu, Search, Bell, Download, Maximize2, Minimize2, Sun, Moon } from 'lucide-react';

interface Props {
  isFullscreen: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  lowStockCount: number;
  isDark: boolean;
  onToggleMobile: () => void;
  onToggleFullscreen: () => void;
  onInstall: () => void;
  onToggleTheme: () => void;
}

export function Topbar({ isFullscreen, isStandalone, canInstall, lowStockCount, isDark, onToggleMobile, onToggleFullscreen, onInstall, onToggleTheme }: Props) {
  return (
    <header className="h-16 flex items-center gap-4 px-4 border-b border-[var(--color-border)]" style={{ background: 'var(--color-surface-2)' }}>
      <button className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-surface-3)]" onClick={onToggleMobile}>
        <Menu size={20} />
      </button>
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
          <input placeholder="Buscar..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none focus:ring-2"
            style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)', color: 'var(--color-text)', '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties} />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button onClick={onToggleTheme}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-3)] transition-colors"
            title={isDark ? 'Modo claro' : 'Modo oscuro'}>
            {isDark
              ? <Sun size={20} style={{ color: 'var(--color-text-muted)' }} />
              : <Moon size={20} style={{ color: 'var(--color-text-muted)' }} />}
          </button>
          {!isStandalone && (
          <button onClick={onToggleFullscreen}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-3)] transition-colors"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}>
            {isFullscreen
              ? <Minimize2 size={20} style={{ color: 'var(--color-text-muted)' }} />
              : <Maximize2 size={20} style={{ color: 'var(--color-text-muted)' }} />}
          </button>
        )}
        {canInstall && (
          <button onClick={onInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--color-primary)' }}>
            <Download size={14} /> Instalar app
          </button>
        )}
        <button className="relative p-2 rounded-lg hover:bg-[var(--color-surface-3)]">
          <Bell size={20} style={{ color: 'var(--color-text-muted)' }} />
          {lowStockCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 text-xs flex items-center justify-center rounded-full text-white font-bold" style={{ background: 'var(--color-danger)' }}>{lowStockCount}</span>
          )}
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'var(--color-primary)' }}>A</div>
      </div>
    </header>
  );
}
