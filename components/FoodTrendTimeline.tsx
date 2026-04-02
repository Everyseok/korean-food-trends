'use client';

import { useOptimistic, useTransition, useState, useRef, useEffect } from 'react';
import { FoodTrendCard } from './FoodTrendCard';
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
  const [expandedTrendId, setExpandedTrendId] = useState<string | null>(null);
  const [addingForTrend, setAddingForTrend] = useState<FoodTrendData | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the right (latest trends) on first render
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

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
      <header className="pt-10 pb-5 px-6 select-none">
        <div className="text-center">
          <p className="timeline-eyebrow block mb-3">
            K-Food Trends
          </p>
          <h1 className="timeline-hero-title whitespace-nowrap">
            대유행은 어디까지 갈까?
          </h1>
          <p className="mt-3 text-[12px] leading-[1.6] text-[#AEAEB2]">
            2020년부터 지금까지, 한국을 달군 음식 트렌드.
          </p>
        </div>
      </header>

      {/* ── Timeline ─────────────────────────────────────────── */}
      <div
        ref={scrollRef}
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
              const isExpanded = expandedTrendId === trend.id;
              return (
                <div
                  key={trend.id}
                  className="relative flex-shrink-0"
                  style={{ width: '228px', marginRight: '18px' }}
                >
                  {/* Rail dot — filled when expanded */}
                  <div
                    className="absolute z-10 rounded-full transition-all duration-200"
                    style={{
                      width: '7px',
                      height: '7px',
                      background: isExpanded ? '#6E6E73' : 'white',
                      border: `1.5px solid ${isExpanded ? '#6E6E73' : '#C7C7CC'}`,
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
                      isExpanded={isExpanded}
                      onToggle={() =>
                        setExpandedTrendId(prev => (prev === trend.id ? null : trend.id))
                      }
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

      {/* ── Add Store Modal ───────────────────────────────────── */}
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
