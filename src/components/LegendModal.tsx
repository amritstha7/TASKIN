import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const LegendModal: React.FC = () => {
  const { isLegendModalOpen, setIsLegendModalOpen, t } = useApp();

  if (!isLegendModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-white dark:bg-[#191c1f] rounded-2xl max-w-md w-full border border-[#FFD8CC] dark:border-[#5d3f3c] shadow-2xl overflow-hidden card-depth"
      >
        <div className="p-4 sm:p-5 bg-[#F7F7F8] dark:bg-[#26282b] border-b border-[#e5e5ea] dark:border-[#35383c] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#FF5500]">info</span>
            <h3 className="text-base font-black text-[#2C2C2E] dark:text-[#eff1f5]">
              Calendar Status Legend
            </h3>
          </div>
          <button
            onClick={() => setIsLegendModalOpen(false)}
            className="p-1 text-[#8E8E93] hover:text-[#2C2C2E] rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-3.5 text-xs">
          {/* Urgent Marker */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFF0EB] border border-[#FFD8CC]">
            <div className="w-8 h-8 rounded-full bg-[#FF5500] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </div>
            <div>
              <h4 className="font-bold text-[#FF5500]">Urgent Action Required</h4>
              <p className="text-[#8E8E93] dark:text-[#d8dade]">Critical compliance, safety, or priority tasks due today.</p>
            </div>
          </div>

          {/* Pending Tasks Dot */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFF9F6] border border-[#FFD8CC]">
            <div className="w-8 h-8 rounded-full bg-[#FF5500] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="w-3.5 h-3.5 rounded-full bg-white" />
            </div>
            <div>
              <h4 className="font-bold text-[#2C2C2E] dark:text-[#eff1f5]">Pending Store Task</h4>
              <p className="text-[#8E8E93] dark:text-[#d8dade]">Standard shift tasks, replenishment waves, and audits.</p>
            </div>
          </div>

          {/* Completed Checkmark / Green Dot */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#e1ffec] border border-[#008259]/20">
            <div className="w-8 h-8 rounded-full bg-[#008259] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
            </div>
            <div>
              <h4 className="font-bold text-[#008259]">Completed Actions</h4>
              <p className="text-[#2C2C2E] dark:text-[#d8dade]">All scheduled operations verified and signed off.</p>
            </div>
          </div>

          {/* Active Highlight Day */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F7F7F8] dark:bg-[#35383c] border border-[#e5e5ea]">
            <div className="w-8 h-8 rounded-xl bg-[#2C2C2E] text-white flex items-center justify-center shrink-0 font-bold text-xs">
              16
            </div>
            <div>
              <h4 className="font-bold text-[#2C2C2E] dark:text-[#eff1f5]">Active Shift / Focus Day</h4>
              <p className="text-[#8E8E93] dark:text-[#d8dade]">Selected date for day-level task scheduling and previews.</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#F7F7F8] dark:bg-[#26282b] border-t border-[#e5e5ea] dark:border-[#35383c] flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLegendModalOpen(false)}
            className="bg-[#FF5500] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#E04800] transition-colors cursor-pointer shadow-xs"
          >
            {t.done || 'Got it'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
