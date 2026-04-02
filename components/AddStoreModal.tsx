'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Link } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FoodTrendData } from '@/types';

interface Props {
  trend: FoodTrendData;
  onClose: () => void;
  onSubmit: (url: string) => void;
}

function isLikelyNaverUrl(url: string): boolean {
  try {
    const u = new URL(url.trim());
    return (
      u.hostname === 'map.naver.com' ||
      u.hostname === 'm.map.naver.com' ||
      u.hostname === 'place.naver.com' ||
      u.hostname === 'm.place.naver.com' ||
      u.hostname === 'naver.me'
    );
  } catch {
    return false;
  }
}

export function AddStoreModal({ trend, onClose, onSubmit }: Props) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.classList.add('modal-open');
    inputRef.current?.focus();
    return () => document.body.classList.remove('modal-open');
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = url.trim();
    if (!trimmed) {
      setError('네이버 지도 링크를 붙여넣어 주세요.');
      return;
    }
    if (!isLikelyNaverUrl(trimmed)) {
      setError('네이버 지도 링크만 등록할 수 있습니다. (map.naver.com 또는 naver.me)');
      return;
    }

    setSubmitting(true);
    try {
      onSubmit(trimmed);
      // onSubmit calls close itself via parent; but let's close here too
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 modal-backdrop bg-black/30" />

      <div
        className="relative z-10 w-full sm:max-w-sm bg-white sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-[17px] font-semibold text-[#1D1D1F]">판매점 추가</h2>
            <p className="text-[13px] text-[#8E8E93] mt-0.5">{trend.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center hover:bg-[#E5E5EA] transition-colors"
            aria-label="닫기"
          >
            <X className="w-4 h-4 text-[#6E6E73]" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#F2F2F7] mx-6" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pt-5 pb-6">
          <label className="block text-[12px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-2">
            네이버 지도 링크
          </label>

          <div className={cn(
            'flex items-center gap-2 rounded-xl border bg-[#F5F5F7] px-3 py-2.5',
            'transition-colors duration-150',
            error ? 'border-red-400 bg-red-50' : 'border-transparent focus-within:border-[#0071E3] focus-within:bg-white'
          )}>
            <Link className="w-4 h-4 text-[#AEAEB2] flex-shrink-0" />
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={e => { setUrl(e.target.value); setError(''); }}
              placeholder="https://map.naver.com/v5/entry/place/..."
              className="flex-1 bg-transparent text-[14px] text-[#1D1D1F] placeholder-[#C7C7CC] outline-none min-w-0"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>

          {error && (
            <p className="mt-2 text-[12px] text-red-500 leading-snug">{error}</p>
          )}

          <p className="mt-2 text-[11px] text-[#AEAEB2] leading-snug">
            네이버 지도에서 판매점을 찾은 뒤 공유 링크를 붙여넣어 주세요.
          </p>

          <button
            type="submit"
            disabled={submitting || !url.trim()}
            className={cn(
              'mt-5 w-full py-3.5 rounded-2xl font-semibold text-[15px] transition-all duration-150',
              submitting || !url.trim()
                ? 'bg-[#E5E5EA] text-[#AEAEB2] cursor-not-allowed'
                : 'bg-[#0071E3] hover:bg-[#0077ED] active:bg-[#005BB5] text-white'
            )}
          >
            {submitting ? '등록 중...' : '추가하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
