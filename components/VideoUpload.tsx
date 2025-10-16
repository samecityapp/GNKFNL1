'use client';

import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { X, Upload, Video } from 'lucide-react';
import { uploadVideo, validateVideoFile, deleteVideo } from '@/lib/storage';

interface VideoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export default function VideoUpload({
  value,
  onChange,
  onRemove,
  disabled = false
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateVideoFile(file);
      setUploading(true);
      setProgress(0);

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const url = await uploadVideo(file, 'hotels');

      clearInterval(progressInterval);
      setProgress(100);

      onChange(url);

      setTimeout(() => {
        setProgress(0);
      }, 500);
    } catch (error) {
      console.error('Video upload error:', error);
      alert(error instanceof Error ? error.message : 'Video yükleme başarısız');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      await deleteVideo(value);
      onRemove?.();
    } catch (error) {
      console.error('Video delete error:', error);
      alert('Video silinirken bir hata oluştu');
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="hidden"
      />

      {value ? (
        <div className="relative aspect-[9/16] max-w-xs rounded-lg overflow-hidden bg-gray-900">
          <video
            src={value}
            className="w-full h-full object-cover"
            controls
            playsInline
          />
          {!disabled && (
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
          className="relative aspect-[9/16] max-w-xs border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer bg-gray-50 flex flex-col items-center justify-center"
        >
          {uploading ? (
            <div className="text-center px-4">
              <Upload className="w-12 h-12 text-blue-500 mx-auto mb-3 animate-pulse" />
              <p className="text-sm text-gray-600 mb-2">Yükleniyor...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{progress}%</p>
            </div>
          ) : (
            <div className="text-center px-4">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">Video Yükle</p>
              <p className="text-xs text-gray-500">MP4, WebM, MOV (max 100MB)</p>
              <p className="text-xs text-gray-400 mt-2">9:16 format önerilir</p>
            </div>
          )}
        </div>
      )}

      {!value && !uploading && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="w-full max-w-xs"
        >
          <Upload className="w-4 h-4 mr-2" />
          Video Seç
        </Button>
      )}
    </div>
  );
}
