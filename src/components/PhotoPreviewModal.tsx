import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

export const PhotoPreviewModal: React.FC = () => {
  const { previewPhoto, setPreviewPhoto } = useApp();

  if (!previewPhoto) return null;

  return (
    <div
      id="photo-preview-lightbox"
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 select-none"
      onClick={() => setPreviewPhoto(null)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full max-h-[90vh] bg-[#191c1f] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
      >
        {/* Top bar */}
        <div className="p-3.5 sm:p-4 bg-[#25282c] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-[20px] text-[#ffb4ac]">
              photo_camera
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-bold truncate max-w-[240px] sm:max-w-md">
                {previewPhoto.title || 'Task Photo Proof'}
              </h3>
              {(previewPhoto.user || previewPhoto.time) && (
                <p className="text-[10px] text-white/60">
                  {previewPhoto.user ? `By ${previewPhoto.user}` : ''} {previewPhoto.time ? `at ${previewPhoto.time}` : ''}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={previewPhoto.url}
              download="task-photo-proof.jpg"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px] font-medium"
              title="Open full resolution / Download"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span className="hidden sm:inline">Save</span>
            </a>
            <button
              id="close-photo-preview"
              type="button"
              onClick={() => setPreviewPhoto(null)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close Preview"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Image content */}
        <div className="flex-1 overflow-auto p-2 sm:p-4 flex items-center justify-center bg-black/60 min-h-[300px]">
          <img
            src={previewPhoto.url}
            alt={previewPhoto.title || 'Photo Proof'}
            className="max-h-[68vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* Caption bar */}
        {previewPhoto.caption && (
          <div className="p-3 bg-[#25282c] border-t border-white/10 text-white text-xs">
            <p className="text-[11px] text-white/90">
              <span className="font-bold text-[#ffb4ac]">Proof Caption: </span>
              {previewPhoto.caption}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
