'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FoodTrendData } from '@/types';

const STATUS = {
  active:   { label: '인기중', color: '#30D158' },
  cooling:  { label: '소강',   color: '#FF9F0A' },
  archived: { label: '종료',   color: '#C7C7CC' },
} as const;

interface Props {
  trend: FoodTrendData;
  isExpanded: boolean;
  onToggle: () => void;
  onAddStore: () => void;
}

export function FoodTrendCard({ trend, isExpanded, onToggle, onAddStore }: Props) {
  const [hovered, setHovered] = useState(false);
  const status = STATUS[trend.status] ?? STATUS.archived;
  const monthLabel = `'${String(trend.trendStartYear).slice(2)}.${String(trend.trendStartMonth).padStart(2, '0')}`;

  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onToggle}
    >
      {/* ── Image ─────────────────────────────────────────── */}
      <div
        className={cn(
          'relative w-full overflow-hidden bg-[#EBEBF0] transition-all duration-300',
          isExpanded && 'ring-1 ring-[#C7C7CC]/60'
        )}
        style={{ borderRadius: '13px', aspectRatio: '1 / 1' }}
      >
        <Image
          src={trend.imageUrl}
          alt={trend.name}
          fill
          className={cn(
            'object-cover transition-transform duration-700',
            hovered && 'scale-[1.04]'
          )}
          style={{ transitionTimingFunction: 'cubic-bezier(0.25,0.1,0.25,1)' }}
          unoptimized
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        {/* Month badge — top left */}
        <div
          className="absolute top-2.5 left-2.5 rounded-full px-2 py-[3px]"
          style={{ background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(8px)' }}
        >
          <span className="text-[9px] font-semibold text-white tracking-wide">{monthLabel}</span>
        </div>

        {/* Add store pill — appears on hover */}
        <button
          aria-label="판매점 추가"
          className={cn(
            'absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full px-2.5 py-[5px]',
            'shadow-sm transition-all duration-200',
            hovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-1 pointer-events-none'
          )}
          style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}
          onClick={e => {
            e.stopPropagation();
            onAddStore();
          }}
        >
          <Plus className="w-3 h-3 text-[#1D1D1F]" strokeWidth={2.5} />
          <span className="text-[11px] font-semibold text-[#1D1D1F]">추가</span>
        </button>
      </div>

      {/* ── Text ──────────────────────────────────────────── */}
      <div className="mt-[11px] px-0.5">
        {/* Status row */}
        <div className="flex items-center gap-1.5 mb-[5px]">
          <span
            className="w-[5px] h-[5px] rounded-full flex-shrink-0"
            style={{ background: status.color }}
          />
          <span className="text-[10px] text-[#AEAEB2] font-medium">{status.label}</span>
          {trend.stores.length > 0 && (
            <>
              <span className="text-[10px] text-[#D1D1D6]">·</span>
              <span className="text-[10px] text-[#C7C7CC]">{trend.stores.length}곳</span>
            </>
          )}
        </div>

        {/* Name */}
        <h2 className="text-[15px] font-semibold text-[#1D1D1F] tracking-[-0.01em] leading-snug">
          {trend.name}
        </h2>

        {/* Description — unclamped when expanded */}
        <p
          className={cn(
            'mt-[3px] text-[12px] text-[#8E8E93] leading-[1.58] transition-all duration-300',
            !isExpanded && 'line-clamp-2'
          )}
        >
          {trend.description}
        </p>
      </div>
    </div>
  );
}
