import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../providers/AuthProvider';
import { resizeImageToBlob } from '../lib/canvasResize';
import { BUCKETS, getPublicUrl, uploadImage } from '../lib/storage';

const PRESET_AVATARS = [
  {
    label: 'Male Lead',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi86mmqCN21rBK0kYzUYKSu97D2RpDIxTNOnvsRPRPa9_kNl9u3dz0m7fMGHbs4C2vGYdYVHpBYKWgLOFPzLY0i-rbdHo5lPtP2W-7dcgHKtGwERp_VIyKg6AkqU5ZLgBxecnqvk3kg-SOeVgC57U_B-4P2Y5yPkvE6dlzBu7lQuBQoce2VSqUiLVOkxvSunD3Gh0ZmOpTuae0ascHVFteHn5hn28qduSqlnju15I0h0PzWGsN8yHLCw',
  },
  {
    label: 'Female Specialist',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcC8k7AYMSLd-FZGDYx5kyDL0ByZ-_-Ec3swOJrvM6-G1_AATddabwVfcFCzsAMKyjH64si_pnH21w2lyvn7oq2mlDH18moEdfQrVtgYuBd9B3ga4xNqOBNLCNKyeFACEybCpfQdhOmYY0x7p6h_iKyaS0HQMMq4_hgR5fFXXLv3204P_9EklJF1ZJinAP20yhU16i6hdLtX_2xx6w965NFts5zBgkVwgf0c-ge9Bwta1A1Z_QOVm5IQ',
  },
  {
    label: 'Operations Exec',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfzKY27yC2LTFjdaaY6OALTUZGJ_sZj1BC1sVrg3iO3RoHEeh8GnM3WxBuFa90MBOl0ojwzJc8VOhl2MFAzSOrCbQ_K3ZRakJBeF5JJTGAF_DjpzMs7qX3wGH-pvEUq7SMJ3thLmH8Csscdfjn9hdjehhTTaKcGUmeRsOk79N7nyQz8Wt9W7a2PNJefaGsBNU1GHxCRGg0y87THQPLUcy5BNX6RviQ-ahQoFq8eDwaA6BPs7xls_eUcg',
  },
  {
    label: 'Store Badge',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
];

export const EditProfileModal: React.FC = () => {
  const { isEditProfileModalOpen, setIsEditProfileModalOpen, userProfile, updateUserProfile, showToast, t } = useApp();
  const { user } = useAuth();

  const [name, setName] = useState(userProfile.name);
  const [role, setRole] = useState(userProfile.role);
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isEditProfileModalOpen) return null;

  // Resize, upload to the avatars storage bucket, and use the resulting public URL
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)', 'error');
      return;
    }
    if (!user) return;

    setIsProcessingImage(true);
    try {
      const blob = await resizeImageToBlob(file, 400, 0.85);
      const path = `${user.id}/avatar.jpg`;
      await uploadImage(BUCKETS.avatars, path, blob);
      // Cache-bust: the storage path is stable, so the public URL alone won't
      // change after replacing the file — force reload with a version param.
      setAvatarUrl(`${getPublicUrl(BUCKETS.avatars, path)}?v=${Date.now()}`);
      showToast('Profile photo uploaded!', 'success');
    } catch {
      showToast('Failed to upload image', 'error');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      void processImageFile(e.target.files[0]);
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
      void processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // `email` and `branch` are display-only here: the login email is a
    // separate auth flow, and branch reassignment is blocked server-side.
    updateUserProfile({
      name: name.trim(),
      role: role.trim(),
      avatarUrl: avatarUrl.trim(),
    });
    setIsEditProfileModalOpen(false);
  };

  return (
    <div
      id="edit-profile-modal-overlay"
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
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#2C2C2E] dark:text-[#eff1f5]">
                {t.editProfile}
              </h3>
              <p className="text-[11px] text-[#8E8E93] dark:text-[#8e9095]">
                Update your avatar photo, personal details, and store branch
              </p>
            </div>
          </div>
          <button
            id="close-edit-profile-modal"
            type="button"
            onClick={() => setIsEditProfileModalOpen(false)}
            className="p-1.5 text-[#8E8E93] hover:text-[#2C2C2E] dark:hover:text-white rounded-lg transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* Avatar Customization Upload Section */}
          <div className="p-4 rounded-xl bg-[#F7F7F8] dark:bg-[#25282c] border border-[#e5e5ea] dark:border-[#35383c] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2C2C2E] dark:text-[#eff1f5] flex items-center gap-1.5 text-xs">
                <span className="material-symbols-outlined text-[16px] text-[#FF5500] dark:text-[#ffb4ac]">
                  photo_camera
                </span>
                Profile Photo & Avatar
              </span>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl(PRESET_AVATARS[0].url)}
                  className="text-[10px] text-[#8E8E93] hover:text-[#FF5500] dark:hover:text-[#ffb4ac] underline cursor-pointer"
                >
                  Reset Default
                </button>
              )}
            </div>

            {/* Circular Preview with Camera Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative group">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-[#FF5500] dark:border-[#ffb4ac] shadow-md bg-[#e5e5ea] dark:bg-[#35383c] shrink-0">
                  <img
                    src={avatarUrl || PRESET_AVATARS[0].url}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PRESET_AVATARS[0].url;
                    }}
                  />
                </div>
                {/* Overlay upload click button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer"
                  title="Upload from Device"
                >
                  <span className="material-symbols-outlined text-[20px]">upload</span>
                  <span className="text-[9px] font-bold">Change</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#FF5500] text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#191c1f] cursor-pointer hover:bg-[#E04800] transition-colors"
                  aria-label="Upload Photo"
                >
                  <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                </button>
              </div>

              {/* Upload actions & drag-and-drop zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`flex-1 w-full border border-dashed rounded-xl p-3 text-center transition-all ${
                  dragActive
                    ? 'border-[#FF5500] bg-[#FFF0EB]/50 dark:bg-[#35383c]'
                    : 'border-[#c7c7cc] dark:border-[#4d5055] hover:border-[#FF5500]'
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

                <p className="text-[11px] font-bold text-[#2C2C2E] dark:text-[#eff1f5] mb-1">
                  Upload Custom Profile Picture
                </p>
                <p className="text-[10px] text-[#8E8E93] dark:text-[#8e9095] mb-2.5">
                  Choose from your device gallery, take a camera snap, or drag & drop here
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingImage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#191c1f] border border-[#e5e5ea] dark:border-[#35383c] font-bold text-[11px] text-[#2C2C2E] dark:text-[#eff1f5] hover:border-[#FF5500] dark:hover:border-[#ffb4ac] hover:text-[#FF5500] dark:hover:text-[#ffb4ac] transition-colors cursor-pointer shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">folder_open</span>
                    {isProcessingImage ? 'Loading...' : 'Browse Gallery'}
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isProcessingImage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#191c1f] border border-[#e5e5ea] dark:border-[#35383c] font-bold text-[11px] text-[#2C2C2E] dark:text-[#eff1f5] hover:border-[#FF5500] dark:hover:border-[#ffb4ac] hover:text-[#FF5500] dark:hover:text-[#ffb4ac] transition-colors cursor-pointer shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">camera_alt</span>
                    Take Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Preset Selector */}
            <div>
              <p className="text-[10px] font-bold text-[#8E8E93] dark:text-[#8e9095] mb-1.5">
                Or pick a preset avatar:
              </p>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {PRESET_AVATARS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(preset.url)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                      avatarUrl === preset.url
                        ? 'border-[#FF5500] bg-[#FFF0EB] text-[#FF5500] dark:bg-[#35383c] dark:text-[#ffb4ac]'
                        : 'border-[#e5e5ea] dark:border-[#35383c] bg-white dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5]'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct URL input accordion */}
            <div className="pt-2 border-t border-[#e5e5ea] dark:border-[#35383c]">
              <label className="block text-[10px] font-bold text-[#8E8E93] dark:text-[#8e9095] mb-1">
                Or enter image Web URL:
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-[#e5e5ea] dark:border-[#35383c] rounded-lg px-2.5 py-1.5 pr-8 bg-white dark:bg-[#191c1f] text-[#2C2C2E] dark:text-[#eff1f5] text-[11px] focus:outline-none focus:border-[#FF5500]"
                />
                <span className="material-symbols-outlined text-[16px] text-[#8E8E93] absolute right-2.5 top-2 pointer-events-none">
                  link
                </span>
              </div>
            </div>
          </div>

          {/* Profile Text Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                Full Name <span className="text-[#FF5500]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-[#e5e5ea] dark:border-[#35383c] rounded-xl px-3.5 py-2.5 bg-white dark:bg-[#25282c] text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                Email Address
              </label>
              <input
                type="email"
                value={userProfile.email}
                readOnly
                disabled
                className="border border-[#e5e5ea] dark:border-[#35383c] rounded-xl px-3.5 py-2.5 bg-[#F7F7F8] dark:bg-[#191c1f] text-[#8E8E93] dark:text-[#8e9095] cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                Role / Designation <span className="text-[#FF5500]">*</span>
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border border-[#e5e5ea] dark:border-[#35383c] rounded-xl px-3.5 py-2.5 bg-white dark:bg-[#25282c] text-[#2C2C2E] dark:text-[#eff1f5] focus:outline-none focus:border-[#FF5500]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-[#2C2C2E] dark:text-[#eff1f5]">
                Store Branch
              </label>
              <input
                type="text"
                value={userProfile.branch}
                readOnly
                disabled
                title="Contact an admin to move branches"
                className="border border-[#e5e5ea] dark:border-[#35383c] rounded-xl px-3.5 py-2.5 bg-[#F7F7F8] dark:bg-[#191c1f] text-[#8E8E93] dark:text-[#8e9095] cursor-not-allowed"
              />
            </div>
          </div>

          {/* Modal Footer with Action Buttons */}
          <div className="pt-4 border-t border-[#e5e5ea] dark:border-[#35383c] flex items-center justify-end gap-2.5 shrink-0">
            <button
              id="cancel-edit-profile"
              type="button"
              onClick={() => setIsEditProfileModalOpen(false)}
              className="px-4 py-2.5 border border-[#e5e5ea] dark:border-[#35383c] rounded-xl hover:bg-[#F7F7F8] dark:hover:bg-[#25282c] font-bold text-xs text-[#2C2C2E] dark:text-[#eff1f5] cursor-pointer transition-colors"
            >
              {t.cancel}
            </button>
            <motion.button
              id="save-profile-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="bg-gradient-to-r from-[#FF5500] to-[#E04800] dark:from-[#b60013] dark:to-[#85000c] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              {t.save}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

