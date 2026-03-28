import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useStore } from '../../../infrastructure/store/useStore';
import { useFullscreen } from '../../hooks/useFullscreen';
import { usePWA } from '../../hooks/usePWA';
import { useAuth } from '../../../features/auth/useAuth';
import LoginScreen from '../../../features/auth/LoginScreen';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { RestoreBanner } from './RestoreBanner';

function maximizeWindow() {
  window.moveTo(0, 0);
  window.resizeTo(screen.availWidth, screen.availHeight);
}

export default function Layout() {
  const { settings, sidebarOpen, toggleSidebar, cart, products } = useStore();
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('light', !isDark);
  }, [isDark]);

  const { isFullscreen, showRestoreBanner, toggleFullscreen, dismissBanner } = useFullscreen();
  const { canInstall, isStandalone, promptInstall } = usePWA();

  function handleLoginSuccess() {
    if (isStandalone) {
      maximizeWindow();
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  const { isLoggedIn, handleLogin } = useAuth(handleLoginSuccess);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-surface)' }}>
      {!isLoggedIn && <LoginScreen onLogin={handleLogin} />}

      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <Sidebar
        storeName={settings.name}
        sidebarOpen={sidebarOpen}
        mobileOpen={mobileOpen}
        cartCount={cartCount}
        lowStockCount={lowStockCount}
        onToggle={toggleSidebar}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          isFullscreen={isFullscreen}
          isStandalone={!!isStandalone}
          canInstall={canInstall}
          lowStockCount={lowStockCount}
          isDark={isDark}
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
          onToggleFullscreen={toggleFullscreen}
          onInstall={promptInstall}
          onToggleTheme={() => setIsDark(d => !d)}
        />

        {showRestoreBanner && !isStandalone && (
          <RestoreBanner onRestore={toggleFullscreen} onDismiss={dismissBanner} />
        )}

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
