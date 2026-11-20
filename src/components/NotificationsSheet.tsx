import React from 'react';
import { Bell, CheckCheck, ChevronRight, X } from 'lucide-react';
import { AppNotification, TabId } from '../types';

interface NotificationsSheetProps {
  isOpen: boolean;
  notifications: AppNotification[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onSelectNotification: (id: string, targetTab?: TabId) => void;
}

export const NotificationsSheet: React.FC<NotificationsSheetProps> = ({
  isOpen,
  notifications,
  onClose,
  onMarkAllRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Notifications"
    >
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#FCF9F2] border border-[#E5E0D5] shadow-2xl max-h-[85dvh] overflow-y-auto p-5 pb-8">
        <div className="w-10 h-1.5 bg-[#D4CFC3] rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#064E46]" />
            <h2 className="text-lg font-bold text-[#0F2421]">Updates</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onMarkAllRead}
              className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold text-[#064E46] hover:bg-[#EBF3F1] min-h-[40px]"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark read</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-[#EFECE4]"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5 text-[#526763]" />
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {notifications.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectNotification(item.id, item.targetTab)}
              className={`w-full text-left flex items-start justify-between gap-3 rounded-2xl border p-4 transition-colors ${
                item.read
                  ? 'bg-white border-[#E5E0D5]'
                  : 'bg-[#EBF3F1] border-[#BFD4CE]'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#0F2421]">{item.title}</p>
                  <span className="text-[11px] text-[#526763] shrink-0">{item.time}</span>
                </div>
                <p className="mt-1 text-xs text-[#526763] leading-relaxed">{item.body}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#526763] mt-1 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
