'use client';

import { Plus } from 'lucide-react';
import { StoreListItem } from './StoreListItem';
import type { StoreSubmissionData } from '@/types';

interface Props {
  stores: StoreSubmissionData[];
  onAddStore: () => void;
}

export function StoreList({ stores, onAddStore }: Props) {
  const optimistic = stores.filter(s => s.id.startsWith('optimistic-'));
  const published  = stores.filter(s => s.moderationStatus === 'published');
  const all        = [...optimistic, ...published];

  return (
    <div className="mt-4 px-0.5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#C7C7CC]">
          링크 등록{all.length > 0 ? ` · ${all.length}` : ''}
        </span>
        <button
          onClick={onAddStore}
          className="flex items-center gap-0.5 text-[#AEAEB2] hover:text-[#6E6E73] transition-colors duration-150"
          aria-label="판매점 추가"
        >
          <Plus className="w-3 h-3" />
          <span className="text-[10px] font-medium">추가</span>
        </button>
      </div>

      {all.length === 0 ? (
        <button
          onClick={onAddStore}
          className="w-full flex items-center gap-2 py-2 px-0 text-left group"
        >
          <div className="w-4 h-4 rounded-full border border-[#E5E5EA] flex items-center justify-center flex-shrink-0 group-hover:border-[#C7C7CC] transition-colors duration-150">
            <Plus className="w-2.5 h-2.5 text-[#D1D1D6] group-hover:text-[#AEAEB2] transition-colors duration-150" />
          </div>
          <span className="text-[11px] text-[#C7C7CC] group-hover:text-[#8E8E93] transition-colors duration-150">
            첫 링크 등록
          </span>
        </button>
      ) : (
        <div>
          {all.map(store => (
            <StoreListItem
              key={store.id}
              store={store}
              isOptimistic={store.id.startsWith('optimistic-')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
