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

type TimelineItem =
  | { type: 'year'; year: number }
  | { type: 'trend'; trend: FoodTrendData };

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

  const years = Array.from(new Set(optimisticTrends.map(t => t.trendStartYear))).sort();
  const items: TimelineItem[] = [];
  for (const year of years) {
    items.push({ type: 'year', year });
    optimisticTrends
      .filter(t => t.trendStartYear === year)
      .forEach(t => items.push({ type: 'trend', trend: t }));
  }

  return (
    <div className="bg-[#F5F5F7] min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="pt-[96px] pb-16 px-6 select-none">
        <div className="max-w-lg mx-auto text-center">
          <p className="timeline-eyebrow block mb-5">
            K-Food Trends
          </p>
          <h1 className="timeline-hero-title">
            대유행은<br />어디까지 갈까?
          </h1>
          <p className="mt-5 text-[16px] leading-[1.7] text-[#6E6E73] max-w-xs mx-auto">
            2020년부터 지금까지,<br />한국을 달군 음식 트렌드.
          </p>
        </div>
        {/* Decorative axis */}
        <div className="mt-14 flex items-center justify-center gap-3.5">
          <div className="h-px w-10 bg-[#E5E5EA]" />
          <div className="w-[3px] h-[3px] rounded-full bg-[#D1D1D6]" />
          <div className="h-px w-10 bg-[#E5E5EA]" />
        </div>
      </header>

      {/* ── Scroll hint label ────────────────────────────────── */}
      <div className="flex justify-center mb-6">
        <p className="text-[10px] font-medium tracking-[0.15em] text-[#C7C7CC] uppercase select-none">
          2020 →
        </p>
      </div>

      {/* ── Timeline ─────────────────────────────────────────── */}
      <div
        className="timeline-scroll overflow-x-auto"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Relative wrapper — must be max-content wide for absolute rail to span correctly */}
        <div
          className="relative"
          style={{ minWidth: 'max-content', padding: '0 72px 96px' }}
        >
          {/* Rail — absolute, spans full content width */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: '34px',
              left: '72px',
              right: '72px',
              height: '1px',
              background: '#E8E8ED',
            }}
          />

          {/* Single horizontal flex row */}
          <div className="flex items-start">
            {items.map((item, idx) => {
              /* ── Year marker ── */
              if (item.type === 'year') {
                const isFirst = idx === 0;
                return (
                  <div
                    key={`y-${item.year}`}
                    className="flex-shrink-0"
                    style={{ marginRight: '10px', marginLeft: isFirst ? '0' : '36px' }}
                  >
                    <div
                      className="relative z-10 rounded-full px-3 py-[3px] whitespace-nowrap"
                      style={{
                        marginTop: '25px',
                        background: '#F5F5F7',
                        border: '1px solid #E8E8ED',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          letterSpacing: '0.12em',
                          color: '#8E8E93',
                        }}
                      >
                        {item.year}
                      </span>
                    </div>
                  </div>
                );
              }

              /* ── Trend node ── */
              const trend = item.trend;
              return (
                <div
                  key={trend.id}
                  className="relative flex-shrink-0"
                  style={{ width: '228px', marginRight: '18px' }}
                >
                  {/* Rail dot */}
                  <div
                    className="absolute z-10 rounded-full bg-white"
                    style={{
                      width: '7px',
                      height: '7px',
                      border: '1.5px solid #C7C7CC',
                      top: '30.5px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  />
                  {/* Stem */}
                  <div
                    className="absolute bg-[#EBEBEB]"
                    style={{
                      width: '1px',
                      top: '37.5px',
                      height: '20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  />
                  {/* Content */}
                  <div style={{ paddingTop: '58px' }}>
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
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────── */}
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
    </div>
  );
}
