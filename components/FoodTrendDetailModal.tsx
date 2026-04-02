'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, Plus } from 'lucide-react';
import type { FoodTrendData } from '@/types';

interface Props {
  trend: FoodTrendData;
  onClose: () => void;
  onAddStore: () => void;
}

export function FoodTrendDetailModal({ trend, onClose, onAddStore }: Props) {
  // Lock body scroll
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 modal-backdrop bg-black/30" />

      {/* Modal card */}
      <div
        className="relative z-10 w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors"
          aria-label="닫기"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Food image */}
        <div className="relative w-full aspect-[16/10] bg-[#F2F2F7]">
          <Image
            src={trend.imageUrl}
            alt={trend.name}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-[#1D1D1F] tracking-tight">
            {trend.name}
          </h2>
          <p className="mt-2 text-[14px] text-[#6E6E73] leading-relaxed">
            {trend.description}
          </p>

          <div className="mt-5 flex items-center gap-2">
            <span className="text-[13px] text-[#98989D]">
              판매점 {trend.stores.length}개 등록됨
            </span>
          </div>

          {/* Add store CTA */}
          <button
            onClick={onAddStore}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#005BB5] text-white font-semibold text-[15px] rounded-2xl py-3.5 transition-colors duration-150"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            판매점 위치 추가
          </button>
        </div>
      </div>
    </div>
  );
}
