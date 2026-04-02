'use client';

import { Plus } from 'lucide-react';
import { StoreListItem } from './StoreListItem';
import { EmptyState } from './EmptyState';
import type { StoreSubmissionData } from '@/types';

interface Props {
  stores: StoreSubmissionData[];
  onAddStore: () => void;
}

export function StoreList({ stores, onAddStore }: Props) {
  const published = stores.filter(s => s.moderationStatus === 'published');
  const optimistic = stores.filter(s => s.id.startsWith('optimistic-'));

  return (
    <div className="mt-3 flex flex-col gap-0.5">
      {/* Section label */}
      <div className="flex items-center justify-between px-3 mb-1">
        <span className="text-[11px] font-semibold tracking-wider text-[#C7C7CC] uppercase">
          판매점
        </span>
        <button
          onClick={onAddStore}
          className="flex items-center gap-0.5 text-[11px] text-[#AEAEB2] hover:text-[#6E6E73] transition-colors"
          aria-label="판매점 추가"
        >
          <Plus className="w-3 h-3" />
          추가
        </button>
      </div>

      {/* Optimistic (pending) items shown first */}
      {optimistic.map(store => (
        <StoreListItem key={store.id} store={store} isOptimistic />
      ))}

      {/* Confirmed stores */}
      {published.length === 0 && optimistic.length === 0 ? (
        <EmptyState onAddStore={onAddStore} />
      ) : (
        published.map(store => (
          <StoreListItem key={store.id} store={store} />
        ))
      )}
    </div>
  );
}
