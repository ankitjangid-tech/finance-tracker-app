import React from 'react';
import { Download, CheckCircle2, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { IOSInstallModal } from './IOSInstallModal';
import { useFinance } from '../../context/FinanceContext';

export const PWAInstallButton = ({
  variant = 'header', // 'header', 'sidebar', 'settings', 'hero'
  className = '',
}) => {
  const {
    canInstall,
    isStandalone,
    isInstalled,
    isIOS,
    showIOSModal,
    setShowIOSModal,
    promptInstall,
  } = usePWAInstall();

  const { showToast } = useFinance();

  const handleInstallClick = async () => {
    const res = await promptInstall();
    if (res.outcome === 'accepted') {
      showToast({
        title: 'App Installed!',
        message: 'Finora is now installed on your device.',
        type: 'success',
      });
    } else if (res.outcome === 'already_installed') {
      showToast({
        title: 'Already Installed',
        message: 'Finora is already running in standalone mode.',
        type: 'info',
      });
    } else if (res.outcome === 'unsupported') {
      // If browser doesn't support automatic prompt (e.g. desktop safari/firefox)
      if (isIOS) {
        setShowIOSModal(true);
      } else {
        showToast({
          title: 'Installation Guide',
          message: 'To install, click the Install icon in your browser URL bar or Add to Home Screen in the browser menu.',
          type: 'info',
        });
      }
    }
  };

  // If already running inside standalone PWA mode
  if (isStandalone) {
    if (variant === 'settings') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Installed App (Standalone Mode)</span>
        </div>
      );
    }
    return null;
  }

  // Header Variant (Sleek icon/button)
  if (variant === 'header') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 border border-emerald-200/80 transition-all shadow-2xs cursor-pointer shrink-0 ${className}`}
          title="Install Finora as Progressive Web App"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Install App</span>
        </button>
        <IOSInstallModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />
      </>
    );
  }

  // Sidebar Variant (Card button)
  if (variant === 'sidebar') {
    return (
      <>
        <div className={`p-3 mx-4 my-2 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/80 ${className}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              <Download className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Install Finora App</span>
          </div>
          <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
            Get 1-click access and full offline capability on your home screen.
          </p>
          <button
            onClick={handleInstallClick}
            className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Download className="w-3 h-3" />
            <span>Install Now</span>
          </button>
        </div>
        <IOSInstallModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />
      </>
    );
  }

  // Settings Variant (Full action row)
  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs cursor-pointer ${className}`}
      >
        <Download className="w-4 h-4" />
        <span>Install Finora PWA</span>
      </button>
      <IOSInstallModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />
    </>
  );
};
