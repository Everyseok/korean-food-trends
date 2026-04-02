'use client';

import { useOptimistic, useTransition, useState } from 'react';
import { FoodTrendCard } from './FoodTrendCard';
import { FoodTrendDetailModal } from './FoodTrendDetailModal';
import { AddStoreModal } from './AddStoreModal';
import { StoreList } from './StoreList';
import { SubmissionToast } from './SubmissionToast';
import { submitStore } from '@/actions/submit-store';
import type { FoodTrendData, StoreSubmissionData, ToastState } from '@/types';

interface Props {
  trends: FoodTrendData[];
}

export function FoodTrendTimeline({ trends }: Props) {
  const [selectedTrend, setSelectedTrend] = useState<FoodTrendData | null>(null);
  const [addingForTrend, setAddingForTrend] = useState<FoodTrendData | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [, startTransition] = useTransition();

  const [optimisticTrends, addOptimisticStore] = useOptimistic(
    trends,
    (state: FoodTrendData[], payload: { trendId: string; store: StoreSubmissionData }) =>
      state.map(t =>
        t.id === payload.trendId ? { ...t, stores: [payload.store, ...t.stores] } : t
      )
  );

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = (trendId: string, sourceUrl: string) => {
    const optimisticStore: StoreSubmissionData = {
      id: `optimistic-${Date.now()}`,
      foodTrendId: trendId,
      sourceUrl,
      sourcePlatform: 'naver_map',
      storeName: '등록 중...',
      address: null,
      businessHours: null,
      thumbnailUrl: null,
      moderationStatus: 'published',
      createdAt: new Date().toISOString(),
    };

    setAddingForTrend(null);

    startTransition(async () => {
      addOptimisticStore({ trendId, store: optimisticStore });
      const result = await submitStore({ foodTrendId: trendId, sourceUrl });
      if (result.success) {
        showToast('success', '판매점이 등록되었습니다.');
      } else {
        showToast('error', result.error);
      }
    });
  };

  // Group by year for roadmap headers
  const years = Array.from(new Set(optimisticTrends.map(t => t.trendStartYear))).sort();

  return (
    <>
      {/* Page header */}
      <header className="px-6 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-2">
          <p className="text-xs font-semibold tracking-widest text-[#8E8E93] uppercase mb-3">
            Food Trends
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] tracking-tight leading-tight">
            대유행은 어디까지 갈까?
          </h1>
          <p className="mt-3 text-[#6E6E73] text-lg max-w-xl">
            2020년부터 지금까지, 한국을 달군 음식 트렌드의 타임라인.
          </p>
        </div>
      </header>

      {/* Timeline — one row per year */}
      <div className="pb-20">
        {years.map(year => {
          const yearTrends = optimisticTrends.filter(t => t.trendStartYear === year);
          return (
            <section key={year} className="mb-10">
              {/* Year label */}
              <div className="px-6 md:px-8 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-semibold text-[#1D1D1F] tracking-tight">
                    {year}
                  </span>
                  <div className="flex-1 h-px bg-[#E5E5EA]" />
                </div>
              </div>

              {/* Horizontal scroll row for this year */}
              <div className="timeline-scroll overflow-x-auto">
                <div
                  className="flex gap-5 px-6 md:px-8"
                  style={{ minWidth: 'max-content', paddingBottom: '2px' }}
                >
                  {yearTrends.map((trend, index) => (
                    <div key={trend.id} className="w-72 flex-shrink-0 flex flex-col">
                      {/* Position within year */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-semibold text-[#C7C7CC] tracking-wide">
                          {String(trend.trendStartMonth).padStart(2, '0')}월
                        </span>
                        <div
                          className={`h-px flex-1 ${index < yearTrends.length - 1 ? 'bg-[#E5E5EA]' : 'bg-transparent'}`}
                        />
                      </div>

                      <FoodTrendCard
                        trend={trend}
                        onOpenDetail={() => setSelectedTrend(trend)}
                        onAddStore={() => setAddingForTrend(trend)}
                      />

                      <StoreList
                        stores={trend.stores}
                        onAddStore={() => setAddingForTrend(trend)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {selectedTrend && (
        <FoodTrendDetailModal
          trend={selectedTrend}
          onClose={() => setSelectedTrend(null)}
          onAddStore={() => {
            setAddingForTrend(selectedTrend);
            setSelectedTrend(null);
          }}
        />
      )}

      {addingForTrend && (
        <AddStoreModal
          trend={addingForTrend}
          onClose={() => setAddingForTrend(null)}
          onSubmit={url => handleSubmit(addingForTrend.id, url)}
        />
      )}

      {toast && <SubmissionToast toast={toast} />}
    </>
  );
}
