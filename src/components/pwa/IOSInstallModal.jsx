import React from 'react';
import { X, Share2, PlusSquare, Smartphone, CheckCircle2 } from 'lucide-react';

export const IOSInstallModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-bold text-lg shadow-inner">
              ₹
            </div>
            <div>
              <h3 className="font-bold text-base">Install Finora on iPhone / iPad</h3>
              <p className="text-xs text-emerald-100">Add to Home Screen via Safari</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Follow these 3 quick steps in Safari to install Finora as a standalone mobile app:
          </p>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-sm">
                1
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-medium text-slate-900 text-sm">
                  <span>Tap the</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-800 font-semibold text-xs">
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </span>
                  <span>button</span>
                </div>
                <p className="text-xs text-slate-500">
                  Located in the bottom navigation bar of Safari (or top bar on iPad).
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-sm">
                2
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-medium text-slate-900 text-sm">
                  <span>Select</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-800 font-semibold text-xs">
                    <PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Scroll down the Safari share sheet options to find it.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-sm">
                3
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-medium text-slate-900 text-sm">
                  <span>Tap</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-semibold text-xs">
                    Add
                  </span>
                  <span>in the top-right</span>
                </div>
                <p className="text-xs text-slate-500">
                  Finora will now appear on your home screen with its custom icon!
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
