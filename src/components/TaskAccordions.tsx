import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Task, Communication } from '../types';

export const TaskAccordions: React.FC = () => {
  const {
    tasks,
    toggleTaskComplete,
    deleteTask,
    snoozeTask,
    addNoteToTask,
    communications,
    toggleCommunicationComplete,
    deleteCommunication,
    addNoteToComm,
    notes,
    addPersonalNote,
    togglePersonalNote,
    deletePersonalNote,
    setSelectedAttachment,
    setPhotoProofModalTask,
    setPreviewPhoto,
    removePhotoFromTask,
    setCurrentScreen,
    urgentTasksCount,
    generalTasksCount,
    communicationsCount,
    myNotesCount,
    t,
  } = useApp();

  // Accordion open/collapse states
  const [isUrgentOpen, setIsUrgentOpen] = useState<boolean>(true);
  const [isTasksOpen, setIsTasksOpen] = useState<boolean>(true);
  const [isCommsOpen, setIsCommsOpen] = useState<boolean>(true);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(true);

  // Sorting
  const [commSortAsc, setCommSortAsc] = useState<boolean>(true);

  // Note dialog / inline inputs
  const [activeNoteTaskId, setActiveNoteTaskId] = useState<string | null>(null);
  const [taskNoteInput, setTaskNoteInput] = useState<string>('');

  const [activeNoteCommId, setActiveNoteCommId] = useState<string | null>(null);
  const [commNoteInput, setCommNoteInput] = useState<string>('');

  const [newPersonalNote, setNewPersonalNote] = useState<string>('');
  const [showAddNoteInput, setShowAddNoteInput] = useState<boolean>(false);

  // Urgent and standard tasks
  const urgentTasks = tasks.filter((tItem) => tItem.isUrgent);
  const regularTasks = tasks.filter((tItem) => !tItem.isUrgent);

  const sortedComms = [...communications].sort((a, b) => {
    if (commSortAsc) {
      return a.dueDate.localeCompare(b.dueDate);
    }
    return b.dueDate.localeCompare(a.dueDate);
  });

  const handleSaveTaskNote = (taskId: string) => {
    if (taskNoteInput.trim()) {
      addNoteToTask(taskId, taskNoteInput);
      setTaskNoteInput('');
      setActiveNoteTaskId(null);
    }
  };

  const handleSaveCommNote = (commId: string) => {
    if (commNoteInput.trim()) {
      addNoteToComm(commId, commNoteInput);
      setCommNoteInput('');
      setActiveNoteCommId(null);
    }
  };

  const handleAddPersonalNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPersonalNote.trim()) {
      addPersonalNote(newPersonalNote);
      setNewPersonalNote('');
      setShowAddNoteInput(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* MOBILE BREAKPOINT ONLY: Full-Card Tap Targets for Page-Level Route Navigation */}
      <div id="mobile-category-action-cards" className="md:hidden flex flex-col gap-2.5">
        {/* 1. Urgent Actions Mobile Card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentScreen('urgent-tasks')}
          className="w-full bg-gradient-to-r from-[#d81b1b] via-[#ea3822] to-[#ef4444] text-white rounded-2xl min-h-[58px] px-4 py-3.5 flex items-center justify-between shadow-[0_6px_20px_rgba(234,56,34,0.3)] hover:brightness-105 transition-all text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-white/90 group-hover:translate-x-0.5 transition-transform">
              arrow_right
            </span>
            <div className="bg-white/25 backdrop-blur-xs text-white rounded-full px-3.5 py-0.5 text-xs font-black border border-white/40 shadow-xs">
              {urgentTasksCount}
            </div>
            <span className="text-base font-black tracking-tight text-white">
              {t.urgentActions}
            </span>
          </div>
          <span className="material-symbols-outlined text-[20px] text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all">
            chevron_right
          </span>
        </motion.button>

        {/* 2. Tasks Mobile Card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentScreen('store-tasks')}
          className="w-full bg-gradient-to-r from-[#FF5500] via-[#FF6A00] to-[#E04800] dark:from-[#fe6b00] dark:to-[#a04100] text-white rounded-2xl min-h-[58px] px-4 py-3.5 flex items-center justify-between shadow-[0_6px_20px_rgba(255,85,0,0.25)] hover:brightness-105 transition-all text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-white/90 group-hover:translate-x-0.5 transition-transform">
              arrow_right
            </span>
            <div className="bg-white/25 backdrop-blur-xs text-white rounded-full px-3.5 py-0.5 text-xs font-black border border-white/40 shadow-xs">
              {generalTasksCount}
            </div>
            <span className="text-base font-black tracking-tight text-white">
              {t.tasks || 'Tasks'}
            </span>
          </div>
          <span className="material-symbols-outlined text-[20px] text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all">
            chevron_right
          </span>
        </motion.button>

        {/* 3. Communications Mobile Card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setCurrentScreen('communications')}
          className="w-full bg-gradient-to-r from-[#FF5500] via-[#FF6A00] to-[#E04800] dark:from-[#fe6b00] dark:to-[#a04100] text-white rounded-2xl min-h-[58px] px-4 py-3.5 flex items-center justify-between shadow-[0_6px_20px_rgba(255,85,0,0.25)] hover:brightness-105 transition-all text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-white/90 group-hover:translate-x-0.5 transition-transform">
              arrow_right
            </span>
            <div className="bg-white/25 backdrop-blur-xs text-white rounded-full px-3.5 py-0.5 text-xs font-black border border-white/40 shadow-xs">
              {communicationsCount}
            </div>
            <span className="text-base font-black tracking-tight text-white">
              {t.communications}
            </span>
          </div>
          <span className="material-symbols-outlined text-[20px] text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all">
            chevron_right
          </span>
        </motion.button>

        {/* 4. Notes / Custom Mobile Card */}
        <div
          onClick={() => setCurrentScreen('notes')}
          className="w-full bg-[#242830] dark:bg-[#1f2228] border border-[#353942] rounded-2xl min-h-[58px] px-4 py-3.5 flex items-center justify-between shadow-md hover:border-[#FF5500]/50 transition-all text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-[#8E9299] group-hover:text-white group-hover:translate-x-0.5 transition-transform">
              arrow_right
            </span>
            <div className="bg-[#353942] text-white rounded-full px-3.5 py-0.5 text-xs font-black border border-[#484e5a] shadow-xs">
              {myNotesCount}
            </div>
            <span className="text-base font-black tracking-tight text-white">
              {t.myTasksNotes}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentScreen('notes');
              }}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              title="Add note"
            >
              <span className="material-symbols-outlined text-[22px]">add</span>
            </button>
            <span className="material-symbols-outlined text-[20px] text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all">
              chevron_right
            </span>
          </div>
        </div>
      </div>

      {/* DESKTOP & TABLET: Retain Full Expandable/Collapsible Inline Accordions */}
      <div className="hidden md:flex flex-col gap-4">
        {/* 1. URGENT ACTIONS ACCORDION */}
        <motion.div
          id="urgent-actions-accordion"
          layout
          className="rounded-2xl overflow-hidden card-depth border border-[#FFD8CC]/70 dark:border-[#5d3f3c] bg-white dark:bg-[#191c1f]"
        >
        <motion.button
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsUrgentOpen(!isUrgentOpen)}
          className="w-full bg-gradient-to-r from-[#FF4500] via-[#FF5500] to-[#E04800] dark:from-[#b60013] dark:to-[#e01a22] text-white flex items-center justify-between min-h-[52px] px-4 hover:brightness-105 transition-all text-left cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <motion.span
              animate={{ rotate: isUrgentOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="material-symbols-outlined text-[22px]"
            >
              arrow_right
            </motion.span>
            <div className="bg-white/25 backdrop-blur-xs text-white rounded-full px-3 py-0.5 text-xs font-black border border-white/40 shadow-xs">
              {urgentTasksCount}
            </div>
            <h3 className="text-base md:text-lg font-black tracking-tight">{t.urgentActions}</h3>
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wide bg-white/20 px-2.5 py-0.5 rounded-lg text-white border border-white/30 hidden sm:inline">
            {t.highPriority}
          </span>
        </motion.button>

        <AnimatePresence>
          {isUrgentOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="p-3 md:p-5 border-t border-[#FFD8CC] dark:border-[#5d3f3c]"
            >
              {urgentTasks.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#8E8E93] dark:text-[#d8dade]">
                  <span className="material-symbols-outlined text-3xl text-[#008259] mb-1">
                    check_circle
                  </span>
                  <p className="font-bold text-sm text-[#2C2C2E] dark:text-[#eff1f5]">
                    No urgent actions pending!
                  </p>
                  <p className="text-[11px] mt-0.5">All critical compliance tasks are up to date.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {urgentTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      whileHover={{ y: -2 }}
                      className={`p-3.5 rounded-xl border transition-all card-hover-3d ${
                        task.completed
                          ? 'bg-[#F7F7F8] dark:bg-[#25282c] border-[#e5e5ea] dark:border-[#35383c] opacity-75'
                          : 'bg-white dark:bg-[#1f2225] border-[#FFD8CC] dark:border-[#93000d]/50 hover:border-[#FF5500] shadow-[0_4px_16px_rgba(255,85,0,0.08)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => toggleTaskComplete(task.id)}
                            className={`mt-0.5 rounded-xl p-1 transition-all flex items-center justify-center cursor-pointer min-h-[36px] min-w-[36px] ${
                              task.completed
                                ? 'text-[#008259] bg-[#e1ffec]'
                                : 'text-[#8E8E93] hover:text-[#008259] hover:bg-[#e1ffec]'
                            }`}
                            title={task.completed ? 'Mark as Pending' : 'Mark as Complete'}
                          >
                            <span
                              className="material-symbols-outlined text-[24px]"
                              style={{ fontVariationSettings: task.completed ? "'FILL' 1" : "'FILL' 0" }}
                            >
                              {task.completed ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                          </motion.button>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4
                                className={`text-sm md:text-base font-bold tracking-tight ${
                                  task.completed
                                    ? 'line-through text-[#8E8E93] dark:text-[#8e9095]'
                                    : 'text-[#2C2C2E] dark:text-[#eff1f5]'
                                }`}
                              >
                                {task.title}
                              </h4>
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#FFF0EB] text-[#FF5500] border border-[#FFD8CC] dark:bg-[#ba1a1a]/30 dark:text-[#ffb4ac] uppercase">
                                {t.highPriority}
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F7F7F8] dark:bg-[#35383c] text-[#2C2C2E] dark:text-[#eff1f5] border border-[#e5e5ea] dark:border-[#4d2d2a]">
                                {task.category}
                              </span>
                            </div>

                            <p className="text-xs text-[#8E8E93] dark:text-[#d8dade] mt-1.5 leading-relaxed font-normal">
                              {task.description}
                            </p>

                            {/* Completed metadata */}
                            {task.completed && task.completedBy && (
                              <div className="text-[11px] text-[#008259] font-bold mt-1.5 flex items-center gap-1.5 bg-[#e1ffec]/60 dark:bg-[#008259]/20 px-2 py-1 rounded-lg w-fit">
                                <span className="material-symbols-outlined text-[15px]">verified</span>
                                Completed by {task.completedBy}{task.completedAt ? ` at ${task.completedAt}` : ''}
                              </div>
                            )}

                            {/* Photos attached to urgent task */}
                            {task.photos && task.photos.length > 0 && (
                              <div className="mt-2.5 pt-2 border-t border-[#e5e5ea] dark:border-[#35383c]">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] font-bold text-[#8E8E93] dark:text-[#8e9095] flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[13px] text-[#FF5500]">
                                      photo_camera
                                    </span>
                                    Photo Evidence ({task.photos.length})
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setPhotoProofModalTask(task)}
                                    className="text-[10px] text-[#FF5500] hover:underline font-bold cursor-pointer"
                                  >
                                    + Add More
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {task.photos.map((p) => (
                                    <div
                                      key={p.id}
                                      className="relative group rounded-lg overflow-hidden border border-[#e5e5ea] dark:border-[#35383c] w-16 h-16 sm:w-20 sm:h-20 bg-black/10 shrink-0"
                                    >
                                      <img
                                        src={p.url}
                                        alt={p.caption || 'Proof'}
                                        className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform"
                                        onClick={() =>
                                          setPreviewPhoto({
                                            url: p.url,
                                            title: task.title,
                                            caption: p.caption,
                                            user: p.uploadedBy,
                                            time: p.uploadedAt,
                                          })
                                        }
                                      />
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removePhotoFromTask(task.id, p.id);
                                        }}
                                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FF3300] cursor-pointer"
                                        title="Remove photo"
                                      >
                                        <span className="material-symbols-outlined text-[12px]">close</span>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Notes attached to task */}
                            {task.notes && task.notes.length > 0 && (
                              <div className="mt-2.5 pl-3 border-l-2 border-[#FF5500] space-y-1 bg-[#FFF9F6] dark:bg-[#25282c] p-2 rounded-r-lg">
                                {task.notes.map((note, idx) => (
                                  <p
                                    key={idx}
                                    className="text-[11px] text-[#2C2C2E] dark:text-[#d8dade] italic"
                                  >
                                    "{note}"
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action buttons: Photo Proof, Snooze, Note */}
                        <div className="flex items-center gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setPhotoProofModalTask(task)}
                            className="p-2 text-[#8E8E93] dark:text-[#d8dade] hover:bg-[#FFF0EB] dark:hover:bg-[#35383c] hover:text-[#FF5500] rounded-xl transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer relative"
                            title="Attach Photo Proof"
                          >
                            <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                            {task.photos && task.photos.length > 0 && (
                              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5500]" />
                            )}
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => snoozeTask(task.id, 2)}
                            className="p-2 text-[#8E8E93] dark:text-[#d8dade] hover:bg-[#F7F7F8] dark:hover:bg-[#35383c] hover:text-[#FF5500] rounded-xl transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                            title={t.snooze}
                          >
                            <span className="material-symbols-outlined text-[20px]">snooze</span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setActiveNoteTaskId(activeNoteTaskId === task.id ? null : task.id);
                              setTaskNoteInput('');
                            }}
                            className="p-2 text-[#8E8E93] dark:text-[#d8dade] hover:bg-[#F7F7F8] dark:hover:bg-[#35383c] hover:text-[#FF5500] rounded-xl transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                            title={t.addNote}
                          >
                            <span className="material-symbols-outlined text-[20px]">note_add</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-[#FF3300] hover:bg-[#FFF0EB] rounded-xl transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                            title={t.delete}
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </motion.button>
                        </div>
                      </div>

                      {/* Inline note add form */}
                      {activeNoteTaskId === task.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 pt-3 border-t border-[#e5e5ea] dark:border-[#35383c] flex gap-2"
                        >
                          <textarea
                            rows={2}
                            value={taskNoteInput}
                            onChange={(e) => setTaskNoteInput(e.target.value)}
                            placeholder="Type operational update..."
                            className="flex-1 text-xs border border-[#e5e5ea] dark:border-[#5d3f3c] rounded-xl px-3 py-2 bg-white dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500] resize-none"
                          />
                          <button
                            onClick={() => handleSaveTaskNote(task.id)}
                            className="bg-[#FF5500] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#E04800] transition-colors cursor-pointer self-start"
                          >
                            {t.save}
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 2. TASKS ACCORDION */}
      <motion.div
        layout
        className="rounded-2xl overflow-hidden card-depth border border-[#FFD8CC]/70 dark:border-[#5d3f3c] bg-white dark:bg-[#191c1f]"
      >
        <motion.button
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsTasksOpen(!isTasksOpen)}
          className="w-full bg-gradient-to-r from-[#FF5500] to-[#E04800] dark:from-[#fe6b00] dark:to-[#a04100] text-white flex items-center justify-between min-h-[52px] px-4 hover:brightness-105 transition-all text-left cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <motion.span
              animate={{ rotate: isTasksOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="material-symbols-outlined text-[22px]"
            >
              arrow_right
            </motion.span>
            <div className="bg-white/25 backdrop-blur-xs text-white rounded-full px-3 py-0.5 text-xs font-black border border-white/40 shadow-xs">
              {generalTasksCount}
            </div>
            <h3 className="text-base md:text-lg font-black tracking-tight">{t.tasks}</h3>
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wide bg-white/20 px-2.5 py-0.5 rounded-lg text-white border border-white/30 hidden sm:inline">
            Store Ops
          </span>
        </motion.button>

        <AnimatePresence>
          {isTasksOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="p-3 md:p-5 border-t border-[#FFD8CC] dark:border-[#5d3f3c]"
            >
              {regularTasks.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#8E8E93] dark:text-[#d8dade]">
                  <p>{t.noTasksFound}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {regularTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      whileHover={{ y: -2 }}
                      className={`p-3.5 rounded-xl border transition-all card-hover-3d ${
                        task.completed
                          ? 'bg-[#F7F7F8] dark:bg-[#25282c] border-[#e5e5ea] dark:border-[#35383c] opacity-75'
                          : 'bg-white dark:bg-[#1f2225] border-[#e5e5ea] dark:border-[#35383c] hover:border-[#FF5500] shadow-[0_4px_16px_rgba(0,0,0,0.04)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => toggleTaskComplete(task.id)}
                            className={`mt-0.5 rounded-xl p-1 transition-all flex items-center justify-center cursor-pointer min-h-[36px] min-w-[36px] ${
                              task.completed
                                ? 'text-[#008259] bg-[#e1ffec]'
                                : 'text-[#8E8E93] hover:text-[#008259] hover:bg-[#e1ffec]'
                            }`}
                            title={task.completed ? 'Mark as Pending' : 'Mark as Complete'}
                          >
                            <span
                              className="material-symbols-outlined text-[24px]"
                              style={{ fontVariationSettings: task.completed ? "'FILL' 1" : "'FILL' 0" }}
                            >
                              {task.completed ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                          </motion.button>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4
                                className={`text-sm md:text-base font-bold tracking-tight ${
                                  task.completed
                                    ? 'line-through text-[#8E8E93] dark:text-[#8e9095]'
                                    : 'text-[#2C2C2E] dark:text-[#eff1f5]'
                                }`}
                              >
                                {task.title}
                              </h4>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F7F7F8] dark:bg-[#35383c] text-[#2C2C2E] dark:text-[#eff1f5] border border-[#e5e5ea] dark:border-[#4d2d2a]">
                                {task.category}
                              </span>
                              <span className="text-[10px] text-[#8E8E93] dark:text-[#d8dade] font-mono">
                                Due: {task.dueDate.split('-').reverse().join('/')}
                              </span>
                            </div>

                            <p className="text-xs text-[#8E8E93] dark:text-[#d8dade] mt-1.5 leading-relaxed">
                              {task.description}
                            </p>

                            {task.completed && task.completedBy && (
                              <div className="text-[11px] text-[#008259] font-bold mt-1.5 flex items-center gap-1.5 bg-[#e1ffec]/60 dark:bg-[#008259]/20 px-2 py-1 rounded-lg w-fit">
                                <span className="material-symbols-outlined text-[15px]">verified</span>
                                Completed by {task.completedBy}{task.completedAt ? ` (${task.completedAt})` : ''}
                              </div>
                            )}

                            {/* Photos attached to regular task */}
                            {task.photos && task.photos.length > 0 && (
                              <div className="mt-2.5 pt-2 border-t border-[#e5e5ea] dark:border-[#35383c]">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] font-bold text-[#8E8E93] dark:text-[#8e9095] flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[13px] text-[#FF5500]">
                                      photo_camera
                                    </span>
                                    Photo Evidence ({task.photos.length})
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setPhotoProofModalTask(task)}
                                    className="text-[10px] text-[#FF5500] hover:underline font-bold cursor-pointer"
                                  >
                                    + Add More
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {task.photos.map((p) => (
                                    <div
                                      key={p.id}
                                      className="relative group rounded-lg overflow-hidden border border-[#e5e5ea] dark:border-[#35383c] w-16 h-16 sm:w-20 sm:h-20 bg-black/10 shrink-0"
                                    >
                                      <img
                                        src={p.url}
                                        alt={p.caption || 'Proof'}
                                        className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform"
                                        onClick={() =>
                                          setPreviewPhoto({
                                            url: p.url,
                                            title: task.title,
                                            caption: p.caption,
                                            user: p.uploadedBy,
                                            time: p.uploadedAt,
                                          })
                                        }
                                      />
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removePhotoFromTask(task.id, p.id);
                                        }}
                                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FF3300] cursor-pointer"
                                        title="Remove photo"
                                      >
                                        <span className="material-symbols-outlined text-[12px]">close</span>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {task.notes && task.notes.length > 0 && (
                              <div className="mt-2.5 pl-3 border-l-2 border-[#FF5500] space-y-1 bg-[#FFF9F6] dark:bg-[#25282c] p-2 rounded-r-lg">
                                {task.notes.map((note, idx) => (
                                  <p
                                    key={idx}
                                    className="text-[11px] text-[#2C2C2E] dark:text-[#d8dade] italic"
                                  >
                                    "{note}"
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setPhotoProofModalTask(task)}
                            className="p-2 text-[#8E8E93] dark:text-[#d8dade] hover:bg-[#FFF0EB] dark:hover:bg-[#35383c] hover:text-[#FF5500] rounded-xl transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer relative"
                            title="Attach Photo Proof"
                          >
                            <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                            {task.photos && task.photos.length > 0 && (
                              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5500]" />
                            )}
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setActiveNoteTaskId(activeNoteTaskId === task.id ? null : task.id);
                              setTaskNoteInput('');
                            }}
                            className="p-2 text-[#8E8E93] dark:text-[#d8dade] hover:bg-[#F7F7F8] dark:hover:bg-[#35383c] hover:text-[#FF5500] rounded-xl transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                            title={t.addNote}
                          >
                            <span className="material-symbols-outlined text-[20px]">note_add</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-[#FF3300] hover:bg-[#FFF0EB] rounded-xl transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                            title={t.delete}
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </motion.button>
                        </div>
                      </div>

                      {activeNoteTaskId === task.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 pt-3 border-t border-[#e5e5ea] dark:border-[#35383c] flex gap-2"
                        >
                          <textarea
                            rows={2}
                            value={taskNoteInput}
                            onChange={(e) => setTaskNoteInput(e.target.value)}
                            placeholder="Add shift update note..."
                            className="flex-1 text-xs border border-[#e5e5ea] dark:border-[#5d3f3c] rounded-xl px-3 py-2 bg-white dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500] resize-none"
                          />
                          <button
                            onClick={() => handleSaveTaskNote(task.id)}
                            className="bg-[#FF5500] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#E04800] transition-colors cursor-pointer self-start"
                          >
                            {t.save}
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 3. COMMUNICATIONS ACCORDION */}
      <motion.div
        layout
        className="rounded-2xl overflow-hidden card-depth border border-[#FFD8CC]/70 dark:border-[#5d3f3c] bg-white dark:bg-[#191c1f]"
      >
        <motion.button
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsCommsOpen(!isCommsOpen)}
          className="w-full bg-gradient-to-r from-[#FF5500] to-[#E04800] dark:from-[#fe6b00] dark:to-[#a04100] text-white flex items-center justify-between min-h-[52px] px-4 hover:brightness-105 transition-all text-left cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <motion.span
              animate={{ rotate: isCommsOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="material-symbols-outlined text-[22px]"
            >
              arrow_right
            </motion.span>
            <div className="bg-white/25 backdrop-blur-xs text-white rounded-full px-3 py-0.5 text-xs font-black border border-white/40 shadow-xs">
              {communicationsCount}
            </div>
            <h3 className="text-base md:text-lg font-black tracking-tight">
              {t.communications}
            </h3>
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wide bg-white/20 px-2.5 py-0.5 rounded-lg text-white border border-white/30 hidden sm:inline">
            Directives & Briefs
          </span>
        </motion.button>

        <AnimatePresence>
          {isCommsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="p-0"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F7F7F8] dark:bg-[#26282b] border-b border-[#e5e5ea] dark:border-[#35383c]">
                      <th className="py-3 px-4 text-xs font-bold text-[#8E8E93] dark:text-[#d8dade] whitespace-nowrap">
                        Communication
                      </th>
                      <th className="py-3 px-4 text-xs font-bold text-[#8E8E93] dark:text-[#d8dade] min-w-[220px]">
                        Description
                      </th>
                      <th
                        onClick={() => setCommSortAsc(!commSortAsc)}
                        className="py-3 px-4 text-xs font-bold text-[#8E8E93] dark:text-[#d8dade] whitespace-nowrap cursor-pointer hover:text-[#FF5500] select-none"
                      >
                        <div className="flex items-center gap-1">
                          Due Date
                          <span className="material-symbols-outlined text-sm">unfold_more</span>
                        </div>
                      </th>
                      <th className="py-3 px-4 text-xs font-bold text-[#8E8E93] dark:text-[#d8dade] text-center">
                        Attachment
                      </th>
                      <th className="py-3 px-4 text-xs font-bold text-[#8E8E93] dark:text-[#d8dade] whitespace-nowrap">
                        Completed By
                      </th>
                      <th className="py-3 px-4 text-xs font-bold text-[#8E8E93] dark:text-[#d8dade] text-center">
                        Status
                      </th>
                      <th className="py-3 px-4 text-xs font-bold text-[#8E8E93] dark:text-[#d8dade] text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedComms.map((comm) => (
                      <tr
                        key={comm.id}
                        className="border-b border-[#e5e5ea] dark:border-[#35383c] hover:bg-[#FFF9F6] dark:hover:bg-[#25282c] transition-colors"
                      >
                        <td className="py-4 px-4 text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5] align-top whitespace-nowrap">
                          {comm.title}
                        </td>
                        <td className="py-4 px-4 text-xs text-[#2C2C2E] dark:text-[#eff1f5] align-top max-w-[260px] leading-relaxed">
                          {comm.description}
                          {comm.notes && comm.notes.length > 0 && (
                            <div className="mt-1.5 pl-2 border-l-2 border-[#FF5500] text-[11px] text-[#8E8E93] dark:text-[#d8dade] italic">
                              Note: {comm.notes.join('; ')}
                            </div>
                          )}
                          {activeNoteCommId === comm.id && (
                            <div className="mt-2 flex gap-1.5">
                              <textarea
                                rows={2}
                                value={commNoteInput}
                                onChange={(e) => setCommNoteInput(e.target.value)}
                                placeholder="Add comm note..."
                                className="text-xs border rounded-lg px-2 py-1 w-full bg-white dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none resize-none"
                              />
                              <button
                                onClick={() => handleSaveCommNote(comm.id)}
                                className="bg-[#FF5500] text-white px-2 py-1 rounded-lg text-xs font-bold self-start"
                              >
                                Add
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-xs text-[#2C2C2E] dark:text-[#eff1f5] align-top whitespace-nowrap font-mono">
                          {comm.dueDate}
                        </td>
                        <td className="py-4 px-4 text-center align-top">
                          {comm.attachmentName ? (
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setSelectedAttachment(comm)}
                              className="text-[#8E8E93] dark:text-[#d8dade] hover:text-[#FF5500] dark:hover:text-[#ffb4ac] p-1.5 rounded-xl transition-colors cursor-pointer"
                              title={`View ${comm.attachmentName}`}
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                attachment
                              </span>
                            </motion.button>
                          ) : (
                            <span className="text-xs text-[#8E8E93]">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-xs text-[#2C2C2E] dark:text-[#eff1f5] align-top whitespace-nowrap">
                          {comm.completedBy ? (
                            <div>
                              <span className="font-bold text-[#008259]">{comm.completedBy}</span>
                              <br />
                              <span className="text-[#8E8E93] dark:text-[#d8dade] text-[10px]">
                                {comm.completedAt || comm.dueDate}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#8E8E93] italic">
                              {t.statusPending}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center align-top">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => toggleCommunicationComplete(comm.id)}
                            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                              comm.isCompleted
                                ? 'text-[#008259] bg-[#e1ffec]/50'
                                : 'text-[#8E8E93] hover:text-[#008259]'
                            }`}
                          >
                            <span
                              className="material-symbols-outlined text-[22px]"
                              style={{ fontVariationSettings: comm.isCompleted ? "'FILL' 1" : "'FILL' 0" }}
                            >
                              {comm.isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                          </motion.button>
                        </td>
                        <td className="py-4 px-4 text-right align-top whitespace-nowrap">
                          <div className="flex gap-1.5 justify-end">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setActiveNoteCommId(
                                  activeNoteCommId === comm.id ? null : comm.id
                                );
                                setCommNoteInput('');
                              }}
                              className="text-[#8E8E93] dark:text-[#d8dade] hover:bg-[#F7F7F8] dark:hover:bg-[#35383c] hover:text-[#FF5500] p-1.5 rounded-xl transition-colors cursor-pointer"
                              title={t.addNote}
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                note_add
                              </span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteCommunication(comm.id)}
                              className="text-[#FF3300] hover:bg-[#FFF0EB] p-1.5 rounded-xl transition-colors cursor-pointer"
                              title={t.delete}
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 4. MY TASKS & NOTES ACCORDION */}
      <motion.div
        layout
        className="rounded-2xl overflow-hidden card-depth border border-[#e5e5ea] dark:border-[#5d3f3c] bg-white dark:bg-[#191c1f]"
      >
        <div className="flex items-center justify-between min-h-[52px] px-4 bg-[#F7F7F8] dark:bg-[#2e3134]">
          <button
            onClick={() => setIsNotesOpen(!isNotesOpen)}
            className="flex items-center gap-2.5 flex-1 text-left cursor-pointer"
          >
            <motion.span
              animate={{ rotate: isNotesOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="material-symbols-outlined text-[22px] text-[#2C2C2E] dark:text-[#eff1f5]"
            >
              arrow_right
            </motion.span>
            <div className="bg-white dark:bg-[#414448] text-[#2C2C2E] dark:text-[#eff1f5] rounded-full px-3 py-0.5 text-xs font-black border border-[#e5e5ea] dark:border-[#5d3f3c] shadow-2xs">
              {myNotesCount}
            </div>
            <h3 className="text-base md:text-lg font-black text-[#2C2C2E] dark:text-[#eff1f5] tracking-tight">
              {t.myTasksNotes}
            </h3>
          </button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsNotesOpen(true);
              setShowAddNoteInput(!showAddNoteInput);
            }}
            className="p-1.5 hover:bg-[#e5e5ea] dark:hover:bg-[#414448] rounded-xl transition-colors flex items-center justify-center cursor-pointer text-[#FF5500] dark:text-[#ffb4ac]"
            title="Quick Add Note"
          >
            <span className="material-symbols-outlined text-[22px]">add</span>
          </motion.button>
        </div>

        <AnimatePresence>
          {isNotesOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="p-3 md:p-5 border-t border-[#e5e5ea] dark:border-[#35383c]"
            >
              {/* Quick Add Note Form */}
              {showAddNoteInput && (
                <motion.form
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleAddPersonalNoteSubmit}
                  className="mb-3.5 flex gap-2"
                >
                  <textarea
                    rows={2}
                    value={newPersonalNote}
                    onChange={(e) => setNewPersonalNote(e.target.value)}
                    placeholder="Write a scratchpad note or reminder..."
                    autoFocus
                    className="flex-1 text-xs border border-[#FFD8CC] dark:border-[#5d3f3c] rounded-xl px-3.5 py-2.5 bg-[#FFF9F6] dark:bg-[#25282c] text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500] resize-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#FF5500] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#E04800] transition-colors cursor-pointer self-start"
                  >
                    {t.addNote}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddNoteInput(false)}
                    className="border border-[#e5e5ea] dark:border-[#5d3f3c] text-[#8E8E93] px-3 py-2.5 rounded-xl text-xs hover:bg-[#F7F7F8] cursor-pointer self-start"
                  >
                    {t.cancel}
                  </button>
                </motion.form>
              )}

              {notes.length === 0 ? (
                <div className="text-center py-4 text-xs text-[#8E8E93] dark:text-[#d8dade]">
                  <p>No personal notes recorded yet.</p>
                  <button
                    onClick={() => setShowAddNoteInput(true)}
                    className="mt-2 text-xs font-bold text-[#FF5500] dark:text-[#ffb4ac] hover:underline cursor-pointer"
                  >
                    + Add your first note
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {notes.map((note) => (
                    <motion.div
                      key={note.id}
                      whileHover={{ x: 2 }}
                      className={`flex items-start justify-between p-3 rounded-xl border transition-all ${
                        note.completed
                          ? 'bg-[#F7F7F8] dark:bg-[#25282c] border-[#e5e5ea] dark:border-[#35383c] opacity-60'
                          : 'bg-white dark:bg-[#1f2225] border-[#e5e5ea] dark:border-[#35383c] hover:border-[#FF5500]'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 flex-1">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => togglePersonalNote(note.id)}
                          className={`mt-0.5 rounded-md transition-colors cursor-pointer ${
                            note.completed ? 'text-[#008259]' : 'text-[#8E8E93] hover:text-[#008259]'
                          }`}
                        >
                          <span
                            className="material-symbols-outlined text-[22px]"
                            style={{ fontVariationSettings: note.completed ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            {note.completed ? 'check_box' : 'check_box_outline_blank'}
                          </span>
                        </motion.button>
                        <div>
                          <p
                            className={`text-xs font-medium ${
                              note.completed
                                ? 'line-through text-[#8E8E93] dark:text-[#8e9095]'
                                : 'text-[#2C2C2E] dark:text-[#eff1f5]'
                            }`}
                          >
                            {note.text}
                          </p>
                          <span className="text-[10px] text-[#8E8E93] dark:text-[#8e9095] font-mono">
                            {note.createdAt}
                          </span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deletePersonalNote(note.id)}
                        className="text-[#8E8E93] hover:text-[#FF3300] p-1 rounded-lg transition-colors cursor-pointer"
                        title="Delete note"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      </div>
    </div>
  );
};
