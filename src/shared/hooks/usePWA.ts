import { useState, useEffect, useRef } from 'react';

type BeforeInstallPromptEvent = Event & { prompt: () => void };

export function usePWA() {
  const installPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    ('standalone' in navigator && (navigator as Navigator & { standalone: boolean }).standalone);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      installPrompt.current = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setCanInstall(false));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const promptInstall = () => installPrompt.current?.prompt();

  return { canInstall, isStandalone, promptInstall };
}
