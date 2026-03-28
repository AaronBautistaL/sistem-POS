import { useRef, useState } from 'react';
import type { Sale } from '../../../core/types';
import type { StoreSettings } from '../../../core/types/settings';
import { ImageDown, Loader2, Copy, Check } from 'lucide-react';
import html2canvas from 'html2canvas';

const PAYMENT_LABELS = { cash: 'Efectivo', card: 'Tarjeta', transfer: 'Transferencia' };

interface Props {
  sale: Sale;
  sym: string;
  taxRate: number;
  receiptFooter: string;
  settings: StoreSettings;
  onNewSale: () => void;
}

export function ReceiptScreen({ sale, sym, taxRate, receiptFooter, settings, onNewSale }: Props) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<'share' | 'copy' | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');

  const date = new Date(sale.createdAt).toLocaleString('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function captureCanvas() {
    if (!receiptRef.current) throw new Error('no ref');
    return html2canvas(receiptRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
  }

  async function handleCopy() {
    setLoading('copy');
    try {
      const canvas = await captureCanvas();
      const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), 'image/png'));
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      showToast('✅ Imagen copiada — pégala en WhatsApp con Cmd+V');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      showToast('❌ No se pudo copiar, intenta descargar');
    } finally {
      setLoading(null);
    }
  }

  async function handleDownload() {
    setLoading('share');
    try {
      const canvas = await captureCanvas();
      const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), 'image/png'));
      const file = new File([blob], `ticket-${sale.id}.png`, { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `Ticket #${sale.id}` });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ticket-${sale.id}.png`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('📥 Imagen descargada');
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-lg"
          style={{ background: '#1e1e2e', border: '1px solid #3f3f5a' }}>
          {toast}
        </div>
      )}

      {/* Ticket visual */}
      <div ref={receiptRef} style={{
        background: '#ffffff', color: '#111827',
        fontFamily: '"Courier New", monospace',
        padding: '32px 28px', borderRadius: '8px',
        width: '380px', margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <p style={{ fontWeight: 800, fontSize: '18px', margin: 0 }}>{settings.name}</p>
          {settings.address && <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0' }}>{settings.address}</p>}
          {settings.phone && <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0' }}>Tel: {settings.phone}</p>}
          {settings.taxId && <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0' }}>RFC: {settings.taxId}</p>}
        </div>
        <div style={{ borderTop: '1px dashed #d1d5db', margin: '12px 0' }} />
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Ticket #</span><span style={{ fontWeight: 700, color: '#111827' }}>{sale.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Fecha</span><span>{date}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Cajero</span><span>{sale.cashierName}</span>
          </div>
          {sale.customerName && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Cliente</span><span>{sale.customerName}</span>
            </div>
          )}
        </div>
        <div style={{ borderTop: '1px dashed #d1d5db', margin: '12px 0' }} />
        <div style={{ fontSize: '13px', marginBottom: '12px' }}>
          {sale.items.map((item) => (
            <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>{item.quantity}x {item.productName}</span>
              <span style={{ fontWeight: 600 }}>{sym}{item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px dashed #d1d5db', margin: '12px 0' }} />
        <div style={{ fontSize: '13px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
            <span>Subtotal</span><span>{sym}{sale.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
            <span>IVA ({taxRate}%)</span><span>{sym}{sale.tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '16px', marginTop: '6px' }}>
            <span>TOTAL</span><span>{sym}{sale.total.toFixed(2)}</span>
          </div>
          {sale.paymentMethod === 'cash' && (<>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', marginTop: '4px' }}>
              <span>Pagado</span><span>{sym}{sale.amountPaid.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 700 }}>
              <span>Cambio</span><span>{sym}{sale.change.toFixed(2)}</span>
            </div>
          </>)}
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', marginTop: '4px' }}>
            <span>Forma de pago</span><span>{PAYMENT_LABELS[sale.paymentMethod]}</span>
          </div>
        </div>
        <div style={{ borderTop: '1px dashed #d1d5db', margin: '12px 0' }} />
        <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
          {receiptFooter && <p style={{ margin: '0 0 4px' }}>{receiptFooter}</p>}
          <p style={{ margin: 0, fontWeight: 700, color: '#111827' }}>¡Gracias por su compra!</p>
        </div>
      </div>

      {/* Botones */}
      <div className="space-y-2 max-w-sm mx-auto">
        <button onClick={handleCopy} disabled={loading !== null}
          className="w-full py-3 rounded-lg font-semibold text-white transition-colors hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: '#25D366' }}>
          {loading === 'copy' ? <Loader2 size={18} className="animate-spin" /> : copied ? <Check size={18} /> : <Copy size={18} />}
          {loading === 'copy' ? 'Copiando...' : copied ? '¡Copiado! Pega en WhatsApp con Cmd+V' : 'Copiar imagen para WhatsApp'}
        </button>
        <button onClick={handleDownload} disabled={loading !== null}
          className="w-full py-3 rounded-lg font-semibold transition-colors hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: 'var(--color-surface-3)', color: 'var(--color-text)' }}>
          {loading === 'share' ? <Loader2 size={18} className="animate-spin" /> : <ImageDown size={18} />}
          {loading === 'share' ? 'Descargando...' : 'Descargar imagen'}
        </button>
        <button onClick={onNewSale} disabled={loading !== null}
          className="w-full py-3 rounded-lg font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60"
          style={{ background: 'var(--color-primary)' }}>
          Nueva Venta
        </button>
      </div>
    </div>
  );
}

