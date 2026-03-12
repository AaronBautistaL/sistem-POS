import clsx from 'clsx';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function NumPad({ value, onChange }: Props) {
  const keys = ['7','8','9','4','5','6','1','2','3','C','0','.'];
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {keys.map(k => (
        <button key={k} onClick={() => { if (k === 'C') onChange(''); else onChange(value + k); }}
          className={clsx('py-3 rounded-lg text-sm font-bold transition-colors', k === 'C' ? 'text-red-400 hover:bg-red-400/20' : 'hover:bg-[var(--color-surface-3)]')}
          style={{ background: 'var(--color-surface-3)' }}>
          {k}
        </button>
      ))}
    </div>
  );
}
