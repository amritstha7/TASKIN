import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { useCommunications } from '../hooks/useCommunications';
import { useMediaNotes } from '../hooks/useMediaNotes';
import { resizeImageToBlob } from '../lib/canvasResize';
import { TaskPhotoProof } from '../types';

const MEDIA_NOTE_CATEGORIES = ['General', 'Compliance & Safety', 'Inventory', 'Merchandising', 'Maintenance', 'Training'];

interface MediaItem extends TaskPhotoProof {
  sourceType: 'urgent' | 'task' | 'comm' | 'direct';
  sourceTitle: string;
  sourceId?: string;
  category?: string;
}

export const MediaScreen: React.FC = () => {
  const { tasks, communications, setPreviewPhoto, removePhotoFromTask, attachPhotoToTask, showToast, playChime, t } = useApp();
  const { removePhoto: removeCommPhoto } = useCommunications();
  const { mediaNotes, createMediaNote, deleteMediaNote } = useMediaNotes();

  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'task' | 'comm' | 'direct'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form State
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);
  const [uploadBlob, setUploadBlob] = useState<Blob | null>(null);
  const [uploadCaption, setUploadCaption] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [mediaNoteName, setMediaNoteName] = useState('');
  const [mediaNoteCategory, setMediaNoteCategory] = useState(MEDIA_NOTE_CATEGORIES[0]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Aggregate all photos across tasks, communications & standalone media notes
  const allMediaItems: MediaItem[] = [];

  tasks.forEach((task) => {
    if (task.photos && task.photos.length > 0) {
      task.photos.forEach((photo) => {
        allMediaItems.push({
          ...photo,
          sourceType: task.isUrgent ? 'urgent' : 'task',
          sourceTitle: task.title,
          sourceId: task.id,
          category: task.category,
        });
      });
    }
  });

  communications.forEach((comm) => {
    if (comm.photos && comm.photos.length > 0) {
      comm.photos.forEach((photo) => {
        allMediaItems.push({
          ...photo,
          sourceType: 'comm',
          sourceTitle: comm.title,
          sourceId: comm.id,
        });
      });
    }
  });

  mediaNotes.forEach((note) => {
    allMediaItems.push({
      id: note.id,
      url: note.url,
      storagePath: note.storagePath,
      name: note.name,
      caption: note.caption,
      uploadedAt: note.uploadedAt,
      uploadedBy: note.uploadedByName,
      sourceType: 'direct',
      sourceTitle: note.name,
      sourceId: note.id,
      category: note.category,
    });
  });

  // Filter and search
  const filteredMedia = allMediaItems.filter((item) => {
    if (activeFilter === 'urgent' && item.sourceType !== 'urgent') return false;
    if (activeFilter === 'task' && item.sourceType !== 'task') return false;
    if (activeFilter === 'comm' && item.sourceType !== 'comm') return false;
    if (activeFilter === 'direct' && item.sourceType !== 'direct') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCaption = item.caption?.toLowerCase().includes(q);
      const matchTitle = (item.sourceTitle ?? '').toLowerCase().includes(q);
      const matchUser = item.uploadedBy?.toLowerCase().includes(q);
      const matchName = item.name?.toLowerCase().includes(q);
      return matchCaption || matchTitle || matchUser || matchName;
    }

    return true;
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const blob = await resizeImageToBlob(file, 1200, 0.85);
      if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl);
      setUploadBlob(blob);
      setUploadPreviewUrl(URL.createObjectURL(blob));
    } catch {
      showToast('Failed to process image', 'error');
    }
  };

  const handleSaveUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadBlob) {
      showToast('Please select or capture a photo first', 'error');
      return;
    }

    try {
      if (selectedTaskId) {
        attachPhotoToTask(selectedTaskId, uploadBlob, uploadCaption.trim() || 'Visual store compliance proof');
      } else {
        if (!mediaNoteName.trim()) {
          showToast('Please name this photo note', 'error');
          return;
        }
        await createMediaNote({ blob: uploadBlob, name: mediaNoteName, category: mediaNoteCategory, caption: uploadCaption });
      }

      playChime();
      showToast('Photo uploaded and added to Media Gallery!', 'success');
      setIsUploadModalOpen(false);
      if (uploadPreviewUrl) URL.revokeObjectURL(uploadPreviewUrl);
      setUploadPreviewUrl(null);
      setUploadBlob(null);
      setUploadCaption('');
      setSelectedTaskId('');
      setMediaNoteName('');
      setMediaNoteCategory(MEDIA_NOTE_CATEGORIES[0]);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload failed', 'error');
    }
  };

  const handleDownloadPhoto = (url: string, filename?: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `TASKN_Media_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Image downloaded', 'info');
  };

  const handleDeletePhoto = (item: MediaItem) => {
    if (!item.sourceId) return;
    if (item.sourceType === 'comm') {
      void removeCommPhoto({ id: item.id, storagePath: item.storagePath }).then(() => showToast('Photo removed', 'info'));
    } else if (item.sourceType === 'direct') {
      void deleteMediaNote({ id: item.id, storagePath: item.storagePath }).then(() => showToast('Photo removed', 'info'));
    } else {
      removePhotoFromTask(item.sourceId, item.id);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 animate-in fade-in duration-200 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#191c1f] p-4 sm:p-5 rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] card-depth">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#FFF0EB] dark:bg-[#35383c] text-[#FF5500] dark:text-[#ffb4ac] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">photo_library</span>
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#2C2C2E] dark:text-[#eff1f5] tracking-tight">
              {t.mediaGallery}
            </h1>
            <span className="bg-[#FFF0EB] dark:bg-[#35383c] text-[#FF5500] dark:text-[#ffb4ac] text-xs font-black px-2.5 py-0.5 rounded-full border border-[#FFD8CC] dark:border-[#5d3f3c]">
              {allMediaItems.length}
            </span>
          </div>
          <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-1">
            {t.mediaDesc}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsUploadModalOpen(true)}
          className="w-full sm:w-auto bg-[#FF5500] hover:bg-[#E04800] dark:bg-[#b60013] dark:hover:bg-[#d40017] text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-xs shadow-[0_4px_14px_rgba(255,85,0,0.25)] transition-all cursor-pointer min-h-[42px]"
        >
          <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
          <span>{t.uploadPhoto}</span>
        </motion.button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#FF5500] text-white shadow-xs'
                : 'bg-white dark:bg-[#191c1f] text-[#8E8E93] dark:text-[#8e9095] border border-[#e5e5ea] dark:border-[#35383c] hover:text-[#2C2C2E] dark:hover:text-white'
            }`}
          >
            {t.allMedia} ({allMediaItems.length})
          </button>
          <button
            onClick={() => setActiveFilter('urgent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeFilter === 'urgent'
                ? 'bg-[#d81b1b] text-white shadow-xs'
                : 'bg-white dark:bg-[#191c1f] text-[#8E8E93] dark:text-[#8e9095] border border-[#e5e5ea] dark:border-[#35383c] hover:text-[#2C2C2E] dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#d81b1b]" />
            {t.filterByUrgent} (
            {allMediaItems.filter((i) => i.sourceType === 'urgent').length})
          </button>
          <button
            onClick={() => setActiveFilter('task')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'task'
                ? 'bg-[#FF5500] text-white shadow-xs'
                : 'bg-white dark:bg-[#191c1f] text-[#8E8E93] dark:text-[#8e9095] border border-[#e5e5ea] dark:border-[#35383c] hover:text-[#2C2C2E] dark:hover:text-white'
            }`}
          >
            {t.filterByTask} ({allMediaItems.filter((i) => i.sourceType === 'task').length})
          </button>
          <button
            onClick={() => setActiveFilter('comm')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'comm'
                ? 'bg-[#FF5500] text-white shadow-xs'
                : 'bg-white dark:bg-[#191c1f] text-[#8E8E93] dark:text-[#8e9095] border border-[#e5e5ea] dark:border-[#35383c] hover:text-[#2C2C2E] dark:hover:text-white'
            }`}
          >
            Communications ({allMediaItems.filter((i) => i.sourceType === 'comm').length})
          </button>
          <button
            onClick={() => setActiveFilter('direct')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === 'direct'
                ? 'bg-[#FF5500] text-white shadow-xs'
                : 'bg-white dark:bg-[#191c1f] text-[#8E8E93] dark:text-[#8e9095] border border-[#e5e5ea] dark:border-[#35383c] hover:text-[#2C2C2E] dark:hover:text-white'
            }`}
          >
            Notes ({allMediaItems.filter((i) => i.sourceType === 'direct').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by caption or task..."
            className="w-full pl-9 pr-3.5 py-1.5 bg-white dark:bg-[#191c1f] border border-[#e5e5ea] dark:border-[#35383c] rounded-xl text-xs text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500] placeholder-[#8E8E93]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#2C2C2E] dark:hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#191c1f] rounded-2xl border border-[#e5e5ea] dark:border-[#35383c] p-6 card-depth">
          <div className="w-16 h-16 rounded-full bg-[#FFF0EB] dark:bg-[#35383c] text-[#FF5500] dark:text-[#ffb4ac] flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-[32px]">photo_camera</span>
          </div>
          <h3 className="font-bold text-base text-[#2C2C2E] dark:text-[#eff1f5]">
            {t.noMediaFound}
          </h3>
          <p className="text-xs text-[#8E8E93] dark:text-[#8e9095] mt-1 max-w-md mx-auto">
            Attach photo proof when completing tasks or click the button below to upload store verification pictures.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 bg-[#FF5500] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-[#E04800] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
            <span>{t.uploadPhoto}</span>
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMedia.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              className="bg-white dark:bg-[#191c1f] border border-[#e5e5ea] dark:border-[#35383c] rounded-2xl overflow-hidden card-depth flex flex-col justify-between group transition-all"
            >
              {/* Photo Image with Lightbox Trigger */}
              <div
                className="relative aspect-4/3 bg-[#F7F7F8] dark:bg-[#25282c] overflow-hidden cursor-pointer"
                onClick={() =>
                  setPreviewPhoto({
                    url: item.url,
                    title: item.sourceTitle,
                    caption: item.caption,
                    user: item.uploadedBy,
                    time: item.uploadedAt,
                  })
                }
              >
                <img
                  src={item.url}
                  alt={item.caption || item.sourceTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Top Source Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide text-white shadow-xs backdrop-blur-xs ${
                      item.sourceType === 'urgent'
                        ? 'bg-[#d81b1b]/90 border border-white/30'
                        : 'bg-[#FF5500]/90 border border-white/30'
                    }`}
                  >
                    {item.sourceType === 'urgent'
                      ? 'Urgent'
                      : item.sourceType === 'comm'
                      ? 'Communication'
                      : item.sourceType === 'direct'
                      ? 'Note'
                      : 'Task Proof'}
                  </span>
                  {item.category && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs border border-white/20">
                      {item.category}
                    </span>
                  )}
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-white/90 text-[#2C2C2E] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg backdrop-blur-xs">
                    <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                    View Fullscreen
                  </span>
                </div>
              </div>

              {/* Card Meta & Caption Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black text-[#2C2C2E] dark:text-[#eff1f5] line-clamp-1">
                    {item.sourceTitle}
                  </h4>
                  {item.caption && (
                    <p className="text-[11px] text-[#8E8E93] dark:text-[#8e9095] mt-1 line-clamp-2 leading-relaxed">
                      "{item.caption}"
                    </p>
                  )}
                </div>

                {/* Footer details & Action Buttons */}
                <div className="mt-3 pt-2.5 border-t border-[#e5e5ea] dark:border-[#2e3134] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#8E8E93] dark:text-[#8e9095]">
                    <span className="material-symbols-outlined text-[14px]">person</span>
                    <span className="font-semibold text-[#2C2C2E] dark:text-[#eff1f5]">
                      {item.uploadedBy || 'Associate'}
                    </span>
                    <span>•</span>
                    <span>{item.uploadedAt}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDownloadPhoto(item.url, item.name)}
                      className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#FF5500] hover:bg-[#FFF0EB] dark:hover:bg-[#35383c] transition-colors"
                      title="Download image"
                      aria-label="Download image"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                    </button>
                    <button
                      onClick={() => handleDeletePhoto(item)}
                      className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#d81b1b] hover:bg-[#ffebee] dark:hover:bg-[#35383c] transition-colors"
                      title="Delete photo"
                      aria-label="Delete photo"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Photo Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#191c1f] rounded-2xl max-w-lg w-full p-5 border border-[#FFD8CC] dark:border-[#5d3f3c] shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-[#e5e5ea] dark:border-[#35383c]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#FF5500] text-[22px]">
                    add_a_photo
                  </span>
                  <h3 className="text-base font-black text-[#2C2C2E] dark:text-[#eff1f5]">
                    {t.uploadPhoto}
                  </h3>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-[#8E8E93] hover:text-[#2C2C2E] dark:hover:text-white p-1 rounded-lg"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleSaveUpload} className="space-y-3.5">
                {/* Image Selection / Preview Area */}
                <div>
                  <label className="block text-xs font-bold text-[#8E8E93] dark:text-[#8e9095] mb-1.5">
                    Select or Capture Photo
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => void handleFileChange(e)}
                    className="hidden"
                  />

                  {uploadPreviewUrl ? (
                    <div className="relative rounded-xl overflow-hidden border border-[#FFD8CC] dark:border-[#5d3f3c] max-h-56 bg-black flex items-center justify-center">
                      <img
                        src={uploadPreviewUrl}
                        alt="Preview"
                        className="max-h-56 w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(uploadPreviewUrl);
                          setUploadPreviewUrl(null);
                          setUploadBlob(null);
                        }}
                        className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full hover:bg-black"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#e5e5ea] dark:border-[#35383c] hover:border-[#FF5500] rounded-xl p-6 text-center cursor-pointer bg-[#F7F7F8] dark:bg-[#25282c] transition-colors"
                    >
                      <span className="material-symbols-outlined text-3xl text-[#FF5500] mb-1">
                        add_photo_alternate
                      </span>
                      <p className="text-xs font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                        Click to browse file or take a photo
                      </p>
                      <p className="text-[10px] text-[#8E8E93] dark:text-[#8e9095] mt-0.5">
                        Supports JPEG, PNG, WebP up to 10MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Target Task Linkage */}
                <div>
                  <label className="block text-xs font-bold text-[#8E8E93] dark:text-[#8e9095] mb-1">
                    Associate with Task / Area
                  </label>
                  <select
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-[#25282c] border border-[#e5e5ea] dark:border-[#35383c] rounded-xl text-xs text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500]"
                  >
                    <option value="">General — save as a standalone photo note</option>
                    {tasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.isUrgent ? '🔴 ' : '📋 '} {task.title} ({task.category})
                      </option>
                    ))}
                  </select>
                </div>

                {!selectedTaskId && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#8E8E93] dark:text-[#8e9095] mb-1">Note Name</label>
                      <input
                        type="text"
                        value={mediaNoteName}
                        onChange={(e) => setMediaNoteName(e.target.value)}
                        placeholder="e.g. Aisle 4 endcap"
                        className="w-full p-2 bg-white dark:bg-[#25282c] border border-[#e5e5ea] dark:border-[#35383c] rounded-xl text-xs text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#8E8E93] dark:text-[#8e9095] mb-1">Category</label>
                      <select
                        value={mediaNoteCategory}
                        onChange={(e) => setMediaNoteCategory(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-[#25282c] border border-[#e5e5ea] dark:border-[#35383c] rounded-xl text-xs text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500]"
                      >
                        {MEDIA_NOTE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Caption / Proof Notes */}
                <div>
                  <label className="block text-xs font-bold text-[#8E8E93] dark:text-[#8e9095] mb-1">
                    Caption / Inspection Notes
                  </label>
                  <textarea
                    rows={2}
                    value={uploadCaption}
                    onChange={(e) => setUploadCaption(e.target.value)}
                    placeholder="e.g. Shelf faced, expired items removed, barcode aligned..."
                    className="w-full p-2 bg-white dark:bg-[#25282c] border border-[#e5e5ea] dark:border-[#35383c] rounded-xl text-xs text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500] resize-none"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="flex gap-2 justify-end pt-2 border-t border-[#e5e5ea] dark:border-[#35383c]">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#8E8E93] hover:bg-[#F7F7F8] dark:hover:bg-[#35383c] transition-colors"
                  >
                    {t.btnCancel}
                  </button>
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.96 }}
                    disabled={!uploadBlob}
                    className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
                      uploadBlob
                        ? 'bg-[#FF5500] hover:bg-[#E04800] cursor-pointer'
                        : 'bg-[#FF5500]/50 cursor-not-allowed'
                    }`}
                  >
                    Save &amp; Upload
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
