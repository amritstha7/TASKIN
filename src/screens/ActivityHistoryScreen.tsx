import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ActivityItem } from '../types';

export const ActivityHistoryScreen: React.FC = () => {
  const { activities, setCurrentScreen, t } = useApp();
  const [filter, setFilter] = useState<'all' | 'completed' | 'updated' | 'snoozed' | 'note_added'>('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  const filteredActivities = activities.filter((act) => {
    if (filter === 'all') return true;
    return act.type === filter;
  });

  const getIconForType = (type: ActivityItem['type']) => {
    switch (type) {
      case 'completed':
        return {
          icon: 'check_circle',
          bg: 'bg-[#008259] text-white',
          badgeBg: 'bg-[#e1ffec] text-[#008259] border border-[#008259]/20',
        };
      case 'updated':
      case 'created':
        return {
          icon: 'edit_document',
          bg: 'bg-[#FF5500] text-white',
          badgeBg: 'bg-[#FFF0EB] text-[#FF5500] border border-[#FFD8CC]',
        };
      case 'snoozed':
        return {
          icon: 'snooze',
          bg: 'bg-[#8E8E93] text-white',
          badgeBg: 'bg-[#F7F7F8] text-[#2C2C2E] border border-[#e5e5ea]',
        };
      case 'note_added':
      default:
        return {
          icon: 'sticky_note_2',
          bg: 'bg-[#FF5500] text-white',
          badgeBg: 'bg-[#FFF0EB] text-[#FF5500] border border-[#FFD8CC]',
        };
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5 animate-in fade-in duration-200 pb-12">
      {/* Sub-page Navigation Header */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentScreen('admin')}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#25282c] border border-[#e5e5ea] dark:border-[#35383c] hover:bg-[#F7F7F8] transition-colors text-[#2C2C2E] dark:text-[#eff1f5] cursor-pointer shadow-2xs"
          aria-label="Navigate back"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </motion.button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#2C2C2E] dark:text-[#eff1f5]">
            {t.activityHistory}
          </h1>
          <p className="text-xs text-[#8E8E93] dark:text-[#d8dade]">
            Audit trail of shift compliance, task actions, and associate logs
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(
          [
            { id: 'all', label: 'All Activities' },
            { id: 'completed', label: 'Completed' },
            { id: 'updated', label: 'Updated' },
            { id: 'snoozed', label: 'Snoozed' },
            { id: 'note_added', label: 'Notes' },
          ] as const
        ).map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-[#FF5500] text-white shadow-[0_2px_8px_rgba(255,85,0,0.25)]'
                : 'bg-white dark:bg-[#25282c] text-[#8E8E93] dark:text-[#d8dade] border border-[#e5e5ea] dark:border-[#35383c] hover:border-[#FF5500]/50'
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Main Activity List */}
      <div className="bg-white dark:bg-[#191c1f] border border-[#e5e5ea] dark:border-[#5d3f3c] rounded-2xl overflow-hidden card-depth transition-colors divide-y divide-[#e5e5ea] dark:divide-[#35383c]">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#8E8E93] dark:text-[#d8dade]">
            <span className="material-symbols-outlined text-4xl mb-2 text-[#8E8E93]">
              history
            </span>
            <p className="font-bold">No activity records found for this filter.</p>
          </div>
        ) : (
          filteredActivities.map((act) => {
            const style = getIconForType(act.type);

            return (
              <motion.div
                key={act.id}
                whileHover={{ x: 3 }}
                onClick={() => setSelectedActivity(act)}
                className="p-4 flex gap-3.5 items-start hover:bg-[#FFF9F6] dark:hover:bg-[#25282c] transition-colors cursor-pointer"
              >
                {/* Icon avatar */}
                <div
                  className={`mt-0.5 shrink-0 rounded-xl h-10 w-10 flex items-center justify-center shadow-xs ${style.bg}`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {style.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-sm font-bold text-[#2C2C2E] dark:text-[#eff1f5] truncate pr-2">
                      {act.title}
                    </p>
                    <span className="text-xs font-mono text-[#8E8E93] dark:text-[#d8dade] shrink-0">
                      {act.time}
                    </span>
                  </div>

                  <p className="text-xs text-[#8E8E93] dark:text-[#d8dade] mb-2 leading-relaxed">
                    {act.description}
                  </p>

                  <div className="flex gap-2 items-center flex-wrap">
                    <span className="inline-flex items-center rounded-md bg-[#F7F7F8] dark:bg-[#35383c] border border-[#e5e5ea] dark:border-[#4d2d2a] px-2 py-0.5 text-[10px] font-semibold text-[#2C2C2E] dark:text-[#eff1f5]">
                      {act.date}
                    </span>
                    {act.statusBadge && (
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${style.badgeBg}`}
                      >
                        {act.statusBadge}
                      </span>
                    )}
                  </div>
                </div>

                <span className="material-symbols-outlined text-[#8E8E93] text-[20px] self-center">
                  chevron_right
                </span>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white dark:bg-[#191c1f] rounded-2xl max-w-md w-full p-6 border border-[#FFD8CC] dark:border-[#5d3f3c] shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-base font-black text-[#2C2C2E] dark:text-[#eff1f5]">
                  Activity Log Entry
                </h3>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="p-1 rounded-lg text-[#8E8E93] hover:text-[#2C2C2E] cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-4 bg-[#F7F7F8] dark:bg-[#25282c] rounded-xl border border-[#e5e5ea] dark:border-[#35383c] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">Event:</span>
                  <strong className="text-[#2C2C2E] dark:text-[#eff1f5]">{selectedActivity.title}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">Timestamp:</span>
                  <span className="text-[#2C2C2E] dark:text-[#eff1f5] font-mono">
                    {selectedActivity.date} at {selectedActivity.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">Operator:</span>
                  <span className="text-[#2C2C2E] dark:text-[#eff1f5] font-semibold">{selectedActivity.user}</span>
                </div>
                <div className="pt-2 border-t border-[#e5e5ea] dark:border-[#35383c]">
                  <span className="text-[#8E8E93] block mb-1">Details:</span>
                  <p className="font-medium text-[#2C2C2E] dark:text-[#eff1f5] leading-relaxed">
                    {selectedActivity.description}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="bg-[#FF5500] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#E04800] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
