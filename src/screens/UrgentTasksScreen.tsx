import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

export const UrgentTasksScreen: React.FC = () => {
  const {
    tasks,
    toggleTaskComplete,
    deleteTask,
    snoozeTask,
    addNoteToTask,
    setCurrentScreen,
    setPhotoProofModalTask,
    setPreviewPhoto,
    removePhotoFromTask,
    urgentTasksCount,
    t,
  } = useApp();

  const [activeNoteTaskId, setActiveNoteTaskId] = useState<string | null>(null);
  const [taskNoteInput, setTaskNoteInput] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const urgentTasks = tasks.filter((tItem) => tItem.isUrgent);

  const filteredTasks = urgentTasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleSaveNote = (taskId: string) => {
    if (taskNoteInput.trim()) {
      addNoteToTask(taskId, taskNoteInput);
      setTaskNoteInput('');
      setActiveNoteTaskId(null);
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
          onClick={() => setCurrentScreen('add-task')}
          className="flex items-center gap-1 bg-[#FF5500] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm hover:bg-[#E04800] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Add Task</span>
        </motion.button>
      </div>

      {/* Category Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#d81b1b] via-[#ea3822] to-[#ef4444] text-white p-4 sm:p-5 shadow-[0_6px_20px_rgba(234,56,34,0.3)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30">
              <span className="material-symbols-outlined text-[24px]">priority_high</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  {t.urgentActions}
                </h1>
                <span className="bg-white text-[#d81b1b] text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  {urgentTasksCount}
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium mt-0.5">
                Critical store compliance and immediate operational requirements
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
          All ({urgentTasks.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'pending'
              ? 'bg-[#FF5500] text-white shadow-xs'
              : 'text-[#8E8E93] dark:text-[#8e9095] hover:text-[#2C2C2E] dark:hover:text-[#eff1f5]'
          }`}
        >
          Pending ({urgentTasks.filter((tItem) => !tItem.completed).length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'completed'
              ? 'bg-[#FF5500] text-white shadow-xs'
              : 'text-[#8E8E93] dark:text-[#8e9095] hover:text-[#2C2C2E] dark:hover:text-[#eff1f5]'
          }`}
        >
          Completed ({urgentTasks.filter((tItem) => tItem.completed).length})
        </button>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#191c1f] rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] p-6">
          <span className="material-symbols-outlined text-4xl text-[#008259] mb-2">
            check_circle
          </span>
          <h3 className="font-bold text-base text-[#2C2C2E] dark:text-[#eff1f5]">
            No Urgent Actions Found
          </h3>
          <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-1 max-w-sm mx-auto">
            {filter === 'completed'
              ? 'No urgent actions completed yet.'
              : 'All critical tasks are currently fulfilled and in compliance.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border transition-all ${
                task.completed
                  ? 'bg-[#F7F7F8] dark:bg-[#25282c] border-[#e5e5ea] dark:border-[#35383c] opacity-80'
                  : 'bg-white dark:bg-[#1f2225] border-[#FFD8CC] dark:border-[#93000d]/50 hover:border-[#FF5500] shadow-[0_4px_16px_rgba(255,85,0,0.08)]'
              }`}
            >
              <div className="flex flex-col gap-2.5">
                {/* Header row: Checkbox, Title & Badges on Left, Compact Actions on Right */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`mt-0.5 rounded-xl p-1.5 transition-all flex items-center justify-center cursor-pointer min-h-[38px] min-w-[38px] shrink-0 ${
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

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm sm:text-base font-bold tracking-tight leading-snug break-words ${
                          task.completed
                            ? 'line-through text-[#8E8E93] dark:text-[#8e9095]'
                            : 'text-[#2C2C2E] dark:text-[#eff1f5]'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-1.5 flex-wrap mt-1">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#FFF0EB] text-[#FF5500] border border-[#FFD8CC] dark:bg-[#ba1a1a]/30 dark:text-[#ffb4ac] uppercase whitespace-nowrap">
                          {t.highPriority}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F7F7F8] dark:bg-[#35383c] text-[#2C2C2E] dark:text-[#eff1f5] border border-[#e5e5ea] dark:border-[#4d2d2a] whitespace-nowrap">
                          {task.category}
                        </span>
                        <span className="text-[10px] text-[#8E8E93] dark:text-[#d8dade] font-mono whitespace-nowrap">
                          Due: {task.dueDate.split('-').reverse().join('/')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons: Photo Proof, Snooze, Note, Delete */}
                  <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPhotoProofModalTask(task)}
                      className="p-1.5 sm:p-2 text-[#8E8E93] dark:text-[#d8dade] hover:bg-[#FFF0EB] dark:hover:bg-[#35383c] hover:text-[#FF5500] rounded-xl transition-colors min-h-[34px] min-w-[34px] flex items-center justify-center cursor-pointer relative"
                      title="Attach Photo Proof"
                    >
                      <span className="material-symbols-outlined text-[19px]">add_a_photo</span>
                      {task.photos && task.photos.length > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5500]" />
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => snoozeTask(task.id, 2)}
                      className="p-1.5 sm:p-2 text-[#8E8E93] dark:text-[#d8dade] hover:bg-[#F7F7F8] dark:hover:bg-[#35383c] hover:text-[#FF5500] rounded-xl transition-colors min-h-[34px] min-w-[34px] flex items-center justify-center cursor-pointer"
                      title={t.snooze}
                    >
                      <span className="material-symbols-outlined text-[19px]">snooze</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setActiveNoteTaskId(activeNoteTaskId === task.id ? null : task.id);
                        setTaskNoteInput('');
                      }}
                      className="p-1.5 sm:p-2 text-[#8E8E93] dark:text-[#d8dade] hover:bg-[#F7F7F8] dark:hover:bg-[#35383c] hover:text-[#FF5500] rounded-xl transition-colors min-h-[34px] min-w-[34px] flex items-center justify-center cursor-pointer"
                      title={t.addNote}
                    >
                      <span className="material-symbols-outlined text-[19px]">note_add</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 sm:p-2 text-[#FF3300] hover:bg-[#FFF0EB] rounded-xl transition-colors min-h-[34px] min-w-[34px] flex items-center justify-center cursor-pointer"
                      title={t.delete}
                    >
                      <span className="material-symbols-outlined text-[19px]">delete</span>
                    </motion.button>
                  </div>
                </div>

                {/* Description - stretches horizontally across full width */}
                {task.description && (
                  <div className="w-full pl-0 sm:pl-[50px] pt-1">
                    <p className="text-xs sm:text-sm text-[#48484a] dark:text-[#c7cad1] leading-relaxed font-normal break-words">
                      {task.description}
                    </p>
                  </div>
                )}

                {/* Completed metadata - stretches horizontally */}
                {task.completed && task.completedBy && (
                  <div className="w-full sm:w-fit text-xs text-[#008259] dark:text-[#2dd4bf] font-bold flex items-center gap-2 bg-[#e1ffec]/80 dark:bg-[#008259]/20 px-3 py-1.5 rounded-xl border border-[#a3e6be] dark:border-[#008259]/40 ml-0 sm:ml-[50px]">
                    <span className="material-symbols-outlined text-[16px] shrink-0">verified</span>
                    <span>Completed by {task.completedBy} at {task.completedAt || '14:30'}</span>
                  </div>
                )}

                {/* Photos attached to urgent task */}
                {task.photos && task.photos.length > 0 && (
                  <div className="w-full pl-0 sm:pl-[50px] mt-1 pt-2.5 border-t border-[#e5e5ea] dark:border-[#35383c]">
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
                  <div className="w-full pl-0 sm:pl-[50px] mt-1">
                    <div className="pl-3 border-l-2 border-[#FF5500] space-y-1 bg-[#FFF9F6] dark:bg-[#25282c] p-2 rounded-r-lg">
                      {task.notes.map((note, idx) => (
                        <p
                          key={idx}
                          className="text-[11px] text-[#2C2C2E] dark:text-[#d8dade] italic break-words"
                        >
                          "{note}"
                        </p>
                      ))}
                    </div>
                  </div>
                )}
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
                    placeholder="Type urgent operational note..."
                    className="flex-1 text-xs border border-[#e5e5ea] dark:border-[#5d3f3c] rounded-xl px-3 py-2 bg-white dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500] resize-none"
                  />
                  <button
                    onClick={() => handleSaveNote(task.id)}
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
    </div>
  );
};
