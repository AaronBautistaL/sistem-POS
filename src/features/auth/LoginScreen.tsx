import { useState } from 'react';
import { Store, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useStore } from '../../infrastructure/store/useStore';
import { AuthService } from './AuthService';

interface Props {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const { settings } = useStore();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (AuthService.isLocked()) { setLocked(true); return; }
    setLoading(true);
    setTimeout(() => {
      if (AuthService.validate(user, pass)) {
        setError(false);
        onLogin();
      } else {
        setError(true);
        setLocked(AuthService.isLocked());
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'var(--color-surface)' }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl" style={{ background: 'var(--color-primary)' }}>
            <Store size={40} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">{settings.name}</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Sistema POS</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Usuario</label>
            <input type="text" value={user} onChange={e => { setUser(e.target.value); setError(false); }} autoComplete="username"
              placeholder="Ingresa tu usuario" disabled={locked}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)', '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Contraseña</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={pass} onChange={e => { setPass(e.target.value); setError(false); }}
                autoComplete="current-password" placeholder="Ingresa tu contraseña" disabled={locked}
                className="w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none focus:ring-2"
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)', '--tw-ring-color': 'var(--color-primary)' } as React.CSSProperties} />
              <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: 'var(--color-text-muted)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && !locked && (
            <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg" style={{ background: '#ef444420', color: 'var(--color-danger)' }}>
              <AlertCircle size={15} /> Usuario o contraseña incorrectos
            </div>
          )}
          {locked && (
            <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg" style={{ background: '#ef444420', color: 'var(--color-danger)' }}>
              <AlertCircle size={15} /> Demasiados intentos. Recarga la página para intentar de nuevo.
            </div>
          )}
          <button type="submit" disabled={loading || !user || !pass || locked}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            style={{ background: 'var(--color-primary)' }}>
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
