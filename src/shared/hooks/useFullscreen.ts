import { useState, useEffect, useCallback } from 'react';

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);

  useEffect(() => {
    let wasFullscreen = false;
    const handler = () => {
      const nowFullscreen = !!document.fullscreenElement;
      if (wasFullscreen && !nowFullscreen) setShowRestoreBanner(true);
      if (nowFullscreen) setShowRestoreBanner(false);
      wasFullscreen = nowFullscreen;
      setIsFullscreen(nowFullscreen);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const dismissBanner = useCallback(() => setShowRestoreBanner(false), []);

  return { isFullscreen, showRestoreBanner, toggleFullscreen, dismissBanner };
}
