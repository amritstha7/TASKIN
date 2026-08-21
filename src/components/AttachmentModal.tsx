import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const AttachmentModal: React.FC = () => {
  const { selectedAttachment, setSelectedAttachment, showToast, t } = useApp();

  if (!selectedAttachment) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-white dark:bg-[#191c1f] rounded-2xl max-w-xl w-full border border-[#FFD8CC] dark:border-[#5d3f3c] shadow-2xl overflow-hidden card-depth"
      >
        {/* Header */}
        <div className="bg-[#F7F7F8] dark:bg-[#26282b] p-4 sm:p-5 border-b border-[#e5e5ea] dark:border-[#35383c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFF0EB] text-[#FF5500] flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">description</span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#2C2C2E] dark:text-[#eff1f5]">
                {selectedAttachment.attachmentName || 'Operational Document'}
              </h3>
              <p className="text-[11px] text-[#8E8E93] dark:text-[#d8dade]">
                Size: {selectedAttachment.attachmentSize || '1.8 MB'} • Due: {selectedAttachment.dueDate}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedAttachment(null)}
            className="p-1.5 text-[#8E8E93] hover:text-[#2C2C2E] hover:bg-[#e5e5ea] dark:hover:bg-[#414448] rounded-xl transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </motion.button>
        </div>

        {/* Document Preview Content */}
        <div className="p-5 sm:p-6 text-xs text-[#2C2C2E] dark:text-[#eff1f5] space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="bg-[#FFF9F6] dark:bg-[#25282c] p-3.5 rounded-xl border border-[#FFD8CC]">
            <span className="font-black text-[#FF5500] dark:text-[#ffb4ac] uppercase text-[10px] tracking-wider block mb-1">
              Store Operations Directive
            </span>
            <h4 className="font-black text-sm">{selectedAttachment.title}</h4>
            <p className="mt-1 text-[#8E8E93] dark:text-[#d8dade] leading-relaxed">
              {selectedAttachment.description}
            </p>
          </div>

          <div className="border border-[#e5e5ea] dark:border-[#35383c] rounded-xl p-4 bg-[#F7F7F8] dark:bg-[#25282c] space-y-3">
            <div className="flex items-center justify-between border-b border-[#e5e5ea] dark:border-[#35383c] pb-2">
              <span className="font-bold">Required Actions:</span>
              <span className="text-[10px] font-bold text-[#008259] bg-[#e1ffec] px-2.5 py-0.5 rounded-full border border-[#008259]/20">
                Store Wide
              </span>
            </div>
            <ul className="space-y-1.5 list-disc pl-4 text-[#8E8E93] dark:text-[#d8dade]">
              <li>Verify shelf stock counts with handheld scanner before shift handoff.</li>
              <li>Acknowledge compliance checklist by assigned department lead.</li>
              <li>Report any batch count discrepancies to the regional supply coordinator.</li>
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-[#F7F7F8] dark:bg-[#26282b] p-4 border-t border-[#e5e5ea] dark:border-[#35383c] flex items-center justify-between">
          <button
            onClick={() => {
              showToast(`Downloaded ${selectedAttachment.attachmentName || 'document'} successfully.`);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-[#FF5500] dark:text-[#ffb4ac] hover:underline cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Download File
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedAttachment(null)}
            className="bg-[#FF5500] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#E04800] transition-colors cursor-pointer shadow-xs"
          >
            {t.done || 'Done'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
