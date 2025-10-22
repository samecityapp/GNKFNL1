'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

type BackButtonProps = {
  variant?: 'default' | 'overlay';
};

export function BackButton({ variant = 'default' }: BackButtonProps) {
  const router = useRouter();

  if (variant === 'overlay') {
    return (
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-20 flex items-center gap-1 bg-white/90 hover:bg-white backdrop-blur-sm text-gray-900 font-semibold px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Geri</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
    >
      <ChevronLeft className="h-5 w-5 mr-1" />
      Geri Dön
    </button>
  );
}
