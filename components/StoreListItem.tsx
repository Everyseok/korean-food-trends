'use client';

import { useState } from 'react';
import { MapPin, Clock, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StoreSubmissionData } from '@/types';

interface Props {
  store: StoreSubmissionData;
  isOptimistic?: boolean;
}

export function StoreListItem({ store, isOptimistic }: Props) {
  const [expanded, setExpanded] = useState(false);

  const isPending = store.storeName === '등록 중...';
  const displayName = store.storeName || '네이버 지도';

  return (
    <div
      className={cn(
        'relative py-[7px] cursor-pointer select-none group',
        (isOptimistic || isPending) && 'opacity-50'
      )}
      onClick={() => setExpanded(v => !v)}
    >
      {/* Left indicator bar */}
      <div
        className={cn(
          'absolute left-0 top-[10px] w-[2px] rounded-full transition-all duration-200',
          expanded ? 'h-[14px] bg-[#8E8E93]' : 'h-[10px] bg-[#E5E5EA] group-hover:bg-[#C7C7CC]'
        )}
      />

      {/* Store name */}
      <p
        className={cn(
          'pl-3 text-[12px] font-medium leading-snug truncate transition-colors duration-150',
          expanded
            ? 'text-[#1D1D1F]'
            : 'text-[#AEAEB2] group-hover:text-[#6E6E73]',
          isPending && 'italic'
        )}
      >
        {displayName}
      </p>

      {/* Expanded detail */}
      <div
        className={cn(
          'pl-3 overflow-hidden transition-all duration-200',
          expanded ? 'max-h-64 opacity-100 mt-1.5' : 'max-h-0 opacity-0'
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.25,0.46,0.45,0.94)' }}
      >
        {store.address && (
          <div className="flex items-start gap-1.5 mb-1">
            <MapPin className="w-3 h-3 text-[#AEAEB2] mt-[1px] flex-shrink-0" />
            <span className="text-[11px] text-[#6E6E73] leading-snug">{store.address}</span>
          </div>
        )}

        {store.businessHours && (
          <div className="flex items-start gap-1.5 mb-1">
            <Clock className="w-3 h-3 text-[#AEAEB2] mt-[1px] flex-shrink-0" />
            <span className="text-[11px] text-[#6E6E73] leading-snug">{store.businessHours}</span>
          </div>
        )}

        <a
          href={store.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-[#0071E3] hover:underline mt-0.5"
          onClick={e => e.stopPropagation()}
        >
          <ExternalLink className="w-2.5 h-2.5" />
          네이버 지도에서 보기
        </a>
      </div>
    </div>
  );
}
