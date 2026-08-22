import React, { useState } from 'react';
import { todayIso } from '../lib/format';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Priority, TaskCategory } from '../types';

interface AddTaskModalProps {
  isPageMode?: boolean;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isPageMode = false }) => {
  const {
    isAddTaskModalOpen,
    setIsAddTaskModalOpen,
    addTask,
    createCommunication,
    setCurrentScreen,
    t,
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(todayIso);
  const [priority, setPriority] = useState<Priority>('medium');
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [taskType, setTaskType] = useState<'urgent' | 'normal' | 'comm'>('normal');
  const isUrgent = taskType === 'urgent';
  const isComm = taskType === 'comm';
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTiming, setNotificationTiming] = useState<'15m' | '30m' | '1h' | '1d'>('15m');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAddTaskModalOpen && !isPageMode) {
    return null;
  }

  const handleClose = () => {
    setIsAddTaskModalOpen(false);
    if (isPageMode) {
      setCurrentScreen('dashboard');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage(t.taskTitlePlaceholder || 'Please enter a task title');
      return;
    }

    if (isComm) {
      createCommunication({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || todayIso(),
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        category: 'General Ops' as TaskCategory,
        dueDate: dueDate || todayIso(),
        priority: isUrgent ? 'urgent' : priority,
        repeat,
        isUrgent,
        notifications: {
          enabled: notificationsEnabled,
          timing: notificationTiming,
        },
      });
    }

    // Reset form
    setTitle('');
    setDescription('');
    setTaskType('normal');
    setErrorMessage('');
    handleClose();
  };

  const formContent = (
    <div className="bg-white dark:bg-[#191c1f] border border-[#e5e5ea] dark:border-[#5d3f3c] rounded-2xl p-4 sm:p-7 card-depth flex-1 max-w-3xl w-full mx-auto transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e5e5ea] dark:border-[#35383c]">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] dark:bg-[#35383c] text-[#FF5500] dark:text-[#ffb4ac] flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[24px]">add_task</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#2C2C2E] dark:text-[#eff1f5] tracking-tight">
              {t.addTaskTitle}
            </h1>
            <p className="text-xs text-[#8E8E93] dark:text-[#8e9095]">
              Assign immediate or recurring store operational directive
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClose}
          className="bg-[#F7F7F8] dark:bg-[#26282b] text-[#8E8E93] hover:text-[#2C2C2E] dark:text-[#eff1f5] border border-[#e5e5ea] dark:border-[#35383c] px-4 py-2 rounded-xl flex items-center justify-center font-bold text-xs transition-colors cursor-pointer min-h-[38px]"
        >
          {t.cancel}
        </motion.button>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-[#FFF0EB] border border-[#FFD8CC] text-[#FF5500] rounded-xl text-xs font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Task Title */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-title" className="text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
            {t.taskTitle} <span className="text-[#FF5500]">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder={t.taskTitlePlaceholder}
            className="w-full border border-[#e5e5ea] dark:border-[#5d3f3c] rounded-xl px-4 py-2.5 min-h-[44px] focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] outline-none bg-white dark:bg-[#25282c] text-[#2C2C2E] dark:text-[#eff1f5] text-sm transition-all"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-desc" className="text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
            {t.description}
          </label>
          <textarea
            id="task-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.descriptionPlaceholder}
            className="w-full border border-[#e5e5ea] dark:border-[#5d3f3c] rounded-xl p-3.5 focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] outline-none bg-white dark:bg-[#25282c] text-[#2C2C2E] dark:text-[#eff1f5] text-sm transition-all resize-y"
          />
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="due-date" className="text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
            {t.dueDate}
          </label>
          <div className="relative">
            <input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-[#e5e5ea] dark:border-[#5d3f3c] rounded-xl px-4 py-2.5 min-h-[44px] focus:border-[#FF5500] outline-none bg-white dark:bg-[#25282c] text-[#2C2C2E] dark:text-[#eff1f5] text-sm transition-all pl-10"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93] pointer-events-none text-xl">
              calendar_month
            </span>
          </div>
        </div>

        {/* Priority & Repeat */}
        {!isComm && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="priority" className="text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                {t.priority}
              </label>
              <div className="relative">
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full border border-[#e5e5ea] dark:border-[#5d3f3c] rounded-xl px-4 py-2.5 min-h-[44px] focus:border-[#FF5500] outline-none bg-white dark:bg-[#25282c] text-[#2C2C2E] dark:text-[#eff1f5] text-sm transition-all appearance-none pr-10"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] pointer-events-none text-xl">
                  expand_more
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-repeat" className="text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                {t.repeat}
              </label>
              <div className="relative">
                <select
                  id="task-repeat"
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value as 'none' | 'daily' | 'weekly' | 'monthly')}
                  className="w-full border border-[#e5e5ea] dark:border-[#5d3f3c] rounded-xl px-4 py-2.5 min-h-[44px] focus:border-[#FF5500] outline-none bg-white dark:bg-[#25282c] text-[#2C2C2E] dark:text-[#eff1f5] text-sm transition-all appearance-none pr-10"
                >
                  <option value="none">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] pointer-events-none text-xl">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Card */}
        {!isComm && (
          <div className="flex flex-col gap-2 p-3.5 border border-[#e5e5ea] dark:border-[#5d3f3c] rounded-xl bg-[#F7F7F8] dark:bg-[#25282c]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                  {t.notificationsTitle}
                </span>
                <span className="text-[11px] text-[#8E8E93] dark:text-[#8e9095]">
                  {t.notificationsDesc}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#e5e5ea] dark:bg-[#414448] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5500] dark:peer-checked:bg-[#b60013]" />
              </label>
            </div>

            {notificationsEnabled && (
              <div className="relative mt-1">
                <select
                  value={notificationTiming}
                  onChange={(e) =>
                    setNotificationTiming(e.target.value as '15m' | '30m' | '1h' | '1d')
                  }
                  className="w-full border border-[#e5e5ea] dark:border-[#5d3f3c] rounded-xl px-3.5 py-2 min-h-[38px] focus:border-[#FF5500] outline-none bg-white dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5] text-xs transition-all appearance-none pr-10"
                >
                  <option value="15m">15 mins before</option>
                  <option value="30m">30 mins before</option>
                  <option value="1h">1 hour before</option>
                  <option value="1d">1 day before</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] pointer-events-none text-base">
                  expand_more
                </span>
              </div>
            )}
          </div>
        )}

        {/* Task Type: which dashboard section this lands in */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5]">Type</label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ['urgent', 'Urgent'],
                ['normal', 'Normal'],
                ['comm', 'Comm'],
              ] as [typeof taskType, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTaskType(value)}
                className={`min-h-[42px] rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  taskType === value
                    ? value === 'urgent'
                      ? 'bg-[#d81b1b] border-[#d81b1b] text-white'
                      : 'bg-[#FF5500] border-[#FF5500] text-white'
                    : 'border-[#e5e5ea] dark:border-[#5d3f3c] text-[#2C2C2E] dark:text-[#eff1f5] bg-white dark:bg-[#25282c]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-2 pt-2">
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-[#FF5500] hover:bg-[#E04800] dark:bg-[#b60013] dark:hover:bg-[#d40017] text-white transition-all rounded-xl min-h-[46px] flex items-center justify-center text-sm font-bold shadow-[0_4px_14px_rgba(255,85,0,0.3)] cursor-pointer"
          >
            {t.createTask}
          </motion.button>
        </div>
      </form>
    </div>
  );

  if (isPageMode) {
    return formContent;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl my-auto">
        {formContent}
      </div>
    </div>
  );
};
