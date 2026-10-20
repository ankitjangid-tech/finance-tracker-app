import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showRestoredNotice, setShowRestoredNotice] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestoredNotice(true);
      const timer = setTimeout(() => setShowRestoredNotice(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestoredNotice(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showRestoredNotice) {
    return null;
  }

  if (showRestoredNotice) {
    return (
      <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-1.5 flex items-center justify-center gap-2 transition-all animate-in slide-in-from-top duration-200 sticky top-0 z-40 shadow-xs">
        <Wifi className="w-3.5 h-3.5" />
        <span>Back online — Finora is fully active.</span>
      </div>
    );
  }

  return (
    <div className="bg-amber-600 text-white text-xs font-semibold px-4 py-1.5 flex items-center justify-center gap-2 transition-all animate-in slide-in-from-top duration-200 sticky top-0 z-40 shadow-xs">
      <WifiOff className="w-3.5 h-3.5" />
      <span>Offline Mode — All changes, transactions & exports are saved locally on your device.</span>
    </div>
  );
};
