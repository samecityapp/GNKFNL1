import { supabase } from './supabase';

const BUCKET_NAME = 'hotel-images';
const VIDEO_BUCKET_NAME = 'hotel-videos';

export async function uploadImage(file: File, path: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${path}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split(`/storage/v1/object/public/${BUCKET_NAME}/`);

    if (pathParts.length < 2) {
      throw new Error('Invalid image URL');
    }

    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

export function validateImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024;

  if (!validTypes.includes(file.type)) {
    throw new Error('Sadece JPG, PNG ve WebP formatları desteklenmektedir.');
  }

  if (file.size > maxSize) {
    throw new Error('Dosya boyutu maksimum 5MB olabilir.');
  }

  return true;
}

export async function uploadVideo(file: File, path: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${path}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(VIDEO_BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Video yükleme başarısız: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(VIDEO_BUCKET_NAME)
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function deleteVideo(url: string): Promise<void> {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split(`/storage/v1/object/public/${VIDEO_BUCKET_NAME}/`);

    if (pathParts.length < 2) {
      throw new Error('Geçersiz video URL');
    }

    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from(VIDEO_BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      throw new Error(`Video silme başarısız: ${error.message}`);
    }
  } catch (error) {
    console.error('Video silme hatası:', error);
    throw error;
  }
}

export function validateVideoFile(file: File): boolean {
  const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
  const maxSize = 100 * 1024 * 1024; // 100MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Sadece MP4, WebM, MOV ve AVI formatları desteklenmektedir.');
  }

  if (file.size > maxSize) {
    throw new Error('Video boyutu maksimum 100MB olabilir.');
  }

  return true;
}
