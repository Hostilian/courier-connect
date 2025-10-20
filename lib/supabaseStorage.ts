import { supabase } from './supabaseClient';

// Upload file to Supabase Storage
export async function uploadFile(bucket: string, path: string, file: File) {
  return supabase.storage.from(bucket).upload(path, file);
}

// Download file from Supabase Storage
export async function downloadFile(bucket: string, path: string) {
  return supabase.storage.from(bucket).download(path);
}

// List files in a bucket
export async function listFiles(bucket: string, path: string) {
  return supabase.storage.from(bucket).list(path);
}
