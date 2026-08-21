import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const ExportReportModal: React.FC = () => {
  const { isExportReportModalOpen, setIsExportReportModalOpen, tasks, communications, topPerformers, showToast, t } = useApp();
  const [reportFormat, setReportFormat] = useState<'csv' | 'pdf' | 'json'>('csv');

  if (!isExportReportModalOpen) return null;

  const handleDownload = () => {
    if (reportFormat === 'csv') {
      const headers = 'ID,Title,Category,DueDate,Priority,IsUrgent,Completed,CompletedBy\n';
      const rows = tasks
        .map(
          (tItem) =>
            `"${tItem.id}","${tItem.title.replace(/"/g, '""')}","${tItem.category}","${tItem.dueDate}","${tItem.priority}","${tItem.isUrgent}","${tItem.completed}","${tItem.completedBy || ''}"`
        )
        .join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `TASKN_Operations_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (reportFormat === 'json') {
      const dataStr = JSON.stringify({ tasks, communications, topPerformers, exportedAt: new Date().toISOString() }, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `TASKN_Operations_Report_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.print();
    }

    showToast(`Operational Report exported as ${reportFormat.toUpperCase()}!`);
    setIsExportReportModalOpen(false);
  };

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
            <span className="material-symbols-outlined text-[#FF5500]">file_download</span>
            <h3 className="text-base font-black text-[#2C2C2E] dark:text-[#eff1f5]">
              {t.exportReport}
            </h3>
          </div>
          <button
            onClick={() => setIsExportReportModalOpen(false)}
            className="p-1 text-[#8E8E93] hover:text-[#2C2C2E] rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 text-xs text-[#2C2C2E] dark:text-[#eff1f5]">
          <p className="text-[#8E8E93] dark:text-[#d8dade] leading-relaxed">
            Generate an executive operational summary for Week 33 containing task completion rates, urgent compliance logs, and team QA rankings.
          </p>

          <div className="space-y-2">
            <label className="font-bold block">Choose Export Format:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setReportFormat('csv')}
                className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  reportFormat === 'csv'
                    ? 'border-[#FF5500] bg-[#FFF0EB] text-[#FF5500] shadow-xs'
                    : 'border-[#e5e5ea] dark:border-[#35383c] hover:bg-[#F7F7F8]'
                }`}
              >
                <span className="material-symbols-outlined block text-2xl mb-1">table_view</span>
                CSV Sheet
              </button>

              <button
                type="button"
                onClick={() => setReportFormat('pdf')}
                className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  reportFormat === 'pdf'
                    ? 'border-[#FF5500] bg-[#FFF0EB] text-[#FF5500] shadow-xs'
                    : 'border-[#e5e5ea] dark:border-[#35383c] hover:bg-[#F7F7F8]'
                }`}
              >
                <span className="material-symbols-outlined block text-2xl mb-1">picture_as_pdf</span>
                Print / PDF
              </button>

              <button
                type="button"
                onClick={() => setReportFormat('json')}
                className={`p-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  reportFormat === 'json'
                    ? 'border-[#FF5500] bg-[#FFF0EB] text-[#FF5500] shadow-xs'
                    : 'border-[#e5e5ea] dark:border-[#35383c] hover:bg-[#F7F7F8]'
                }`}
              >
                <span className="material-symbols-outlined block text-2xl mb-1">data_object</span>
                JSON Data
              </button>
            </div>
          </div>

          <div className="p-3.5 bg-[#F7F7F8] dark:bg-[#25282c] border border-[#e5e5ea] dark:border-[#35383c] rounded-xl space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#8E8E93]">Total Tasks in Scope:</span>
              <strong className="text-[#2C2C2E] dark:text-[#eff1f5]">{tasks.length}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8E8E93]">Operational Efficiency:</span>
              <strong className="text-[#008259]">94.8% (+3.2%)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8E8E93]">Team Top Performer:</span>
              <strong className="text-[#2C2C2E] dark:text-[#eff1f5]">Amrit Shrestha (148 Tasks)</strong>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#F7F7F8] dark:bg-[#26282b] border-t border-[#e5e5ea] dark:border-[#35383c] flex justify-end gap-2">
          <button
            onClick={() => setIsExportReportModalOpen(false)}
            className="px-4 py-2 border border-[#e5e5ea] dark:border-[#5d3f3c] rounded-xl hover:bg-[#e7e8ec] text-xs font-bold cursor-pointer"
          >
            {t.cancel}
          </button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleDownload}
            className="bg-[#FF5500] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#E04800] flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Export Now
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
