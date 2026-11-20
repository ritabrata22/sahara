import React, { useState } from 'react';
import { Download, Smartphone, WifiOff, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface PWAInstallButtonProps {
  compact?: boolean;
  label?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  compact = false,
  label = 'Install Android App',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className={
          compact
            ? 'inline-flex items-center gap-1.5 rounded-xl bg-[#064E46] px-3 py-2 text-xs font-semibold text-white hover:bg-[#043B35] transition-colors min-h-[40px] whitespace-nowrap shrink-0'
            : 'w-full flex items-center justify-center gap-2 rounded-xl bg-[#064E46] px-4 py-3 text-sm font-semibold text-white hover:bg-[#043B35] transition-colors min-h-[48px]'
        }
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>{label}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#D4CFC3] bg-white px-3 py-2 text-xs font-semibold text-[#064E46] hover:bg-[#F7F3EA] transition-colors min-h-[40px] whitespace-nowrap shrink-0"
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          <span>Add to Home Screen</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-3xl bg-[#FCF9F2] p-6 border border-[#E5E0D5] shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[#0F2421]">Install sahara on iPhone / iPad</h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-[#EFECE4]"
                  aria-label="Close install instructions"
                >
                  <X className="w-5 h-5 text-[#526763]" />
                </button>
              </div>
              <p className="text-sm text-[#526763] leading-relaxed">
                1. Tap the <strong>Share</strong> icon in Safari.<br />
                2. Scroll down and select <strong>Add to Home Screen</strong>.
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-[#064E46] py-3 text-sm font-semibold text-white min-h-[44px]"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 lg:bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 flex items-center gap-2.5 rounded-xl bg-[#0F2421] px-4 py-2.5 text-xs font-medium text-[#FCF9F2] shadow-lg"
    >
      <WifiOff className="w-4 h-4 text-[#C8F3DC] shrink-0" />
      <span>Offline mode active · Entries saved on this phone</span>
    </div>
  );
};
