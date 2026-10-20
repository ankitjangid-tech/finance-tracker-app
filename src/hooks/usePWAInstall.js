import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage PWA installation, standalone detection, iOS instructions, and network status
 */
export const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    // 1. Detect standalone mode (already installed PWA)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
      if (isStandaloneMode) {
        setIsInstalled(true);
      }
    };
    checkStandalone();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e) => {
      setIsStandalone(e.matches);
      if (e.matches) setIsInstalled(true);
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    // 2. Detect iOS (Safari doesn't support beforeinstallprompt)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIosDevice);

    // 3. Listen for browser install prompt (Chrome, Edge, Samsung Internet, Android WebViews)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    // 4. Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowIOSModal(false);
    };

    // 5. Network status listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (isStandalone) {
      return { outcome: 'already_installed' };
    }

    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const choice = await installPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setInstallPrompt(null);
          return { outcome: 'accepted' };
        } else {
          return { outcome: 'dismissed' };
        }
      } catch (err) {
        console.error('PWA install prompt error:', err);
        return { outcome: 'error', error: err };
      }
    }

    if (isIOS) {
      setShowIOSModal(true);
      return { outcome: 'ios_instructions' };
    }

    return { outcome: 'unsupported' };
  }, [installPrompt, isIOS, isStandalone]);

  return {
    canInstall: !isStandalone && (Boolean(installPrompt) || isIOS),
    isStandalone,
    isInstalled,
    isIOS,
    isOnline,
    showIOSModal,
    setShowIOSModal,
    promptInstall,
  };
};
