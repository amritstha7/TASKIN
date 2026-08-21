import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const CommunicationsScreen: React.FC = () => {
  const {
    communications,
    toggleCommunicationComplete,
    addNoteToComm,
    setSelectedAttachment,
    setCurrentScreen,
    communicationsCount,
    t,
  } = useApp();

  const [commSortAsc, setCommSortAsc] = useState<boolean>(true);
  const [activeNoteCommId, setActiveNoteCommId] = useState<string | null>(null);
  const [commNoteInput, setCommNoteInput] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const sortedComms = [...communications].sort((a, b) => {
    if (commSortAsc) {
      return a.dueDate.localeCompare(b.dueDate);
    }
    return b.dueDate.localeCompare(a.dueDate);
  });

  const filteredComms = sortedComms.filter((comm) => {
    if (filter === 'pending' && comm.isCompleted) return false;
    if (filter === 'completed' && !comm.isCompleted) return false;
    return true;
  });

  const handleSaveCommNote = (commId: string) => {
    if (commNoteInput.trim()) {
      addNoteToComm(commId, commNoteInput);
      setCommNoteInput('');
      setActiveNoteCommId(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Top Header & Navigation Breadcrumb */}
      <div className="flex items-center justify-between gap-2">
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentScreen('dashboard')}
          className="flex items-center gap-1.5 text-xs font-bold text-[#8E8E93] dark:text-[#8e9095] hover:text-[#FF5500] dark:hover:text-[#ffb4ac] py-1 px-2.5 rounded-lg hover:bg-[#FFF0EB] dark:hover:bg-[#35383c] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Dashboard</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setCommSortAsc(!commSortAsc)}
          className="flex items-center gap-1 bg-white dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5] border border-[#e5e5ea] dark:border-[#35383c] text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs hover:border-[#FF5500] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">swap_vert</span>
          <span>Sort Due Date ({commSortAsc ? 'Asc' : 'Desc'})</span>
        </motion.button>
      </div>

      {/* Category Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#E04800] dark:from-[#fe6b00] dark:to-[#a04100] text-white p-4 sm:p-5 shadow-[0_6px_20px_rgba(255,85,0,0.3)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30">
              <span className="material-symbols-outlined text-[24px]">campaign</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  {t.communications}
                </h1>
                <span className="bg-white text-[#FF5500] text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  {communicationsCount}
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium mt-0.5">
                Headquarters directives, compliance briefs, and store operation memos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-[#191c1f] p-1.5 rounded-xl border border-[#e5e5ea] dark:border-[#35383c] shadow-2xs">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#FF5500] text-white shadow-xs'
              : 'text-[#8E8E93] dark:text-[#8e9095] hover:text-[#2C2C2E] dark:hover:text-[#eff1f5]'
          }`}
        >
          All ({communications.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'pending'
              ? 'bg-[#FF5500] text-white shadow-xs'
              : 'text-[#8E8E93] dark:text-[#8e9095] hover:text-[#2C2C2E] dark:hover:text-[#eff1f5]'
          }`}
        >
          Pending ({communications.filter((c) => !c.isCompleted).length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'completed'
              ? 'bg-[#FF5500] text-white shadow-xs'
              : 'text-[#8E8E93] dark:text-[#8e9095] hover:text-[#2C2C2E] dark:hover:text-[#eff1f5]'
          }`}
        >
          Completed ({communications.filter((c) => c.isCompleted).length})
        </button>
      </div>

      {/* Communications Feed */}
      {filteredComms.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#191c1f] rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] p-6">
          <span className="material-symbols-outlined text-4xl text-[#8E8E93] mb-2">
            mark_email_read
          </span>
          <h3 className="font-bold text-base text-[#2C2C2E] dark:text-[#eff1f5]">
            No Communications Found
          </h3>
          <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-1 max-w-sm mx-auto">
            All memos and official briefings have been acknowledged.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComms.map((comm) => (
            <motion.div
              key={comm.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border transition-all ${
                comm.isCompleted
                  ? 'bg-[#F7F7F8] dark:bg-[#25282c] border-[#e5e5ea] dark:border-[#35383c] opacity-80'
                  : 'bg-white dark:bg-[#1f2225] border-[#e5e5ea] dark:border-[#35383c] hover:border-[#FF5500] shadow-[0_4px_16px_rgba(0,0,0,0.04)]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => toggleCommunicationComplete(comm.id)}
                    className={`mt-0.5 rounded-xl p-1.5 transition-all flex items-center justify-center cursor-pointer min-h-[38px] min-w-[38px] ${
                      comm.isCompleted
                        ? 'text-[#008259] bg-[#e1ffec]'
                        : 'text-[#8E8E93] hover:text-[#008259] hover:bg-[#e1ffec]'
                    }`}
                    title={comm.isCompleted ? 'Mark Unread/Pending' : 'Acknowledge Communication'}
                  >
                    <span
                      className="material-symbols-outlined text-[24px]"
                      style={{ fontVariationSettings: comm.isCompleted ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {comm.isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </motion.button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-sm sm:text-base font-bold tracking-tight ${
                          comm.isCompleted
                            ? 'line-through text-[#8E8E93] dark:text-[#8e9095]'
                            : 'text-[#2C2C2E] dark:text-[#eff1f5]'
                        }`}
                      >
                        {comm.title}
                      </h4>
                      <span className="text-[10px] text-[#8E8E93] dark:text-[#d8dade] font-mono bg-[#F7F7F8] dark:bg-[#35383c] px-2 py-0.5 rounded-md border border-[#e5e5ea] dark:border-[#4d2d2a]">
                        Due: {comm.dueDate}
                      </span>
                    </div>

                    <p className="text-xs text-[#2C2C2E] dark:text-[#eff1f5] mt-1.5 leading-relaxed">
                      {comm.description}
                    </p>

                    {/* Completed by info */}
                    {comm.completedBy && (
                      <div className="text-[11px] text-[#008259] font-bold mt-2 flex items-center gap-1.5 bg-[#e1ffec]/70 dark:bg-[#008259]/20 px-2.5 py-1 rounded-lg w-fit">
                        <span className="material-symbols-outlined text-[15px]">verified</span>
                        Acknowledged by {comm.completedBy} at {comm.completedAt || comm.dueDate}
                      </div>
                    )}

                    {/* Attached notes */}
                    {comm.notes && comm.notes.length > 0 && (
                      <div className="mt-2.5 pl-3 border-l-2 border-[#FF5500] text-[11px] text-[#8E8E93] dark:text-[#d8dade] italic bg-[#FFF9F6] dark:bg-[#25282c] p-2 rounded-r-lg">
                        {comm.notes.map((n, idx) => (
                          <p key={idx}>"{n}"</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right actions: Attachment viewer & Add Note */}
                <div className="flex items-center gap-1">
                  {comm.attachmentName && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedAttachment(comm)}
                      className="p-2 text-[#8E8E93] dark:text-[#d8dade] hover:text-[#FF5500] hover:bg-[#FFF0EB] dark:hover:bg-[#35383c] rounded-xl transition-colors cursor-pointer"
                      title={`View ${comm.attachmentName}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">attachment</span>
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setActiveNoteCommId(activeNoteCommId === comm.id ? null : comm.id);
                      setCommNoteInput('');
                    }}
                    className="p-2 text-[#8E8E93] dark:text-[#d8dade] hover:bg-[#F7F7F8] dark:hover:bg-[#35383c] hover:text-[#FF5500] rounded-xl transition-colors cursor-pointer"
                    title={t.addNote}
                  >
                    <span className="material-symbols-outlined text-[20px]">note_add</span>
                  </motion.button>
                </div>
              </div>

              {/* Inline note add form */}
              {activeNoteCommId === comm.id && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 pt-3 border-t border-[#e5e5ea] dark:border-[#35383c] flex gap-2"
                >
                  <input
                    type="text"
                    value={commNoteInput}
                    onChange={(e) => setCommNoteInput(e.target.value)}
                    placeholder="Add communication note..."
                    className="flex-1 text-xs border border-[#e5e5ea] dark:border-[#5d3f3c] rounded-xl px-3 py-2 bg-white dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveCommNote(comm.id);
                    }}
                  />
                  <button
                    onClick={() => handleSaveCommNote(comm.id)}
                    className="bg-[#FF5500] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#E04800] transition-colors cursor-pointer"
                  >
                    {t.save}
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
