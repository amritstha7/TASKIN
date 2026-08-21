import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { TaskPhotoProof } from '../types';

const SAMPLE_PROOF_PRESETS = [
  {
    name: 'Shelf Restock Verification',
    url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80',
    caption: 'Aisles 1-4 faced and restocked to shelf capacity.',
  },
  {
    name: 'Chiller Temp Log',
    url: 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=800&auto=format&fit=crop&q=80',
    caption: 'Refrigeration telemetry reading verified at 2.4°C.',
  },
  {
    name: 'Promotional Endcap Facing',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    caption: 'Weekly protein bar display set up with markdown tags.',
  },
  {
    name: 'Barcode Scanner Audit',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    caption: 'Handheld terminal calibrated and connected to inventory server.',
  },
];

export const TaskPhotoProofModal: React.FC = () => {
  const {
    photoProofModalTask,
    setPhotoProofModalTask,
    completeTaskWithPhoto,
    attachPhotoToTask,
    userProfile,
    showToast,
    t,
  } = useApp();

  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoCaption, setPhotoCaption] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!photoProofModalTask) return null;

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPhotoUrl(compressedDataUrl);
          if (!photoCaption) {
            setPhotoCaption(`Proof captured by ${userProfile.name} on ${new Date().toLocaleDateString()}`);
          }
          showToast('Photo proof ready!', 'success');
        }
        setIsProcessing(false);
      };

      img.onerror = () => {
        setIsProcessing(false);
        showToast('Failed to load image file', 'error');
      };

      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };

    reader.onerror = () => {
      setIsProcessing(false);
      showToast('Error reading image from storage', 'error');
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleCompleteWithProof = () => {
    if (!photoUrl) {
      showToast('Please capture or choose a photo proof first', 'error');
      return;
    }

    const proof: TaskPhotoProof = {
      id: `proof-${Date.now()}`,
      url: photoUrl,
      caption: photoCaption.trim() || 'Task completion photo proof',
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      uploadedBy: userProfile.name,
    };

    completeTaskWithPhoto(photoProofModalTask.id, proof, photoCaption.trim());
    setPhotoProofModalTask(null);
    setPhotoUrl('');
    setPhotoCaption('');
  };

  const handleAttachOnly = () => {
    if (!photoUrl) {
      showToast('Please capture or choose a photo proof first', 'error');
      return;
    }

    const proof: TaskPhotoProof = {
      id: `proof-${Date.now()}`,
      url: photoUrl,
      caption: photoCaption.trim() || 'Attached task photo evidence',
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      uploadedBy: userProfile.name,
    };

    attachPhotoToTask(photoProofModalTask.id, proof);
    setPhotoProofModalTask(null);
    setPhotoUrl('');
    setPhotoCaption('');
  };

  return (
    <div
      id="task-photo-proof-overlay"
      className="fixed inset-0 bg-black/65 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 10 }}
        className="bg-white dark:bg-[#191c1f] rounded-2xl max-w-lg w-full border border-[#FFD8CC] dark:border-[#5d3f3c] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#F7F7F8] dark:bg-[#26282b] border-b border-[#e5e5ea] dark:border-[#35383c] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFF0EB] dark:bg-[#35383c] flex items-center justify-center text-[#FF5500] dark:text-[#ffb4ac]">
              <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#2C2C2E] dark:text-[#eff1f5]">
                Attach Task Photo Proof
              </h3>
              <p className="text-[11px] text-[#8E8E93] dark:text-[#8e9095] max-w-[280px] sm:max-w-md truncate">
                Task: {photoProofModalTask.title}
              </p>
            </div>
          </div>
          <button
            id="close-photo-proof-modal"
            type="button"
            onClick={() => {
              setPhotoProofModalTask(null);
              setPhotoUrl('');
              setPhotoCaption('');
            }}
            className="p-1.5 text-[#8E8E93] hover:text-[#2C2C2E] dark:hover:text-white rounded-lg transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* Target Task Summary Card */}
          <div className="p-3 rounded-xl bg-[#FFF9F6] dark:bg-[#25282c] border border-[#FFD8CC] dark:border-[#5d3f3c] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-[#FF5500] dark:text-[#ffb4ac] mt-0.5 shrink-0">
              task_alt
            </span>
            <div className="flex-1">
              <h4 className="font-bold text-[#2C2C2E] dark:text-[#eff1f5] text-xs">
                {photoProofModalTask.title}
              </h4>
              <p className="text-[11px] text-[#8E8E93] dark:text-[#8e9095] mt-0.5">
                Category: <span className="font-semibold">{photoProofModalTask.category}</span> • Due: {photoProofModalTask.dueDate}
              </p>
            </div>
          </div>

          {/* Photo Dropzone or Preview Area */}
          <div className="space-y-2.5">
            <label className="font-bold text-[#2C2C2E] dark:text-[#eff1f5] flex items-center justify-between">
              <span>Photo Evidence / Image Proof</span>
              {photoUrl && (
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="text-[10px] text-[#FF5500] dark:text-[#ffb4ac] hover:underline cursor-pointer"
                >
                  Clear Photo
                </button>
              )}
            </label>

            {photoUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-[#e5e5ea] dark:border-[#35383c] bg-black/5 dark:bg-white/5 aspect-video max-h-56 flex items-center justify-center">
                <img
                  src={photoUrl}
                  alt="Proof Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-[11px] font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#008259]">
                      check_circle
                    </span>
                    Photo ready to attach
                  </span>
                </div>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                  dragActive
                    ? 'border-[#FF5500] bg-[#FFF0EB]/60 dark:bg-[#35383c]'
                    : 'border-[#c7c7cc] dark:border-[#4d5055] hover:border-[#FF5500] bg-[#F7F7F8] dark:bg-[#25282c]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[#FFF0EB] dark:bg-[#35383c] text-[#FF5500] dark:text-[#ffb4ac] flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">camera_enhance</span>
                </div>

                <p className="font-bold text-[#2C2C2E] dark:text-[#eff1f5] text-xs mb-1">
                  Upload or Capture Proof of Completion
                </p>
                <p className="text-[11px] text-[#8E8E93] dark:text-[#8e9095] mb-3 max-w-xs mx-auto">
                  Take a photo of the completed shelf, temperature gauge, or signed document
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FF5500] text-white font-bold text-xs hover:bg-[#E04800] transition-colors cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                    Take Camera Photo
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#191c1f] border border-[#e5e5ea] dark:border-[#35383c] font-bold text-xs text-[#2C2C2E] dark:text-[#eff1f5] hover:border-[#FF5500] dark:hover:border-[#ffb4ac] hover:text-[#FF5500] dark:hover:text-[#ffb4ac] transition-colors cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">photo_library</span>
                    Choose From Gallery
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preset Photo Proofs */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-[#8E8E93] dark:text-[#8e9095]">
              Quick Sample Store Proofs:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_PROOF_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPhotoUrl(preset.url);
                    setPhotoCaption(preset.caption);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    photoUrl === preset.url
                      ? 'border-[#FF5500] bg-[#FFF0EB] dark:bg-[#35383c]'
                      : 'border-[#e5e5ea] dark:border-[#35383c] bg-white dark:bg-[#25282c] hover:border-[#FF5500]'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[11px] text-[#2C2C2E] dark:text-[#eff1f5] truncate">
                      {preset.name}
                    </p>
                    <p className="text-[9px] text-[#8E8E93] dark:text-[#8e9095] truncate">
                      Click to use sample
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Caption / Note Field */}
          <div className="space-y-1">
            <label className="font-bold text-[#2C2C2E] dark:text-[#eff1f5] block">
              Proof Notes / Verification Caption
            </label>
            <textarea
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              placeholder="e.g., Audited 24 items on aisle 4, all shelf barcodes facing front and stock replenished."
              rows={2}
              className="w-full border border-[#e5e5ea] dark:border-[#35383c] rounded-xl p-2.5 bg-white dark:bg-[#25282c] text-[#2C2C2E] dark:text-[#eff1f5] text-xs focus:outline-none focus:border-[#FF5500]"
            />
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 bg-[#F7F7F8] dark:bg-[#26282b] border-t border-[#e5e5ea] dark:border-[#35383c] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setPhotoProofModalTask(null);
              setPhotoUrl('');
              setPhotoCaption('');
            }}
            className="px-4 py-2.5 border border-[#e5e5ea] dark:border-[#35383c] rounded-xl hover:bg-white dark:hover:bg-[#191c1f] font-bold text-xs text-[#2C2C2E] dark:text-[#eff1f5] cursor-pointer transition-colors"
          >
            {t.cancel}
          </button>

          <div className="flex items-center gap-2">
            {photoProofModalTask.completed && (
              <button
                type="button"
                onClick={handleAttachOnly}
                disabled={!photoUrl}
                className="px-4 py-2.5 rounded-xl border border-[#FF5500] text-[#FF5500] dark:text-[#ffb4ac] font-bold text-xs hover:bg-[#FFF0EB] dark:hover:bg-[#35383c] disabled:opacity-50 transition-colors cursor-pointer"
              >
                Attach Proof Only
              </button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleCompleteWithProof}
              disabled={!photoUrl}
              className="bg-gradient-to-r from-[#008259] to-[#006644] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Complete with Proof
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
