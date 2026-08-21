/**
 * Downscales an image file to fit within `maxDimension` (longest side) and
 * re-encodes it as JPEG, resolving a Blob suitable for Supabase Storage
 * upload. Shared by EditProfileModal, TaskPhotoProofModal, and MediaScreen,
 * which previously each had their own near-identical FileReader/canvas copy
 * ending in `canvas.toDataURL(...)` (base64, for localStorage) instead of
 * `canvas.toBlob(...)`.
 */
export function resizeImageToBlob(file: File, maxDimension: number, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to encode image'));
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to parse selected image'));
      if (event.target?.result) img.src = event.target.result as string;
    };

    reader.onerror = () => reject(new Error('Error reading file from device'));
    reader.readAsDataURL(file);
  });
}
