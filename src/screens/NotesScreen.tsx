import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const NotesScreen: React.FC = () => {
  const {
    notes,
    addPersonalNote,
    togglePersonalNote,
    deletePersonalNote,
    setCurrentScreen,
    myNotesCount,
    t,
  } = useApp();

  const [newNoteText, setNewNoteText] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredNotes = notes.filter((n) => {
    if (filter === 'active' && n.completed) return false;
    if (filter === 'completed' && !n.completed) return false;
    return true;
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteText.trim()) {
      addPersonalNote(newNoteText.trim());
      setNewNoteText('');
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

        <span className="text-xs text-[#8E8E93] dark:text-[#8e9095] font-medium">
          {myNotesCount} Active Notes
        </span>
      </div>

      {/* Category Hero Banner */}
      <div className="rounded-2xl bg-[#242830] dark:bg-[#1f2228] border border-[#353942] text-white p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <span className="material-symbols-outlined text-[24px]">edit_note</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  {t.myTasksNotes}
                </h1>
                <span className="bg-[#FF5500] text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  {myNotesCount}
                </span>
              </div>
              <p className="text-xs text-[#8E9299] font-medium mt-0.5">
                Personal scratchpad, shift reminders, and operational checklist
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Note Input Form */}
      <form
        onSubmit={handleAddNote}
        className="bg-white dark:bg-[#191c1f] p-3 rounded-2xl border border-[#FFD8CC] dark:border-[#5d3f3c] shadow-sm flex gap-2 items-end"
      >
        <textarea
          rows={1}
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          placeholder="Add a new quick note, checklist item, or reminder..."
          className="flex-1 text-xs md:text-sm bg-transparent px-3 py-2 text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none placeholder:text-[#8E8E93] resize-none"
        />
        <button
          type="submit"
          disabled={!newNoteText.trim()}
          className="bg-[#FF5500] hover:bg-[#E04800] disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Note</span>
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-[#191c1f] p-1.5 rounded-xl border border-[#e5e5ea] dark:border-[#35383c] shadow-2xs">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-[#242830] text-white shadow-xs'
              : 'text-[#8E8E93] dark:text-[#8e9095] hover:text-[#2C2C2E] dark:hover:text-[#eff1f5]'
          }`}
        >
          All ({notes.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'active'
              ? 'bg-[#242830] text-white shadow-xs'
              : 'text-[#8E8E93] dark:text-[#8e9095] hover:text-[#2C2C2E] dark:hover:text-[#eff1f5]'
          }`}
        >
          Active ({notes.filter((n) => !n.completed).length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'completed'
              ? 'bg-[#242830] text-white shadow-xs'
              : 'text-[#8E8E93] dark:text-[#8e9095] hover:text-[#2C2C2E] dark:hover:text-[#eff1f5]'
          }`}
        >
          Completed ({notes.filter((n) => n.completed).length})
        </button>
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-[#191c1f] rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] p-6">
          <span className="material-symbols-outlined text-4xl text-[#8E8E93] mb-2">
            note_alt
          </span>
          <h3 className="font-bold text-base text-[#2C2C2E] dark:text-[#eff1f5]">
            No Notes Found
          </h3>
          <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-1 max-w-sm mx-auto">
            Use the input box above to jot down quick reminders for your shift.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                note.completed
                  ? 'bg-[#F7F7F8] dark:bg-[#25282c] border-[#e5e5ea] dark:border-[#35383c] opacity-75'
                  : 'bg-white dark:bg-[#1f2225] border-[#e5e5ea] dark:border-[#35383c] hover:border-[#FF5500] shadow-[0_2px_8px_rgba(0,0,0,0.03)]'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => togglePersonalNote(note.id)}
                  className={`p-1 rounded-xl transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center ${
                    note.completed
                      ? 'text-[#008259] bg-[#e1ffec]'
                      : 'text-[#8E8E93] hover:text-[#008259]'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{ fontVariationSettings: note.completed ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {note.completed ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </motion.button>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs md:text-sm font-medium ${
                      note.completed
                        ? 'line-through text-[#8E8E93] dark:text-[#8e9095]'
                        : 'text-[#2C2C2E] dark:text-[#eff1f5]'
                    }`}
                  >
                    {note.text}
                  </p>
                  <span className="text-[10px] text-[#8E8E93] dark:text-[#8e9095]">
                    {note.createdAt}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => deletePersonalNote(note.id)}
                className="text-[#8E8E93] hover:text-[#FF3300] p-1.5 rounded-xl hover:bg-[#FFF0EB] transition-colors cursor-pointer"
                title={t.delete}
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
