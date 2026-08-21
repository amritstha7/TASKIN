import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const NotificationModal: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, tasks, showToast, setCurrentScreen, t } = useApp();

  if (!isNotificationsOpen) return null;

  const urgentTasks = tasks.filter((taskItem) => taskItem.isUrgent && !taskItem.completed);

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
            <h3 className="text-base font-black text-[#2C2C2E] dark:text-[#eff1f5]">
              Store Alerts &amp; Notifications
            </h3>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="p-1 text-[#8E8E93] hover:text-[#2C2C2E] rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Notifications list */}
        <div className="p-4 sm:p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {urgentTasks.length > 0 && (
            <div className="bg-[#FFF0EB] border border-[#FFD8CC] rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FF5500]">
                <span className="material-symbols-outlined text-[18px]">warning</span>
                Immediate Attention Required ({urgentTasks.length})
              </div>
              <div className="space-y-1.5 pl-6">
                {urgentTasks.map((tItem) => (
                  <div key={tItem.id} className="text-xs text-[#2C2C2E] dark:text-[#eff1f5]">
                    • <strong>{tItem.title}</strong> — {tItem.description.slice(0, 50)}...
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System store alerts */}
          <div className="p-3.5 rounded-xl border border-[#e5e5ea] dark:border-[#35383c] bg-[#F7F7F8] dark:bg-[#25282c] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#008259] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">sync</span>
            </div>
            <div className="flex-1 text-xs">
              <div className="flex justify-between items-start">
                <span className="font-bold text-[#2C2C2E] dark:text-[#eff1f5]">Data Sync Status</span>
                <span className="text-[10px] text-[#8E8E93] dark:text-[#d8dade]">Just Now</span>
              </div>
              <p className="text-[#8E8E93] dark:text-[#d8dade] mt-0.5">
                Handheld scanner and task telemetry synchronized with Branch #402 central station.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#e5e5ea] dark:border-[#35383c] bg-[#F7F7F8] dark:bg-[#25282c] flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FF5500] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            </div>
            <div className="flex-1 text-xs">
              <div className="flex justify-between items-start">
                <span className="font-bold text-[#2C2C2E] dark:text-[#eff1f5]">Replenishment Wave Inbound</span>
                <span className="text-[10px] text-[#8E8E93] dark:text-[#d8dade]">17:00</span>
              </div>
              <p className="text-[#8E8E93] dark:text-[#d8dade] mt-0.5">
                Central depot truck #4029 arriving with 120 cold beverage cartons.
              </p>
            </div>
          </div>
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
            onClick={() => {
              setIsNotificationsOpen(false);
              showToast('All notifications marked as read');
            }}
            className="bg-[#FF5500] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#E04800] transition-colors cursor-pointer shadow-xs"
          >
            Mark all read
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
