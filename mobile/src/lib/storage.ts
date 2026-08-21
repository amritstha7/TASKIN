import { File } from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

import { supabase } from '@/lib/supabase';

export const BUCKETS = {
  taskPhotos: 'task-photos',
  communicationAttachments: 'communication-attachments',
  avatars: 'avatars',
} as const;

async function prepareImage(uri: string, maxDimension: number): Promise<{ uri: string; contentType: string }> {
  const result = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: maxDimension } }], {
    compress: 0.85,
    format: ImageManipulator.SaveFormat.JPEG,
  });
  return { uri: result.uri, contentType: 'image/jpeg' };
}

/**
 * Resizes/compresses an image (matching the original web app's canvas-based
 * downscale) and uploads it to a private bucket at `path`. Returns the
 * storage path — callers store this, not a URL, and resolve it to a
 * short-lived signed URL on read.
 */
export async function uploadImage(
  bucket: (typeof BUCKETS)[keyof typeof BUCKETS],
  path: string,
  localUri: string,
  maxDimension = 1200
): Promise<string> {
  const prepared = await prepareImage(localUri, maxDimension);
  const bytes = await new File(prepared.uri).bytes();
  const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType: prepared.contentType,
    upsert: true,
  });
  if (error) throw error;
  return path;
}

/** Uploads an arbitrary (non-image) file — used for communication attachments. */
export async function uploadFile(
  bucket: (typeof BUCKETS)[keyof typeof BUCKETS],
  path: string,
  localUri: string,
  contentType: string
): Promise<string> {
  const bytes = await new File(localUri).bytes();
  const { error } = await supabase.storage.from(bucket).upload(path, bytes, { contentType, upsert: true });
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
