import { supabase } from './supabase';

export const BUCKETS = {
  taskPhotos: 'task-photos',
  communicationAttachments: 'communication-attachments',
  avatars: 'avatars',
} as const;

/**
 * Uploads an already-resized image blob (see canvasResize.ts) to a private
 * bucket at `path`. Returns the storage path — callers store this, not a
 * URL, and resolve it to a short-lived signed URL on read.
 */
export async function uploadImage(
  bucket: (typeof BUCKETS)[keyof typeof BUCKETS],
  path: string,
  blob: Blob,
  contentType = 'image/jpeg'
): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, blob, {
    contentType,
    upsert: true,
  });
  if (error) throw error;
  return path;
}

/** Uploads an arbitrary (non-image) file — used for communication attachments. */
export async function uploadFile(
  bucket: (typeof BUCKETS)[keyof typeof BUCKETS],
  path: string,
  file: Blob,
  contentType: string
): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType, upsert: true });
  if (error) throw error;
  return path;
}

export async function getSignedUrl(
  bucket: (typeof BUCKETS)[keyof typeof BUCKETS],
  path: string,
  expiresInSeconds = 3600
): Promise<string | null> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds);
  if (error) return null;
  return data.signedUrl;
}

export function getPublicUrl(bucket: (typeof BUCKETS)[keyof typeof BUCKETS], path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/** Batch-signs multiple paths in one round trip; returns a path -> signedUrl map (missing/failed entries are omitted). */
export async function getSignedUrlsBatch(
  bucket: (typeof BUCKETS)[keyof typeof BUCKETS],
  paths: string[],
  expiresInSeconds = 3600
): Promise<Record<string, string>> {
  if (paths.length === 0) return {};
  const { data, error } = await supabase.storage.from(bucket).createSignedUrls(paths, expiresInSeconds);
  if (error || !data) return {};
  const map: Record<string, string> = {};
  data.forEach((entry, index) => {
    if (entry.signedUrl) map[paths[index]] = entry.signedUrl;
  });
  return map;
}

export async function deleteFromBucket(
  bucket: (typeof BUCKETS)[keyof typeof BUCKETS],
  paths: string[]
): Promise<void> {
  if (paths.length === 0) return;
  await supabase.storage.from(bucket).remove(paths);
}
