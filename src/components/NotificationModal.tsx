import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationModal: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, showToast, setCurrentScreen } = useApp();
  const { notifications, unreadCount, readSet, markAllRead } = useNotifications();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-white dark:bg-[#191c1f] rounded-2xl max-w-lg w-full border border-[#FFD8CC] dark:border-[#5d3f3c] shadow-2xl overflow-hidden card-depth"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#F7F7F8] dark:bg-[#26282b] border-b border-[#e5e5ea] dark:border-[#35383c] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#FF5500]">notifications_active</span>
            <div>
              <h3 className="text-base font-black text-[#2C2C2E] dark:text-[#eff1f5]">
                Store Alerts &amp; Notifications
              </h3>
              <p className="text-[11px] text-[#8E8E93] dark:text-[#8e9095]">
                {unreadCount > 0 ? `${unreadCount} unread urgent task${unreadCount === 1 ? '' : 's'}` : 'All caught up'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="p-1 text-[#8E8E93] hover:text-[#2C2C2E] rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Notifications list */}
        <div className="p-4 sm:p-5 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-[36px] text-[#8E8E93] dark:text-[#8e9095]">
                notifications_off
              </span>
              <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-2">
                No urgent tasks — you&apos;ll see a notification here when one needs attention.
              </p>
            </div>
          ) : (
            notifications.map((tItem) => {
              const isRead = readSet.has(tItem.id);
              return (
                <div
                  key={tItem.id}
                  className={`flex items-start gap-3 rounded-xl border p-3.5 ${
                    isRead
                      ? 'border-[#e5e5ea] dark:border-[#35383c] bg-white dark:bg-[#191c1f]'
                      : 'border-[#FFD8CC] dark:border-[#5d3f3c] bg-[#FFF0EB] dark:bg-[#2e3134]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#d81b1b] text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      {!isRead && <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />}
                      <span className="font-bold text-[#2C2C2E] dark:text-[#eff1f5]">{tItem.title}</span>
                    </div>
                    <p className="text-[#8E8E93] dark:text-[#d8dade] mt-0.5">
                      {tItem.category} · Due {tItem.dueDate.split('-').reverse().join('/')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F7F7F8] dark:bg-[#26282b] border-t border-[#e5e5ea] dark:border-[#35383c] flex justify-between items-center">
          <button
            onClick={() => {
              setIsNotificationsOpen(false);
              setCurrentScreen('activity');
            }}
            className="text-xs font-bold text-[#FF5500] dark:text-[#ffb4ac] hover:underline cursor-pointer"
          >
            View Full Activity Log &rarr;
          </button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            disabled={unreadCount === 0}
            onClick={() => {
              markAllRead();
              showToast('All notifications marked as read');
            }}
            className="bg-[#FF5500] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#E04800] transition-colors cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark all read
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
