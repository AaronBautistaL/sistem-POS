import { Maximize2, X } from 'lucide-react';

interface Props {
  onRestore: () => void;
  onDismiss: () => void;
}

export function RestoreBanner({ onRestore, onDismiss }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2 text-sm" style={{ background: 'var(--color-primary)', color: 'white' }}>
      <span>Saliste de pantalla completa</span>
      <div className="flex items-center gap-2">
        <button onClick={onRestore} className="flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold text-xs transition-opacity hover:opacity-80" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <Maximize2 size={13} /> Restaurar
        </button>
        <button onClick={onDismiss} className="p-1 rounded hover:opacity-70">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
