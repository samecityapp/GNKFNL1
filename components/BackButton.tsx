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
        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all active:scale-95"
      >
        <ChevronLeft className="h-6 w-6 text-gray-900" />
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
