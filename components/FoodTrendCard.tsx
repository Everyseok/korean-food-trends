'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FoodTrendData } from '@/types';

const STATUS_CONFIG = {
  active: { label: '인기중', dot: 'bg-emerald-400' },
  cooling: { label: '소강', dot: 'bg-amber-400' },
  archived: { label: '종료', dot: 'bg-gray-300' },
};

interface Props {
  trend: FoodTrendData;
  onOpenDetail: () => void;
  onAddStore: () => void;
}

export function FoodTrendCard({ trend, onOpenDetail, onAddStore }: Props) {
  const [hovered, setHovered] = useState(false);
  const statusCfg = STATUS_CONFIG[trend.status] ?? STATUS_CONFIG.active;
  const monthLabel = `${trend.trendStartYear}.${String(trend.trendStartMonth).padStart(2, '0')}`;

  return (
    <div
      className={cn(
        'relative rounded-2xl overflow-hidden bg-white cursor-pointer',
        'transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
        hovered
          ? 'shadow-[0_8px_30px_rgba(0,0,0,0.10)]'
          : 'shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpenDetail}
    >
      {/* Food image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#F2F2F7]">
        <Image
          src={trend.imageUrl}
          alt={trend.name}
          fill
          className={cn(
            'object-cover transition-transform duration-500',
            hovered && 'scale-105'
          )}
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Month badge */}
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
          <span className="text-[10px] font-semibold text-white tracking-wide">{monthLabel}</span>
        </div>

        {/* Store count */}
        {trend.stores.length > 0 && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3]" />
            <span className="text-[11px] font-semibold text-[#1D1D1F]">
              {trend.stores.length}개 판매점
            </span>
          </div>
        )}

        {/* Add store button */}
        <button
          aria-label="판매점 추가"
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md',
            'flex items-center justify-center',
            'transition-all duration-200',
            hovered
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-75 pointer-events-none'
          )}
          onClick={e => {
            e.stopPropagation();
            onAddStore();
          }}
        >
          <Plus className="w-4 h-4 text-[#1D1D1F]" strokeWidth={2.5} />
        </button>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className={cn('w-1.5 h-1.5 rounded-full', statusCfg.dot)} />
          <span className="text-[10px] font-medium text-[#8E8E93]">{statusCfg.label}</span>
        </div>
        <h2 className="text-[15px] font-semibold text-[#1D1D1F] tracking-tight">
          {trend.name}
        </h2>
        <p className="mt-1 text-[12px] text-[#8E8E93] leading-relaxed line-clamp-2">
          {trend.description}
        </p>
      </div>
    </div>
  );
}
