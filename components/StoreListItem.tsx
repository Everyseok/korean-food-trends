'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Clock, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StoreSubmissionData } from '@/types';

interface Props {
  store: StoreSubmissionData;
  isOptimistic?: boolean;
}

export function StoreListItem({ store, isOptimistic }: Props) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const isExpanded = hovered || clicked;

  const isPending = store.storeName === '등록 중...' || store.storeName === '상호명 확인 중';
  const isEnrichmentPending = store.moderationStatus === 'pending_enrichment';

  return (
    <div
      className={cn(
        'rounded-xl px-3 py-2.5 cursor-pointer select-none',
        'transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
        isExpanded
          ? 'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
          : 'hover:bg-[#F5F5F7]',
        (isOptimistic || isPending) && 'opacity-60'
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setClicked(c => !c)}
    >
      {/* Always-visible: store name */}
      <p
        className={cn(
          'text-[13px] font-medium leading-snug transition-colors duration-200',
          isExpanded ? 'text-[#1D1D1F]' : 'text-[#AEAEB2]',
          isPending && 'italic'
        )}
      >
        {store.storeName}
        {isEnrichmentPending && !isPending && (
          <span className="ml-1.5 text-[10px] text-[#C7C7CC] font-normal not-italic">
            · 정보 수집중
          </span>
        )}
      </p>

      {/* Expanded details */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
          isExpanded ? 'max-h-64 opacity-100 mt-2' : 'max-h-0 opacity-0'
        )}
      >
        {/* Thumbnail */}
        {store.thumbnailUrl && (
          <div className="relative w-full h-28 rounded-lg overflow-hidden bg-[#F2F2F7] mb-2">
            <Image
              src={store.thumbnailUrl}
              alt={store.storeName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {store.address && (
          <div className="flex items-start gap-1.5 mb-1.5">
            <MapPin className="w-3 h-3 text-[#98989D] mt-0.5 flex-shrink-0" />
            <span className="text-[11px] text-[#6E6E73] leading-snug">{store.address}</span>
          </div>
        )}

        {store.businessHours && (
          <div className="flex items-start gap-1.5 mb-1.5">
            <Clock className="w-3 h-3 text-[#98989D] mt-0.5 flex-shrink-0" />
            <span className="text-[11px] text-[#6E6E73] leading-snug">{store.businessHours}</span>
          </div>
        )}

        {!store.address && !store.businessHours && !isPending && (
          <p className="text-[11px] text-[#C7C7CC] mb-1.5">상세 정보 준비 중</p>
        )}

        <a
          href={store.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-[#0071E3] hover:underline transition-colors"
          onClick={e => e.stopPropagation()}
        >
          <ExternalLink className="w-3 h-3" />
          네이버 지도에서 보기
        </a>
      </div>
    </div>
  );
}
